const app = getApp();
var userDb = require('../../js/user.js')
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

  //获取人员信息
  getPersonByOpenid: function(personOpenid, activityId) {
    var that = this;
    userDb.getUserByOpenid(personOpenid, function(data) {
      if (data.length > 0) {
        that.setData({
          person: data[0]
        })

      }
    });
  },

  



})