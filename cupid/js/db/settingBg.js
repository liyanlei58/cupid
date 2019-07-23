module.exports = {
  //添加背景
  addBg: function(background, callback) {
    const db = wx.cloud.database()
    db.collection('setting_bg').add({
      data: background
    }).then(res => {
      // 在返回结果中会包含新创建的记录的 _id
      console.log('[数据库] [设置背景] 成功，记录 _id: ', res._id)
      callback(res._id);
    }).catch(err => {
      console.error('[数据库] [设置背景] 失败：', err)
    });
  },

  //修改背景信息
  updateBg: function(bgId, background, callback) {
    const db = wx.cloud.database()
    db.collection('setting_bg').doc(bgId).update({
      data: background
    }).then(res => {
      console.log('[数据库] [修改背景]，result: ', res.stats.updated)
      callback(res.stats.updated);
    }).catch(err => {
      console.error('[数据库] [修改背景] 失败：', err)
    });
  },

  //查询背景详情
  getBgByOpenid: function(userOpenid, callback) {
    const db = wx.cloud.database()
    db.collection('setting_bg').where({
      _openid: userOpenid
    }).get().then(res => {
      console.log('[数据库] [查询背景 by openid] 成功: ', res);
      callback(res.data)
    }).catch(err => {
      console.error('[数据库] [查询背景详情 by openid] 失败：', err)
    });
  },


  

}