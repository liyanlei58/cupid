const app = getApp();
var activityDb = require('../../../../js/db/activity.js');
var activityJoinCodeDb = require('../../../../js/db/activityJoinCode.js');
var util = require('../../../../js/util.js');

const db = wx.cloud.database();
var pageSize = 20;
Page({
  data: {
    skin: app.globalData.skin,
    modalName: "admin_activity",
    showLoading: true,
    activity: '',
    today: util.formatDay(new Date()),
    code: ''
  },
  onLoad: function(options) {
    var that = this;
    // console.log("skin", that.data.skin)

    var activityId = options.id;
    if (activityId == null || activityId == "undefined") {
      this.setData({
        showLoading: false
      });
      wx.showToast({
        icon: 'none',
        title: '活动ID为空'
      })
      return;
    }

    // wx.setNavigationBarTitle({
    //   title: "活动详情"
    // });

    // 查询活动详情
    this.getActivity(activityId);

  },
  
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    //设置背景颜色
    var that = this
    that.setData({
      skin: app.globalData.skin
    })
  },

  // 查询活动详情
  getActivity: function(activityId) {
    var that = this;
    activityDb.getActivityById(activityId, function(data) {
      if (data != null || data != '') {
        var contentstr = data.content
        if (contentstr != null && contentstr != ""){
          data.contentArray = contentstr.split("\n");
        }
        that.setData({
          activity: data,
          showLoading: false
        })
        wx.setNavigationBarTitle({
          title: data.name
        });
      }
    });
  },

  // 生成活动参与码
  generateCode: function(e) {
    var that = this;
    activityJoinCodeDb.generateActivityCode(that.data.activity._id, function (code) {
      if (code != null) {
        that.setData({
          code: code
        })
      }
    });
  },

  


})