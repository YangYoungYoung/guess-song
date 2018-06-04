//app.js
import { ToastPannel } from './component/toastTest/toastTest'
App({
  ToastPannel,
  onLaunch: function (ops) {
    //设置的分享 带参数的
    if (ops.scene == 1044) {
      console.log(ops.shareTicket)
    }

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    /**********wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionIdgv
        if (res.code) {
          wx.getUserInfo({
            success: function (res_user) {
              var that = this;
              wx.request({
                url: 'https://xyt.xuanyutong.cn/Servlet/userLoginServlet', //登录，获得音乐值
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                data: {
                  code: res.code,//获取openid的话 需要向后台传递code,利用code请求api获取openid
                  avatar: res_user.userInfo.avatarUrl,//获取头像
                  username: res_user.userInfo.nickName,
                },
                success: function (res) {
                  // wx.setStorageSync("openid", res.data)//可以把openid保存起来,以便后期需求的使用 
                  // console.log("返回数据为：" + res.data.aa.musicValue);//获得音乐值
                  // console.log("返回数据为：" + res.data.aa.openid);//获得openid
                  // console.log('submit success');
                  wx.setStorageSync('openid', res.data.aa.openid); // 单独存储openid
                },
                fail: function () {
                  // fail
                  console.log('submit fail');
                }
              })
            },
            fail: function (res_user){
                                console.log('submit fail');
              wx.showModal({
                title: '提示',
                content: '小程序功能需要授权才能正确使用哦！请点击“确定”-“用户信息”再次授权',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting['scope.userInfo']) {
                          var that = this;
                          wx.request({
                            url: 'https://xyt.xuanyutong.cn/Servlet/userLoginServlet', //登录，获得音乐值
                            method: "POST",
                            header: {
                              'content-type': 'application/x-www-form-urlencoded',
                            },
                            data: {
                              code: res.code,//获取openid的话 需要向后台传递code,利用code请求api获取openid
                              avatar: res_user.userInfo.avatarUrl,//获取头像
                              username: res_user.userInfo.nickName,
                            },
                            success: function (res) {
                              // wx.setStorageSync("openid", res.data)//可以把openid保存起来,以便后期需求的使用 
                              // console.log("返回数据为：" + res.data.aa.musicValue);//获得音乐值
                              // console.log("返回数据为：" + res.data.aa.openid);//获得openid
                              // console.log('submit success');
                              wx.setStorageSync('openid', res.data.aa.openid); // 单独存储openid
                            },
                            fail: function () {
                              // fail
                              console.log('submit fail');
                            }
                          })
                        }
                      }
                    })
                  }
                }
              });
            }
          })
        }
      }
    })************/

    // 检测是否更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("是否有新版本"+res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})