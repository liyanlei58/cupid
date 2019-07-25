var settingBg = require('db/settingBg.js');
var Const = require('./const.js');

module.exports = {

  //调用微信接口检查是否授权
  checkAuthFromWx: function (authCallback, noAuthCallback) {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          //已经授权
          authCallback()
        } else {
          //未授权
          noAuthCallback()
        }
      }
    });
  },
  
  toastSuccess: function (msg) {
    wx.showToast({
      title: msg
    })
  },

  toastError: function (msg) {
    wx.showToast({
      icon: 'none',
      title: msg
    })
  },

  //获取背景
  setBackground: function (openid, callback) {
    var globalSkin = Const.Background.PINK
    if (openid == null || openid == ""){
      callback(globalSkin)
    }else{
      settingBg.getBgByOpenid(openid, function (bgList) {
        if (bgList.length > 0) {
          globalSkin = bgList[0].skin
        }
        callback(globalSkin)
      })
    }
  },

}