//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {

   /*** const filter = require('../../utils/filter');
    Page(filter.loginCheck({
      // ...
      onLoad: function (options) {
        // ...
      },
      // ...
    }));***/


    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
