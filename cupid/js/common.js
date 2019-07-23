var settingBg = require('db/settingBg.js');
var Const = require('./const.js');

module.exports = {
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
    var that = this
    settingBg.getBgByOpenid(openid, function (bgList) {
      var globalSkin = Const.Background.PINK
      if (bgList.length > 0) {
        globalSkin = bgList[0].skin
      }
      callback(globalSkin)
    })
  },

}