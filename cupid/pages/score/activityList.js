const app = getApp();
var activityJoinDao = require('../../js/db/activityJoin.js');
var util = require('../../js/util.js');
var pageSize = 20;
Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    skin: app.globalData.skin,
    modalName: "score",
    today: util.formatDay(new Date()),
    activityList: [],
    hasMore: false,
    showLoading: true,
    start: 0
  },
  
  lifetimes: {
    //在组件实例进入页面节点树时执行
    attached() {
      var that = this;
      //查询活动列表
      that.setData({
        skin: app.globalData.skin,
        activityList: [],
        start: 0
      })
      that.findNextPage()
    },
    moved: function () { },
    detached: function () { },
  },

  methods: {
    scroll(e) {
      //console.log(e)
    },

    //下滑
    scrollToLower() {
      this.findNextPage();
    },

    //查询下一页的数据
    findNextPage() {
      console.log("openid: ", app.globalData.openid);
      var that = this
      activityJoinDao.findPageByOpenid(app.globalData.openid, that.data.start, pageSize, function (data) {
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
        url: '../score/activityDetail?id=' + ds.id
      })
    },

  },
  


})