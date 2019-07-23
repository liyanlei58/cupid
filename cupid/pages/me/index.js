const app = getApp();
var sysUserDb = require('../../js/db/sysUser.js');
Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    skin: app.globalData.skin,
    modalName: "me",
    openid: '',
    hasAdmin: false
  },

  lifetimes: {
    //在组件实例进入页面节点树时执行
    attached() {
      var that = this
      //设置背景
      this.setData({
        skin: app.globalData.skin,
      })
      that.init()
    },
    moved: function () { },
    detached: function () { },
  },

  pageLifetimes: {
    show: function () {
      //设置背景
      this.setData({
        skin: app.globalData.skin,
      })
    }
  },

  methods: {
    scroll(e) {
      //console.log(e)
    },

    scroll(e) {
      //console.log(e)
    },

    init() {
      var that = this;
      if (app.globalData.userInfo.hasAdmin != null) {
        that.setData({
          hasAdmin: app.globalData.userInfo.hasAdmin
        })
      } else {
        sysUserDb.getUserByOpenid(app.globalData.openid, function (userList) {
          if (userList.length > 0 && userList[0].hasAdmin != null) {
            that.setData({
              hasAdmin: userList[0].hasAdmin
            })
          }
        })
      }
    },

    toMeEdit() {
      wx.navigateTo({
        url: '../me/edit'
      })
    },

    toMeMatch() {
      wx.navigateTo({
        url: '../me/match'
      })
    },

    toSetting() {
      wx.navigateTo({
        url: '../me/setting/index'
      })
    },

    toActivityAdmin() {
      wx.navigateTo({
        url: '../me/admin/activity/list'
      })
    },

  },

})