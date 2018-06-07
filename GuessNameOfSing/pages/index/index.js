//index.js
//获取应用实例
const app = getApp()

let hasUserInfo;
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  startgame: function (e) {
    wx.redirectTo({
      url: '../home/home',
    })
  },
  onLoad: function () {
    var that = this
    // 登录
    wx.login({
      success: res => {
        app.globalData.code = res.code
        //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
        app.globalData.userInfo = wx.getStorageSync('userInfo')
        //wx.getuserinfo接口不再支持
        wx.getSetting({
          success: (res) => {
            //判断用户已经授权。不需要弹框
            if (!res.authSetting['scope.userInfo']) {
              that.setData({
                showModel: true
              })
            } else {//没有授权需要弹框
              that.setData({
                showModel: false
              })
              wx.showLoading({
                title: '加载中...'
              })
              that.getOP(app.globalData.userInfo)
            }
          },
          fail: function () {
            wx.showToast({
              title: '系统提示:网络错误',
              icon: 'warn',
              duration: 1500,
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '系统提示:网络错误',
          icon: 'warn',
          duration: 1500,
        })
      }
    })
  },
  //获取用户信息新接口
  bindGetUserInfo: function (e) {
    //设置用户信息本地存储
    try {
      wx.setStorageSync('userInfo', e.detail.userInfo)
    } catch (e) {
      wx.showToast({
        title: '系统提示:网络错误',
        icon: 'warn',
        duration: 1500,
      })
    }
    // wx.showLoading({
    //   title: '加载中...'
    // })
    let that = this
    if (e.detail.userInfo) {
      that.getOP(e.detail.userInfo)
    } else {
      wx.showModal({
        title: '提示',
        content: '小程序功能需要授权才能正确使用哦！请点击“确定”-“用户信息”再次授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.openSetting({
              success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                  // that.getOP(e.detail.userInfo)
                  wx.getUserInfo({
                    success: res => {
                      that.getOP(res.userInfo)
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
  },
  getOP: function (res) {//提交用户信息 获取用户id
    let that = this
    let userInfo = res
    app.globalData.userInfo = userInfo
    wx.request({
      url: 'https://xyt.xuanyutong.cn/Servlet/userLoginServlet',
      //  url: 'http://192.168.0.146:8080/Servlet/userLoginServlet',
    //  url: 'http://192.168.0.153:8080/Servlet/userLoginServlet',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        code: app.globalData.code,//获取openid的话 需要向后台传递code,利用code请求api获取openid
        avatar: userInfo.avatarUrl,//获取头像
        username: userInfo.nickName,
      },
      success: function (res) {
        // console.log("访问服务器成功=====" + res.data);
        console.log("访问服务器成功" + res.data.aa);
        // console.log("访问服务器成功" + res.data.aa.openid);
        wx.setStorageSync('openid', res.data.aa.openid); // 单独存储openid
        wx.redirectTo({
          // url: '../home/home?musicValue=' + res.data.aa.musicValue
          url: '../home/home',
        })

      },
      fail: function () {
        // fail
        console.log('submit fail');
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'warn',
          duration: 1500,
        })
      }
    })
  },
  // 查看是否授权
  /************ wx.getSetting({
     success: function (res) {
       if (res.authSetting['scope.userInfo']) {
         wx.getUserInfo({
           success: function (res) {
             console.log(res.userInfo)
             //用户已经授权过
           }
         })
       }
     }
   })
 },
 bindGetUserInfo: function (e) {
   
   app.globalData.userInfo = e.detail.userInfo;
   console.log(app.globalData.userInfo);
   if (e.detail.userInfo) {
     //用户按了允许授权按钮
     var that = this;
     wx.request({
       url: 'https://xyt.xuanyutong.cn/Servlet/userLoginServlet', //登录，获得音乐值
       method: "POST",
       header: {
         'content-type': 'application/x-www-form-urlencoded',
       },
       data: {
         code: e.detail.userInfo.code,//获取openid的话 需要向后台传递code,利用code请求api获取openid
         avatar: e.detail.userInfo.avatarUrl,//获取头像
         username: e.detail.userInfo.nickName,
       },
       success: function (res) {
         // wx.setStorageSync("openid", res.data)//可以把openid保存起来,以便后期需求的使用 
         // console.log("返回数据为：" + res.data.aa.musicValue);//获得音乐值
         // console.log("返回数据为：" + res.data.aa.openid);//获得openid
         // console.log('submit success');
         wx.setStorageSync('openid', res.data.aa.openid); // 单独存储openid
         wx.redirectTo({
           url: '../home/home',
         })
       },
       fail: function () {
         // fail
         console.log('submit fail');
       }
     })

   } else {
     //用户按了拒绝按钮
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
       }})}
   //页面初始化
   if (app.globalData.userInfo) {
     wx.redirectTo({
       url: '../home/home',
     })
     this.setData({
       userInfo: app.globalData.userInfo,
       hasUserInfo: true,
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
   //console.log(e)
   app.globalData.userInfo = e.detail.userInfo
   if (app.globalData.userInfo) {
     // console.log("e");
     this.setData({
       userInfo: e.detail.userInfo,
       hasUserInfo: true
     })
     wx.redirectTo({
       url: '../home/home',
     })
   }else{
     wx.openSetting();
   }**************/

})
