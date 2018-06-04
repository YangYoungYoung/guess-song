// pages/pkwating/pkwating.js
const app = getApp()
var int
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    countDownNumber: 8,
    timerId: 0,
    pKdown:2,
  },

  onLoad: function (options) {
    // console.log("======" + wx.getStorageSync('openid'));
    var that = this;
    wx.request({
      url: 'https://xyt.xuanyutong.cn/Servlet/waitPkStateServlet',
      // url: 'http://192.168.0.146:8080/Servlet/waitPkStateServlet',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        // that.setData({
        //   musicValue: res.data.musicValue,
        // });
        //倒计时关闭当前页，重定向到pk界面
        var timer = setInterval(function () {
          page.setData({
            pKdown: page.data.pKdown - 1
          });
          if (page.data.pKdown == 0) {
            clearInterval(timer);
            console.log("======" + res.data.state);
            if (res.data.state == 1) {
              console.log("匹配成功");
              clearInterval(int);
              wx.redirectTo({
                url: '../pkwelcome/pkwelcome',
              })
            }
            else {
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
            // wx.navigateTo({
            //   url: '../pkwelcome/pkwelcome'
            // })
          }
        }, 1000);
        
        
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
    var page = this;
    //倒计时关闭当前页，重定向到pk界面
   var timer = setInterval(function () {
      page.setData({
        countDownNumber: page.data.countDownNumber - 1
      });
      if (page.data.countDownNumber == 0) {
        clearInterval(timer);
        wx.showModal({
          title: '提示',
          content: '当前没有匹配到对手，请稍后再试',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        // wx.navigateTo({
        //   url: '../pkwelcome/pkwelcome'
        // })
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
  * 监听页面隐藏
  *    当前页面调到另一个页面时会执行
  */
  onHide: function () {
    console.log('index---------onHide()')
    clearInterval(int);
  },
  /**
   * 当页面销毁时调用
   */
  onUnload: function () {
    // console.log('index---------onUnload')
    clearInterval(int);
    //  wx.redirectTo({
    //    url: '../home/home',
    //             })
    // this.close();
  },
   /**
   * 放弃游戏
   */
  // close:function(){
  //   var that = this;
  //   wx.request({
  //     url: 'http://192.168.0.146:8080/Servlet/CloseStateServlet',
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
