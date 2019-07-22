const app = getApp()
Page({
  data: {
    skin: app.globalData.skin,
    modalName: "activity",
    PageCur: 'activity'
  },
  onLoad: function (options) {
    var pageCur = "activity"
    if (options.pageCur != null){
      pageCur = "me"
    }
    this.setData({
      PageCur: pageCur
    })
  },

  NavChange(e) {
    console.log(e.currentTarget.dataset.cur)
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: 'ColorUI-高颜值的小程序UI组件库',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
})