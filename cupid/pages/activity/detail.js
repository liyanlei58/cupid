const app = getApp();
var sysUser = require('../../js/db/sysUser.js');
var activity = require('../../js/db/activity.js');
var activityJoinCode = require('../../js/db/activityJoinCode.js');
var activityJoin = require('../../js/db/activityJoin.js');
var util = require('../../js/util.js');
var Const = require('../../js/const.js');
var common = require('../../js/common.js');
var pageSize = 20;
Page({
  data: {
    skin: app.globalData.skin,
    modalName: "activity",
    today: util.formatDay(new Date()),
    showLoading: true,
    activity: '',
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

    // 是否参加过活动
    this.checkJoined(activityId);

  },

  formReset: function() {
    console.log('form发生了reset事件')
  },

  // 查询活动详情
  getActivity: function(activityId) {
    var that = this;
    activity.getActivityById(activityId, function(data) {
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
          title: data.name
        });
      }
    });
  },

  // 是否参加过活动
  checkJoined: function(activityId) {
    var that = this;
    var openid = app.globalData.openid;
    if (openid != null) {
      activityJoin.getActivityUser(activityId, openid, function(data) {
        if (data.length > 0) {
          that.setData({
            joined: true
          })
        }
      });
    }
  },

  //参加活动 - 点击参加活动btn
  joinActivity: function(e) {
    var that = this;
    var activity_join = {};
    var userInfo = app.globalData.userInfo;
    if (userInfo == null) {
      that.toastPersonInfoIsNull();
      return;
    }

    var code = e.detail.value.code;
    if (code == ""){
      common.toastError("请输入活动参与码");
      return
    }
    console.log("code: ", code);
    if (code == Const.Code.JoinActivity.VALUE ){
      //活动参与码为默认的参与码
      that.doJoinActivity(userInfo)
      return
    }
    activityJoinCode.getActivityCode(that.data.activity._id, function(realCode) {
      //校验活动参与码
      if (realCode == null || realCode != code) {
        wx.showToast({
          icon: 'none',
          title: '活动参与码错误'
        })
      }else{
        //活动参与码正确
        that.doJoinActivity(userInfo)
      }
    });

  },

  //提示个人信息为空
  doJoinActivity: function (userInfo) {
    var that = this
    if (userInfo.hometown == null || userInfo.job == null || userInfo.birthday == null) {
      that.queryUserAndJoin(that.data.activity);
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


  //查询用户，添加参与人员
  queryUserAndJoin: function(activity) {
    var that = this;
    //用户信息为空，查询用户
    sysUser.getUserByOpenid(app.globalData.openid, function(data) {
      if (data == null || data.length == 0) {
        that.toastPersonInfoIsNull();
      } else {
        var userInfo = data[0];
        if (userInfo.hometown == null || userInfo.job == null || userInfo.birthday == null) {
          that.toastPersonInfoIsNull();
        } else {
          //已填写用户信息
          that.doJoin(activity, userInfo);
        }
      }
    });
  },

  //添加参与人员
  doJoin: function(activity, user) {
    var activity_join = {
      activity: activity,
      user: user
    };
    console.log("activity_join add : ", activity_join);
    var that = this;
    activityJoin.addActivityUser(activity_join, function(dataId) {
      if (dataId != null) {
        that.setData({
          joined: true
        })
      }
    })
  },




})