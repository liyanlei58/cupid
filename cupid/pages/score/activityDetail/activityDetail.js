const app = getApp();
var userDB = require('../../js/user.js');
var activityDB = require('../../js/activityDB.js');
var activityUserDB = require('../../js/activityUserDB.js');
const db = wx.cloud.database();
var pageSize = 20;
Page({
  data: {
    skin: app.globalData.skin,
    modalName: "score",
    showLoading: true,
    activity: '',
    hasMore: false,
    userInfo: app.globalData.userInfo,
    joined: false,
    start: 0,
    activityUserList: []
  },
  onLoad: function(options) {
    var that = this;
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

    // 查询参与人员
    this.findNextPage(activityId);

  },

  // 查询活动详情
  getActivity: function(activityId) {
    var that = this;
    activityDB.getActivityById(activityId, function(data) {
      if (data != null || data != '') {
        var contentstr = data.content
        if (contentstr != null && contentstr != "") {
          data.contentArray = contentstr.split("\n");
        }
        that.setData({
          activity: data,
          showLoading: false
        })
        wx.setNavigationBarTitle({
          title: that.data.activity.name
        });
      }
    });
  },

  //下滑
  scrollToLower: function() {
    findNextPage(this.data.activity._id);
  },

  //查询下一页的数据
  findNextPage: function (activityId) {
    var that = this
    activityUserDB.findPageActivityUser(activityId, that.data.start, pageSize, function(data) {
      if (data.length == 0) {
        that.setData({
          showLoading: false,
          hasMore: false
        });
      } else {
        if (data.length < pageSize) {
          that.setData({
            showLoading: false,
            activityUserList: that.data.activityUserList.concat(data),
            start: that.data.start + data.length,
            hasMore: false
          });
        } else {
          that.setData({
            showLoading: false,
            activityUserList: that.data.activityUserList.concat(data),
            start: that.data.start + data.length,
            hasMore: true
          });
        }

      }
    });
  },

  // 参与人员详情
  toPerson: function(e) {
    var that = this;
    var ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../person/person?personOpenid=' + ds.id + '&activityId=' + that.data.activity._id
    })
  },

  //参加活动 - 点击参加活动btn
  joinActivity: function() {
    var that = this;
    var activity_user = {};
    var userInfo = app.globalData.userInfo;
    if (userInfo == null) {
      that.toastPersonInfoIsNull();
      return;
    }

    if (userInfo.hometown == null || userInfo.job == null || userInfo.birthday == null) {
      //用户信息为空，查询用户
      userDB.getUserByOpenid(app.globalData.openid, function(data) {
        if (data == null || data.length == 0) {
          that.toastPersonInfoIsNull();
        } else {
          userInfo = data[0];
          if (userInfo.hometown == null || userInfo.job == null || userInfo.birthday == null) {
            that.toastPersonInfoIsNull();
          } else {
            //已填写用户信息
            that.doJoin(that.data.activity, userInfo);
          }
        }
      });
      return;
    }

    //已填写用户信息
    that.doJoin(that.data.activity, userInfo);

  },

  //提示个人信息为空
  toastPersonInfoIsNull: function() {
    wx.showToast({
      icon: 'none',
      title: "请先在'我的'填写您的个人信息，才可参与活动"
    })
  },


  //添加参与人员
  doJoin: function(activity, user) {
    var activity_user = {
      activity: activity,
      user: user
    };
    console.log("activity_user add : ", activity_user);
    var that = this;
    activityUserDB.addActivityUser(activity_user, function(dataId) {
      if (dataId != null) {
        that.setData({
          joined: true
        })
        //重新刷新列表
        that.findNextPage();
      }
    })
  },


  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  



})