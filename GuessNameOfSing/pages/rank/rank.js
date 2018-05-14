// pages/ranking/ranking.js
var app = getApp()

var list = []
var array = []
Page({
  data: {
    name: '',
    mygrade: 0,
    grade: 0,
    userInfo: {
      avatarUrl: "",//用户头像 
      nickName: "",//用户昵称 
      scrollTop: 100
    },
  },
  upper: function (e) {
  },
  lower: function (e) {
  },
  scroll: function (e) {
  },
  scrollToTop: function (e) {
    this.setAction({
      scrollTop: 0
    })
  },
  onLoad: function (options) {

    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    that.openid = wx.getStorageSync('openid');
    wx.request({
      url: 'https://xyt.xuanyutong.cn/Servlet/orderGradeServlet',
      headers: {
        ' -Type': 'application/json'
      },
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        // console.log(res.data)
        that.setData({
          name: res.data.orderGradelist[0].username,
          mygrade: res.data.queryUserlist[0].rowNo,
          grade: res.data.queryUserlist[0].grade
        });
        for (var j = 0; j < res.data.orderGradelist.length; j++) {
          var obj = {};
          obj.id = j + 1;
          obj.avatar = res.data.orderGradelist[j].avatar
          obj.name = res.data.orderGradelist[j].username
          obj.grade = res.data.orderGradelist[j].grade
          array.push(obj);
          that.setData({
            list: array
          })
        } 
        // console.log(res.data.orderGradelist[0])
      }
    })
    var that = this
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })
  },
  onReady: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '老铁，超好玩的猜歌游戏了解一下',
      desc: '最流行的猜歌小游戏',
      path: '/pages/home/home?id=123',
      success(e) {
        // shareAppMessage: ok,
        // shareTickets 数组，每一项是一个 shareTicket ，对应一个转发对象
        // 需要在页面onLoad()事件中实现接口
        // console.log("用户成功分享");
        var that = this//不要漏了这句，很重要
        wx.request({
          url: 'https://xyt.xuanyutong.cn/Servlet/clickShareServlet',
          headers: {
            ' -Type': 'application/json'
          },
          data: {
            openid: wx.getStorageSync('openid')
          },
          success: function (res) {
            wx.showToast({
              title: '分享成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
          }
        })
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail(e) {
        // shareAppMessage:fail cancel
        // shareAppMessage:fail(detail message) 
        // console.log("用户取消了分享");
      },
      complete() { }
    }
  }
})