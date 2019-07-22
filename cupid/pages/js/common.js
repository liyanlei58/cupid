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
  }

}