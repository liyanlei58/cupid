const app = getApp();
Page({
  data: {
    skin: app.globalData.skin,
    modalName: "me"
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //设置背景颜色
    var that = this
    that.setData({
      skin: app.globalData.skin
    })
  },

  toBackground: function() {
    wx.navigateTo({
      url: './background'
    })
  },

})