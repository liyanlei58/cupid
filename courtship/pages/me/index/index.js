const app = getApp();
var activityDB = require('../../js/activityDB.js');
var userDb = require('../../js/user.js');
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
        userDb.getUserByOpenid(app.globalData.openid, function (userList) {
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
        url: '../me/edit/edit'
      })
    },

    toMeMatch() {
      wx.navigateTo({
        url: '../me/match/match'
      })
    },

    toActivityAdmin() {
      wx.navigateTo({
        url: '../me/admin/activity/list/list'
      })
    },

  },

})