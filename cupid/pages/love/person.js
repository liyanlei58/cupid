const app = getApp();
var sysUserDb = require('../../js/db/sysUser.js')
var common = require('../../js/common.js')
var Const = require('../../js/const.js')

Page({
  data: {
    skin: app.globalData.skin,
    modalName: "love",
    FEMALE: Const.Gender.Female.VALUE,
    HAS_CAR: Const.Car.Have.VALUE,
    houseArray: ['请选择', '无房', '北京有房', '北京周边有房', '天津有房', '老家有房', '其他城市有房'],
    person: {},
    score: {},
    activity: {}
  },
  onLoad: function(options) {
    var that = this;
    var personOpenid = options.personOpenid;
    
    if (personOpenid == null || personOpenid == "") {
      common.toastError('人员ID为空')
      return;
    }
    
    //获取人员信息
    that.getPersonByOpenid(personOpenid);

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

  //获取人员信息
  getPersonByOpenid: function(personOpenid, activityId) {
    var that = this;
    sysUserDb.getUserByOpenid(personOpenid, function(data) {
      if (data.length > 0) {
        that.setData({
          person: data[0]
        })

      }
    });
  },

  ViewImage(e) {
    var cur = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [cur],
      current: cur
    });
  },



})