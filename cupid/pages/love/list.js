const app = getApp();
var scoreDb = require('../../js/db/score.js');
var pageSize = 20;
Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    skin: app.globalData.skin,
    modalName: "love",
    scoreList: [],
    hasMore: false,
    showLoading: true,
    start: 0
  },

  attached() {
    var that = this;
    //查询被打分人员
    that.setData({
      scoreList: [],
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
      this.findNextPage();
    },

    //查询下一页的数据
    findNextPage() {
      console.log("openid: ", app.globalData.openid);
      var that = this
      scoreDb.findPageScoreByOpenid(app.globalData.openid, app.globalData.niceScore, that.data.start, pageSize, function (data) {
        if (data.length == 0) {
          that.setData({
            showLoading: false,
            hasMore: false
          });
        } else {
          if (data.length < pageSize) {
            that.setData({
              showLoading: false,
              scoreList: that.data.scoreList.concat(data),
              start: that.data.start + data.length,
              hasMore: false
            });
          } else {
            that.setData({
              showLoading: false,
              scoreList: that.data.scoreList.concat(data),
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
        url: '../love/person?personOpenid=' + ds.id
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

  },
})