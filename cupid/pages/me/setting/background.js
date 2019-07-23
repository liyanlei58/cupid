let app = getApp();
var settingBgDb = require('../../../js/db/settingBg.js');
var common = require('../../../js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skin: app.globalData.skin,
    modalName: "me"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //用户信息为空
    if (this.data.userInfo == "") {
      sysUser.getUserByOpenid(app.globalData.openid, function (data) {
        console.log("查询用户信息，data: ", data);
        if (data.length > 0) {
          app.globalData.userInfo = data[0];
          that.setData({
            userInfo: data[0]
          })
          //设置导航栏title
          // wx.setNavigationBarTitle({
          //   title: that.data.userInfo.nickName
          // });

        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  changeBackground: function (e) {
    var ds = e.currentTarget.dataset;
    app.globalData.skin = ds.bg

    var that = this
    that.setData({
      skin: ds.bg
    })
    var background = {
      skin: ds.bg
    }
    settingBgDb.getBgByOpenid(app.globalData.openid, function (bgList) {
      if (bgList.length == 0) {
        //添加
        settingBgDb.addBg(background, function (id) {
          if(!id){
            common.toastError("背景设置成功")
          }
        })
      }else{
        //修改
        settingBgDb.updateBg(bgList[0]._id, background, function (count) {
          if (count > 0) {
            common.toastError("背景设置成功")
          }
        })
      }
    })
  },


})