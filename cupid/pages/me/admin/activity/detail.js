const app = getApp();
var activity = require('../../../../js/db/activity.js');
var activityJoinCode = require('../../../../js/db/activityJoinCode.js');
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

  // 查询活动详情
  getActivity: function(activityId) {
    var that = this;
    activity.getActivityById(activityId, function(data) {
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
    activityJoinCode.generateActivityCode(that.data.activity._id, function (code) {
      if (code != null) {
        that.setData({
          code: code
        })
      }
    });
  },


  // 删除活动
  // removeActivity: function (e) {
  //   var that = this;
  //   activity.getActivityById(that.data.activity._id, function (activityExist) {
  //     if (activityExist == null){
  //       wx.showToast({
  //         icon: 'none',
  //         title: '活动不存在'
  //       })
  //     }else{
  //       var now = util.formatDay(new Date());
  //       if (activityExist.date <= now){
  //         wx.showToast({
  //           icon: 'none',
  //           title: '活动已结束，不可以删除'
  //         })
  //       }else{
  //         activity.removeActivityById(that.data.activity._id, function (count) {
  //           if (count == 0) {
  //             wx.showToast({
  //               icon: 'none',
  //               title: '删除失败'
  //             })
  //           } else {
  //             wx.showToast({
  //               title: '删除成功'
  //             })
  //             wx.redirectTo({
  //               url: '../list/list'
  //             })
  //           }
  //         });
  //       }
  //     }
  //   })
    
  // },

  


})