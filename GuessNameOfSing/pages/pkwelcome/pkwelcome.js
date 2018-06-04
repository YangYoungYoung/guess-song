// pages/pkwelcome/pkwelcome.js
var app = getApp()
var time=800;
var int;
var oid;
Page({
  data: {
    showView: true,
    showView2: true,
    showView3: true,
    showView4: true,
    userInfo: {},
    countDownNumber: 2,
    timerId: 0,
    imageUrl:''
  },
  onLoad: function (options) {
    // console.log("======" + wx.getStorageSync('openid'));
    var that = this;
    wx.request({
      // url: 'https://xyt.xuanyutong.cn/Servlet/selectPkUserServlet',
      url: 'http://192.168.0.146:8080/Servlet/selectPkUserServlet',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        console.log("获取头像" + res.data.avatar);
        console.log("获取对方id:" + res.data.oid);
        oid = res.data.oid;
        if(oid==null){
          clearInterval(int);
          console.log("匹配失败");
          wx.showModal({
            title: '提示',
            content: '当前没有匹配到对手，请稍后再试',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.redirectTo({
                  url: '../home/home',
                })
              }
              else {
                wx.redirectTo({
                  url: '../home/home',
                })
              }
            }
          })
        }
        else{

        wx.setStorageSync('oid', res.data.oid); // 单独存储对方的openid
       
        that.setData({
          imageUrl: res.data.avatar
        })
        }
      }
    })
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
    int = timer;
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
  /**
   * 当页面销毁时调用
   */
  onUnload: function () {
    console.log('index---------onUnload')
    clearInterval(int);
    // wx.redirectTo({
    //   url: '../home/home',
    // })
    // this.close();
  },
  // /**
  // * 放弃游戏
  // */
  // close: function () {
  //   var that = this;
  //   wx.request({
  //     url: 'https://xyt.xuanyutong.cn/Servlet/CloseStateServlet',
  //     method: "POST",
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //     },
  //     data: {
  //       openid: wx.getStorageSync('openid'),
  //       state: 0
  //     },
  //     success: function (res) {
  //       // that.setData({
  //       //   musicValue: res.data.musicValue,
  //       // });
  //       console.log("======" + res);
  //       console.log("======" + res.data.state);
  //       if (res.data.state == 0) {
  //         console.log("放弃匹配成功");
  //         // clearInterval(timer);
  //         wx.showModal({
  //           title: '提示',
  //           content: '您放弃了本局游戏,但是依然会扣除音乐值',
  //           success: function (res) {
  //             if (res.confirm) {
  //               console.log('用户点击确定')
  //             }
  //           }
  //         })
  //       }
  //       else {
  //         console.log("放弃匹配失败");
  //       }
  //     }
  //   })
  // }
}) 
