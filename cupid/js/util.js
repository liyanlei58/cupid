module.exports = {

  formatTime: function(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds();


    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },


  formatDay: function(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return [year, month, day].map(this.formatNumber).join('-');
  },

  formatNumber: function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  formatLocation: function(longitude, latitude) {
    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)

    return {
      longitude: longitude.toString().split('.'),
      latitude: latitude.toString().split('.')
    }
  },

  //生成len位随机数 len：随机数字的位数
  getRandomNum: function(len) {
    var code = "";
    for (var i = 0; i < len; i++) {
      var radom = Math.floor(Math.random() * 10);
      code += radom;
    }
    console.log(code);
    return code;
  },

}