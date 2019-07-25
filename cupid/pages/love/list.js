const app = getApp();
var scoreDb = require('../../js/db/score.js');
var Const = require('../../js/const.js');
var pageSize = 20;
Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    skin: app.globalData.skin,
    modalName: "love",
    hasMore: false,
    showLoading: true,
    start: 0,
    loveList:[]
  },
  
  lifetimes: {
    //在组件实例进入页面节点树时执行
    attached() {
      var that = this
      //查询被打分人员
      that.setData({
        skin: app.globalData.skin,
        loveList: [],
        start: 0
      })
      that.findNextPage();
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
      scoreDb.findPageScoreByOpenid(app.globalData.openid, Const.Score.Nice.VALUE, that.data.start, pageSize, function (data) {
        if (data.length == 0) {
          that.setData({
            showLoading: false,
            hasMore: false
          });
        } else {
          if (data.length < pageSize) {//最后一页
            that.setLoveList(data, function(loveList){
              that.setData({
                showLoading: false,
                loveList: loveList,
                start: that.data.start + data.length,
                hasMore: false
              });
            })
          } else {//非最后一页
            that.setLoveList(data, function (loveList) {
              that.setData({
                showLoading: false,
                loveList: loveList,
                start: that.data.start + data.length,
                hasMore: true
              });
            })
          }
        }
      });
    },

    // ListTouch触摸开始
    setLoveList(data, callback) {
      var that = this
      var lastLoveList = that.data.loveList
      var lastLove = data[0];
      var scoreList = []
      if (lastLoveList.length > 0){//加载非第一页的内容
        lastLove = lastLoveList.pop()
        scoreList = lastLove.scoreList
      }
      var currActivity = lastLove.activity
      // var loveListNext = []
      for (var i = 0; i < data.length; i++) {
        if (currActivity._id == data[i].activity._id) {//同一个活动
          scoreList.push(data[i])
        } else {//不同的活动
          var love = {
            activity: currActivity,
            scoreList: scoreList
          }
          that.data.loveList.push(love)

          currActivity = data[i].activity
          scoreList = [data[i]];
        }
      }

      //最后一次的组合
      var love = {
        activity: currActivity,
        scoreList: scoreList
      }
      that.data.loveList.push(love)

      callback(that.data.loveList)
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