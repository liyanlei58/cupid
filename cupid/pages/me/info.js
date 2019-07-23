const app = getApp();
var sysUserDb = require('../../js/db/sysUser.js')
Page({
  data: {
    skin: app.globalData.skin,
    modalName: "me",
    houseArray: ['请选择', '无房', '北京有房', '北京周边有房', '天津有房', '老家有房', '其他城市有房'],
    userInfo: app.globalData.userInfo
  },
  onLoad: function () {
    var that = this;
    //用户信息为空
    if(this.data.userInfo == ""){
      sysUserDb.getUserByOpenid(app.globalData.openid, function (data) {
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
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    //设置背景颜色
    var that = this
    that.setData({
      skin: app.globalData.skin
    })
  },

  toEdit: function (e) {
    wx.navigateTo({
      url: '../edit/edit'
    })
  }
})
