const app = getApp();
var common = require('../../js/common.js');
var sysUserDb = require('../../js/db/sysUser.js');
var init = require('../../js/cloud/init.js');
var Const = require('../../js/const.js');
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    modalName: "activity",
    skin: Const.Background.PINK
  },
  onLoad: function() {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //设置背景颜色
    if (app.globalData.skin == null || app.globalData.skin == "") {
      var that = this
      that.setData({
        skin: Const.Background.PINK
      })
    } 

  },

  //获取openid
  getOpenid: function(callback) {
    var that = this
    init.getOpenid(function(openid) {
      app.globalData.openid = openid
      callback(openid)
    })
  },


  //获取用户信息
  bindGetUserInfo: function(e) {
    var that = this
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var wxUserInfo = e.detail.userInfo;
      //获取openid
      that.getOpenid(function(openid) {
        //检查是否存在，不存在则添加，存在则修改。插入db
        sysUserDb.getUserByOpenid(openid, function(userList) {
          if (userList.length == 0) {
            //用户为空，添加
            that.addUser(wxUserInfo, openid)
          } else {
            //用户不为空，修改
            app.globalData.userInfo = userList[0]
            that.updateUser(wxUserInfo, userList)
          }
        })
      })

    } else {
      //用户按了拒绝按钮
      that.rejectAuth()
    }
  },

  //添加用户
  addUser: function(wxUserInfo, openid) {
    var that = this
    sysUserDb.addUser(wxUserInfo, function(dataId) {
      if (dataId != null) { //添加成功
        wxUserInfo._id = dataId
        wxUserInfo._openid = openid
        app.globalData.userInfo = wxUserInfo;
        //用户已经授权过，跳转到首页
        that.toHome();
      } else {
        console.log("add userWxInfo fail");
      }
    })
  },

  //修改用户
  updateUser: function(wxUserInfo, userList) {
    var that = this
    sysUserDb.updateUser(app.globalData, wxUserInfo, function(updateCount) {
      console.log("update wxUserInfo", wxUserInfo);
      if (updateCount > 0) { //修改成功
        var oldUser = userList[0];

        oldUser.nickName = wxUserInfo.nickName
        oldUser.avatarUrl = wxUserInfo.avatarUrl
        oldUser.province = wxUserInfo.province
        oldUser.city = wxUserInfo.city
        oldUser.country = wxUserInfo.country
        oldUser.gender = wxUserInfo.gender

        app.globalData.userInfo = oldUser
        console.log("globalData userInfo: ", app.globalData.userInfo)

        //用户已经授权过，跳转到首页
        that.toHome();
      } else {
        console.log("update userWxInfo fail");
      }
    })
  },


  //跳转到首页
  toHome: function() {
    //授权成功后，跳转进入小程序首页
    wx.redirectTo({
      url: '../index/index'
    })
  },

  //拒绝授权
  rejectAuth: function () {
    wx.showModal({
      title: '警告',
      content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
      showCancel: false,
      confirmText: '返回授权',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击了“返回授权”')
        }
      }
    })
  }

});