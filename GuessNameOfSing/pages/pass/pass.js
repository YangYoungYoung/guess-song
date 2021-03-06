// pages/pass/pass.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: "",//用户头像  
      nickName: "",//用户昵称  
    },
    gameNumber: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showShareMenu({
      withShareTicket: true
    })
    // console.log("闯关模式里" + wx.getStorageSync('openid'));
    var that = this
    wx.request({
      url: 'https://xyt.xuanyutong.cn/Servlet/selectMusicByOpenid',
      // url: 'http://192.168.0.146:8080/Servlet/selectMusicByOpenid',
      // method: "POST",
        headers: {
          ' -Type': 'application/json'
        },
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        console.log("=============关数：" + res.data.id);
        that.setData({
          gameNumber: res.data.id
        });
      }
    })
    
    wx.getUserInfo({
      success: function (res) {
        //console.log(res);
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '馋猫猜歌名',
      path: 'path'
    }

  },
  //跳转进入游戏
  navgeteDail: function () {
    wx.redirectTo({
      url: '../game/game'
    })
  },

})