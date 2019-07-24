const app = getApp();
var activityDb = require('../../js/db/activity.js');
var util = require('../../js/util.js');
var common = require('../../js/common.js');
var Const = require('../../js/const.js');
var pageSize = 20;
Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    skin: app.globalData.skin,
    modalName: "activity",
    today: util.formatDay(new Date()),
    openid: '',
    activityList: [],
    hasMore: false,
    showLoading: true,
    start: 0
  },

  lifetimes: {
    //在组件实例进入页面节点树时执行
    attached() {
      var that = this;
      
      if (app.globalData.openid) {
        that.setData({
          skin: app.globalData.skin,
          openid: app.globalData.openid
        })
      }
      //背景设置
      //背景设置
      if (app.globalData.openid != "" && app.globalData.skin == "") {
        common.setBackground(app.globalData.openid, function (globalSkin) {
          app.globalData.skin = globalSkin
          that.setData({
            skin: globalSkin
          })
        })
      }

      //查询活动列表
      that.setData({
        activityList: [],
        start: 0
      })
      that.findNextPage();
    },
    moved: function() {},
    detached: function() {},
  },

  methods: {
    toAuth() {
      //授权成功后，跳转进入小程序首页
      wx.navigateTo({
        url: '../auth/auth'
      })
    },

    scroll(e) {
      //console.log(e)
    },

    //下滑
    scrollToLower() {
      var that = this;
      //查询活动列表
      that.findNextPage();
    },

    //查询下一页的数据
    findNextPage() {
      var that = this
      activityDb.findActivity(that.data.start, pageSize, function(data) {
        if (data.length == 0) {
          that.setData({
            showLoading: false,
            hasMore: false
          });
        } else {
          if (data.length < pageSize) {
            that.setData({
              showLoading: false,
              activityList: that.data.activityList.concat(data),
              start: that.data.start + data.length,
              hasMore: false
            });
          } else {
            that.setData({
              showLoading: false,
              activityList: that.data.activityList.concat(data),
              start: that.data.start + data.length,
              hasMore: true
            });
          }
        }
      });
    },

    viewDetail(e) {
      var ds = e.currentTarget.dataset;
      wx.navigateTo({
        url: '../activity/detail?id=' + ds.id
      })
    },

  },




})