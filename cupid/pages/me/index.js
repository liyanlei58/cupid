const app = getApp();
var activity = require('../../js/db/activity.js');
var sysUser = require('../../js/db/sysUser.js');
var pageSize = 20;
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

  attached() {
    var that = this
    that.init()
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
        sysUser.getUserByOpenid(app.globalData.openid, function (userList) {
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

    toActivityAdmin() {
      wx.navigateTo({
        url: '../me/admin/activity/list'
      })
    },

  },

})