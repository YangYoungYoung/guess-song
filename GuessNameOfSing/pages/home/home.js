// pages/home/home.js
const app = getApp()
var refresh = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    ranktext: "排行榜",
    moretext: "小客服",
    abouttext: "小助手",
    musicValue:0,
    flagNote:true,
    value:0,
  },
  //跳转到对战模式
  pkbtnclick: function (e) {
    var that = this
    if (that.data.musicValue>=20){
      refresh = true;
      wx.navigateTo({
        url: '../pkwating/pkwating',
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '您当前音乐值不足20',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }    
    // wx.showToast({
    //   title: '敬请期待',
    //   icon: 'loading',
    //   duration: 1000,
    //   mask: true
    // })
  },
  //跳转到传统闯关模式
  passbtnclick: function (e) {
    refresh = true;
    wx.navigateTo({
      url: '../pass/pass',
    })
  },
  //跳转到排行榜
  rankclick: function (e) {
    refresh = true;
    wx.navigateTo({
      url: '../rank/rank',
    })
  },
  //跳转到更多小助手
  helperclick: function (e) {
    refresh = true;
    wx.navigateTo({
      url: '../about/about',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // this.setData({
    //   musicValue: options.musicValue
    // });
    this.showDialogBtn();
    var that = this;
    // if (options.id==1) {
    //   that.close();
    // }
    // console.log("==============" + wx.getStorageSync('openid'));
    wx.request({
      url: 'https://xyt.xuanyutong.cn/Servlet/selectMusicValueServlet',
      // url: 'http://192.168.0.146:8080/Servlet/selectMusicValueServlet',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        that.setData({
          musicValue: res.data.musicValue,
          value: res.data.addValue
          // value:30
        });
        console.log("每日登录返回值是：" + res.data.addValue);
        // if (res.data.addValue>0){
        //   value:res.data.addValue
        // }
        // console.log(res.data.addValue)
      },
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
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow: function (e) {
    if (refresh) {
      this.onLoad(e);
    }
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
    * 正确弹窗
    */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 关闭成功对话框并跳转到下一关
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },


  /**
  * 弹出层函数
  */
  //出现
  show: function () {

    this.setData({ flagNote: false })
    this.setData({ loginshow: false })
  },
  //消失

  hide: function () {

    this.setData({ flagNote: true })

  },
  toNote: function () {
    this.setData({ flagNote: false })
    this.setData({ loginshow: true })
  },
  toLogin: function () {
   // this.hideModal();
    this.setData({ flagNote: true, })
    //this.onShow();
    this.hideModal()
  },
  /**
  * 放弃游戏
  */
  // close: function () {
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
