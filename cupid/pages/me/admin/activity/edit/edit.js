let app = getApp();
var activityDB = require('../../../../js/activityDB.js');
var util = require('../../../../js/util.js');
var common = require('../../../../js/common.js');
Page({
  data: {
    skin: app.globalData.skin,
    modalName: "admin_activity",
    activity: {},
    date: util.formatDay(new Date()),
    today: util.formatDay(new Date()),
    isAdd: true
  },

  bindDateChange: function(e) {
    //日期
    this.setData({
      date: e.detail.value
    });
  },

  onLoad: function(options) {
    var that = this;
    var activityId = options.id;
    if (activityId != null && activityId != "undefined" && activityId != "") {
      //编辑活动
      activityDB.getActivityById(activityId, function(activityDb) {
        console.log("查询活动信息，activityDb: ", activityDb);
        if (activityDb != null) {
          that.setData({
            activity: activityDb,
            date: activityDb.date,
            isAdd: false
          })
        }
      });
    }
  },

  // 初始化表单
  initForm: function() {
    
  },

  formReset: function () {
    console.log('form发生了reset事件')
  },

  formSubmit: function(e) {
    var that = this;
    // console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var activity = e.detail.value;
    //校验表单
    if (activity.name == null || activity.name == ""){
      common.toastError("请输入活动名称")
      return
    }
    if (activity.date == null || activity.date == "") {
      common.toastError("请输入活动日期")
      return
    }
    if (activity.content == null || activity.content == "") {
      common.toastError("请输入活动内容")
      return
    }

    if (that.data.isAdd) { //添加活动
      that.addActivity(activity)
    } else { //修改活动
      that.updateActivity(that.data.activity._id, activity)
    }

  },

  //添加活动
  addActivity: function (activity) {
    var that = this
    activityDB.addActivity(activity, function (dataId) {
      if (dataId != null) { //添加成功
        //保存成功，跳转到活动列表页面
        that.toActivityList();
      } else {
        //保存失败
        that.saveFail();
      }
    });
  },

  //修改活动
  updateActivity: function(activityId, activity) {
    var that = this
    activityDB.updateActivity(activityId, activity, function (updateCount) {
      if (updateCount > 0) { //修改成功
        //保存成功，跳转到活动列表页面
        that.toActivityList()
      } else {
        //保存失败
        that.saveFail()
      }
    });
  },

  //保存成功，跳转到活动列表页面
  toActivityList: function () {
    common.toastSuccess("保存成功");
    wx.navigateTo({
      url: '../list/list'
    })
  },

  //保存失败
  saveFail: function () {
    common.toastError("保存失败");
  },

  

})