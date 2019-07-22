const app = getApp();
var matchDao = require('../../js/db/match.js');
var pageSize = 20;
Page({
  data: {
    skin: app.globalData.skin,
    modalName: "me",
    scoreList: [],
    hasMore: false,
    showLoading: true,
    start: 0
  },

  onLoad: function () {
    
  },

  onShow: function () {
    var that = this;
    //查询对自己有好感的人员
    that.setData({
      scoreList: [],
      start: 0
    })
    that.findNextPage();
  },

  //下滑
  scrollToLower: function () {
    findNextPage();
  },

  //查询下一页的数据
  findNextPage: function () {
    console.log("openid: ", app.globalData.openid);
    var that = this
    matchDao.findMatchByUserId(app.globalData.userInfo._id, that.data.start, pageSize, function (matchList) {
      if (matchList.length == 0) {
        that.setData({
          showLoading: false,
          hasMore: false
        });
      } else {
        var hasMore = false
        if (matchList.length == pageSize) {
          hasMore = true
        }
        var scoreTargetList = new Array();
        for (var i = 0; i < matchList.length; i++) {
          that.getTargetScore(matchList[i], app.globalData.openid, function (targetScore) {
            scoreTargetList.push(targetScore)
          })
        }
        that.setData({
          showLoading: false,
          scoreList: that.data.scoreList.concat(scoreTargetList),
          start: that.data.start + matchList.length,
          hasMore: hasMore
        });
        console.log("scoreList:", that.data.scoreList)

      }
    });
  },

  getTargetScore: function (match, scoreOpenid, callback) {
    var targetScore = null;
    if (scoreOpenid == match.score1._openid) { //A
      targetScore = match.score1;
    } else {
      targetScore = match.score2;
    }
    callback(targetScore)
  },

  viewDetail: function (e) {
    var ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/love/person/person?personOpenid=' + ds.id
    })
  },


})