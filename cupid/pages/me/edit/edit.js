let app = getApp();
var userDb = require('../../js/user.js');
var img = require('../../js/img.js');
var init = require('../../js/init.js');
var common = require('../../js/common.js');
var Const = require('../../js/const.js');

Page({
  data: {
    FEMALE: Const.Gender.Female.VALUE,
    HAS_CAR: Const.Car.Have.VALUE,
    skin: app.globalData.skin,
    modalName: "me",
    imgList: [],
    birthday: '1990',
    hometown: ['山东省', '', ''],
    houseIndex: 0,
    houseArray: ['请选择', '无房', '北京有房', '北京周边有房', '天津有房', '老家有房', '其他城市有房'],
    photoId: '',
    userInfo: ''
  },

  bindHouseChange: function(e) {
    this.setData({
      houseIndex: e.detail.value
    })
  },

  bindBirthdayChange: function(e) {
    this.setData({
      birthday: e.detail.value
    })
  },

  bindHometownChange: function(e) {
    this.setData({
      hometown: e.detail.value
    })
  },

  onLoad: function(options) {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    });
    //用户信息
    userDb.getUserByOpenid(app.globalData.openid, function (data) {
      console.log("查询用户信息，data: ", data);
      if (data.length > 0) {
        app.globalData.userInfo = data[0];
        that.setData({
          userInfo: data[0],
          photoId: data[0].photoId
        })
        console.log(app.globalData.userInfo);
        that.initForm();
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.photoId,
      current: e.currentTarget.dataset.url
    });
  },

  DelImg(e) {
    wx.showModal({
      title: '删除照片',
      content: '确定要删除此照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.setData({
            photoId: ''
          })
        }
      }
    })
  },

  // 上传图片
  uploadPhoto: function() {
    var that = this
    img.doUpload(function(res) {
      if (res.statusCode == 200) {
        that.setData({
          photoId: res.fileID
        })
      }
    })
  },

  // 初始化表单
  initForm: function() {
    var that = this
    var userInfo = that.data.userInfo
    var birthdayInit = '1990';
    if (userInfo.birthday != null) {
      birthdayInit = userInfo.birthday;
    }
    var hometownInit = ['山东省', '', ''];
    if (userInfo.hometown != null) {
      hometownInit = userInfo.hometown;
    }
    var houseIndexInit = 0;
    if (userInfo.house != null) {
      houseIndexInit = userInfo.house;
    }
    this.setData({
      birthday: birthdayInit,
      hometown: hometownInit,
      houseIndex: houseIndexInit
    });
  },



  // formReset: function () {
  //   console.log('form发生了reset事件')
  // },

  formSubmit: function(e) {
    var that = this;
    var userInfo = e.detail.value;
    console.log('更新用户信息：', userInfo);

    //校验表单
    if (userInfo.hometown[0] == "" || userInfo.hometown[1] == "" || userInfo.hometown[2] == ""  ){
      common.toastError("请选择籍贯")
      return
    }
    if (userInfo.job == "") {
      common.toastError("请输入职业")
      return
    }
    if (userInfo.address == "") {
      common.toastError("请输入住址")
      return
    }

    if (userInfo.house == "请选择") {
      userInfo.house == null;
    }
    
    userInfo.photoId = that.data.photoId;
    //微信昵称
    userInfo.nickName = userInfo.nickName;
    userDb.getUserByOpenid(app.globalData.openid, function(data) {
      if (data.length == 0) {
        //用户为空，添加
        that.addUser(userInfo)
      } else {
        //用户不为空，修改
        that.updateUser(userInfo)
      }
    });

  },

  //添加用户
  addUser: function (userInfo) {
    userDb.addUser(userInfo, function (dataId) {
      if (dataId != null) { //添加成功
        userInfo._id = dataId;
        app.globalData.userInfo = userInfo;
        console.log("userInfo: ", app.globalData.userInfo);
        //跳转到我的
        that.toIndex();
      } else {
        that.saveFail();
      }
    });
  },

  //修改用户
  updateUser: function (userInfo) {
    var that = this
    userDb.updateUser(app.globalData, userInfo, function (updateCount) {
      if (updateCount > 0) { //修改成功
        var glbUserInfo = app.globalData.userInfo;
        userInfo.nickName = glbUserInfo.nickName;
        userInfo.avatarUrl = glbUserInfo.avatarUrl;
        userInfo.province = glbUserInfo.province;
        userInfo.city = glbUserInfo.city;
        userInfo.country = glbUserInfo.country;

        app.globalData.userInfo = userInfo;
        console.log("3333 userInfo: ", app.globalData.userInfo);
        //跳转到我的
        that.toIndex();
      } else {
        that.saveFail();
      }
    });
  },

  //保存成功，跳转到用户
  toIndex: function() {
    common.toastSuccess('保存成功' + app.globalData.tab)
    wx.navigateTo({
      url: '../../index/index?pageCur=me' 
    })
  },

  //保存成功，跳转到用户
  saveFail: function() {
    console.log("toast fail");
    common.toastError('保存失败')
  },

})