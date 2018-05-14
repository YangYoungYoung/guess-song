// pages/pkwelcome/pkwelcome.js
var app = getApp()
var time=800;
Page({
  data: {
    showView: true,
    showView2: true,
    showView3: true,
    showView4: true,
    userInfo: {},
    countDownNumber: 3,
    timerId: 0
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载 
    showView: (options.showView == "true" ? true : false)
    var that = this;
    setTimeout(function () {
      //要延时执行的代码
      that.setData({
        showView: (!that.data.showView)
      })
    }, time)

    showView2: (options.showView2 == "true" ? true : false)
    var that = this;
    setTimeout(function () {
      //要延时执行的代码
      that.setData({
        showView2: (!that.data.showView2)
      })
    }, time)

    showView3: (options.showView3 == "true" ? true : false)
    var that = this;
    setTimeout(function () {
      //要延时执行的代码
      that.setData({
        showView3: (!that.data.showView3)
      })
    }, time)

    showView4: (options.showView4 == "true" ? true : false)
    var that = this;
    setTimeout(function () {
      //要延时执行的代码
      that.setData({
        showView4: (!that.data.showView4)
      })
    }, time)

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
    var page = this;
    //倒计时关闭当前页，重定向到pk界面
    var timer = setInterval(function () {
      page.setData({
        countDownNumber: page.data.countDownNumber - 1
      });
      if (page.data.countDownNumber == 0) {
        clearInterval(timer);
        wx.redirectTo({
          url: '../pkstyle/pkstyle'
        })
      }
    }, 1000);
    page.setData({
      timerId: timer
    })
},
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
}) 