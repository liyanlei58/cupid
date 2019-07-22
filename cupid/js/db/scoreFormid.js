module.exports = {
  
  //添加formId
  addOne: function (scoreFormid, callback) {
    if (scoreFormid.createTime == null) {
      scoreFormid.createTime = new Date()
      scoreFormid.updateTime = new Date()
    }
    const db = wx.cloud.database()
    db.collection('score_formid').add({
      data: scoreFormid
    }).then(res => {
      // 在返回结果中会包含新创建的记录的 _id
      console.log('[数据库] [添加formId] 成功，记录 _id: ', res._id)
      callback(res._id);
    }).catch(err => {
      console.error('[数据库] [添加formId] 失败：', err)
    });

  },

  //修改formId
  updateOne: function (scoreFormid, id, callback) {
    scoreFormid.updateTime = new Date()
    const db = wx.cloud.database()
    db.collection('score_formid').doc(id).update({
      data: scoreFormid
    }).then(res => {
      console.log('[数据库] [修改formId]，result: ', res.stats.updated)
      callback(res.stats.updated);
    }).catch(err => {
      console.error('[数据库] [修改formId] 失败：', err)
    });

  },

  //查询formId
  getListByActIdAndPersonId: function (activityId, personOpenid, callback) {
    const db = wx.cloud.database()
    db.collection('score_formid').where({
      activityId: activityId,
      _openid: personOpenid
    }).get().then(res => {
      console.log('[数据库] [查询formId by actId and personId] 成功: ', res);
      callback(res.data);
    }).catch(err => {
      console.error('[数据库] [查询formId by actId and personId] 失败：', err)
    });
  },



}