// pages/pkend/pkend.js
var app = getApp()
var oid;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    win:0,
    userscore:0,
    opponentname:null,
    opponentscore:0,
    opponentimage:""
  },
  //继续玩游戏，回到主页面
  goonpk: function (e) {
    wx.redirectTo({
      url: '../home/home',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从前页面获取到对手的openid
    oid = options.oid;
    var that = this;
    console.log("========" + wx.getStorageSync('oid'));
    wx.request({
      url: 'https://xyt.xuanyutong.cn/Servlet/resultPkServlet',
      // url: 'http://192.168.0.146:8080/Servlet/resultPkServlet',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        openid: wx.getStorageSync('openid'),
        oid: wx.getStorageSync('oid')
      },
      success: function (res) {
        // console.log("pK结果是："+res.data.win);

        that.setData({
          win: res.data.win,
          opponentname:res.data.username,
          opponentscore: res.data.oppositeScore,
          opponentimage: res.data.avatar,
          userscore: res.data.score
        })
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
  },

  /**
   * 当页面销毁时调用
   */
  // onUnload: function () {
  //   console.log('index---------onUnload这是结局的')
  //   wx.redirectTo({
  //     url: '../home/home',
  //   })
  // }

})
