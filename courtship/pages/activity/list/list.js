const app = getApp();
var activityDB = require('../../js/activityDB.js');
var util = require('../../js/util.js');
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

  attached() {
    var that = this;
    if (app.globalData.openid) {
      that.setData({
        openid: app.globalData.openid
      })
    }
    //查询活动列表
    that.setData({
      activityList: [],
      start: 0
    })
    that.findNextPage();
  },

  methods: {
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
      activityDB.findActivity(that.data.start, pageSize, function (data) {
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
        url: '../activity/detail/detail?id=' + ds.id
      })
    },

  },

  


})