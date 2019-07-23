const app = getApp()
var activityDb = require('../../../../js/db/activity.js')
var util = require('../../../../js/util.js')
var pageSize = 20;
Page({
  data: {
    skin: app.globalData.skin,
    modalName: "admin_activity",
    openid: '',
    activityList: [],
    hasMore: false,
    showLoading: true,
    today: util.formatDay(new Date()),
    start: 0
  },
  onPullDownRefresh: function() {
    console.log('onPullDownRefresh', new Date())
  },
  scroll: function(e) {
    this.scrollToLower()
  },
  onLoad: function() {
    var that = this;
    console.log(that.data.today)
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
      console.log(app.globalData.openid);
    }

  },

  onShow: function() {
    //设置背景颜色
    var that = this
    that.setData({
      skin: app.globalData.skin
    })
    this.refreshList()
  },

  //下滑
  refreshList: function() {
    var that = this;
    //查询活动列表
    that.setData({
      activityList: [],
      start: 0
    })
    that.findNextPage();
  },

  //下滑
  scrollToLower: function() {
    var that = this;
    //查询活动列表
    that.findNextPage();
  },

  //查询下一页的数据
  findNextPage: function() {
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


  toEdit: function(e) {
    var ds = e.currentTarget.dataset;
    var url = './edit';
    if (ds.id) {
      url = url + "?id=" + ds.id
    }
    wx.navigateTo({
      url: url
    })
  },

  viewDetail: function(e) {
    var ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: './detail?id=' + ds.id
    })
  },


  // 删除活动 btn
  delActivity: function(e) {
    var that = this
    var ds = e.currentTarget.dataset
    var activityId = ds.id
    var activityName = ds.title
    wx.showModal({
      title: '提示',
      content: '确定删除"' + activityName + '"活动?',
      success(res) {
        if (res.confirm) {
          that.doDelActivity(activityId)
        } else if (res.cancel) {
          console.log('cancel del')
        }
      }
    })

  },

  // 删除活动
  doDelActivity: function(activityId) {
    var that = this
    activityDb.getActivityById(activityId, function(activityExist) {
      if (activityExist == null) {
        wx.showToast({
          icon: 'none',
          title: '活动不存在'
        })
      } else {
        if (activityExist.date < that.data.today) {
          wx.showToast({
            icon: 'none',
            title: '活动已结束，不可以删除'
          })
        } else {
          activityDb.removeActivityById(activityId, function(count) {
            if (count == 0) {
              wx.showToast({
                icon: 'none',
                title: '删除失败'
              })
            } else {
              wx.showToast({
                title: '删除成功'
              })
              that.refreshList()
            }
          });
        }
      }
    })

  },

})