// pages/game/game.js
var app = getApp();
var util = require('../../utils/util.js')
var isPlay = false
var music = null;
var musicName
var nameHouse
var backgroundAudioManager = wx.getBackgroundAudioManager()
var list_name = []
var list_all = []
var name
var j = 0;
var array = [];
var namearray = [];
var times = 0;
var canUseTimes = 0;
var titlelist = [];
var hasChangeAnswer = false;
var clicked = [];
var hintTimes = 0;
var checkTheAswer = false;
var checkFull = false;
var next = false;
var passnum = -1;
var url;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uhide: 100,
    gameNumber1: 1,
    //animationData: {},
    flag: true,
    imageUrl: "../../images/bt_triangle.png",
    showView: true,
    grade: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.showShareMenu({
      withShareTicket: true
    })
    nameHouse = null;
    musicName = null;
    list_all = [];
    list_name = []
    list_all = []
    name
    j = 0;
    array = [];
    namearray = [];
    times = 0;
    canUseTimes = 0;
    titlelist = [];
    hasChangeAnswer = false;
    clicked = [];
    hintTimes = 0;
    checkTheAswer = false;
    checkFull = false;
    music = null;

    var that = this//不要漏了这句，很重要
    // console.log("查看条件" + passnum + "-----" + next);
    if (passnum > -1 && next) {
      // console.log("在这里停止播放");
      this.setData({
        imageUrl: '../../images/bt_triangle.png',
      });
      wx.stopBackgroundAudio();
      next = false;
      isPlay = false;
      url = 'https://xyt.xuanyutong.cn/Servlet/nextLevelServlet'
    } else {
      url = 'https://xyt.xuanyutong.cn/Servlet/selectMusicByOpenid'
    }
    // console.log("URL是" + url);
    wx.request({
      url,
      headers: {
        ' -Type': 'application/json'
      },
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        passnum = res.data.id;
        // console.log("关卡数是" + passnum);
        that.setData({
          voice: res.data.voice,
          namehouse: res.data.namehouse,
          grade: res.data.id
        });
        music = res.data.voice
        musicName = res.data.musicname
        nameHouse = res.data.namehouse
        that.setData({
          songname: musicName
        })
        // console.log(res.data)
        // console.log(nameHouse)

        //获取歌名框
        // list_name = {}
        if (musicName.length > 0) {
          for (var i = 0; i < musicName.length; i++) {
            list_name[i] = musicName[i]
            titlelist[i] = musicName[i]
          }
        }
        that.setData({
          list_name: list_name
        })
        that.update()
        //所有字
        for (j = 0; j < nameHouse.length; j++) {
          var obj = {};
          obj.id = j;
          obj.name = nameHouse[j]
          array.push(obj);
          that.setData({
            list_all: array
          })
        }
      }
    })
    //自动播放完后图标变成暂停状态

    backgroundAudioManager.onEnded(function () {
      that.setData({
        imageUrl: '../../images/bt_triangle.png'
      });
      isPlay = false;
    })
  },

  //点击提示按钮
  toHint: function () {

    var that = this//不要漏了这句，很重要
    wx.request({
      url: 'https://xyt.xuanyutong.cn/Servlet/clickTipServlet',
      headers: {
        ' -Type': 'application/json'
      },
      data: {
        openid: wx.getStorageSync('openid')
      },

      success: function (res) {
        //  console.log("用户请求了一次提示"+res.data.musicValue);
        if (res.data.musicValue >= 0) {
          var temp = titlelist.pop();
          var index = titlelist.length;
          // console.log("提示：" + temp);
          var obj = {};
          obj.id = hintTimes;
          obj.name = temp;
          list_name[index] = obj;
          that.setData({
            list_name: list_name
          });
          hintTimes++;
          //  console.log("提示的次数：" + hintTimes);
          if (hintTimes == musicName.length) {
            that.checkAnswer();
          }
        }
        else {
          wx.showToast({
            title: '没有音乐值了',
            icon: 'loading',
            duration: 1000,
            mask: true
          })
        }
      }
    })
    if (this.isFull()) {
      this.checkAnswer();
    }
  },
  //点击音乐播放和停止
  change: function () {
    this.PlayMusic();
  },

  //点击音乐播放和停止
  PlayMusic: function () {
    var that = this
    var n = 0;
    if (isPlay) {
      this.setData({
        imageUrl: '../../images/bt_triangle.png',
      });
      isPlay = false;
      wx.stopBackgroundAudio();
      // console.log('停止播放')
      //stop

    } else {
      this.setData({
        imageUrl: '../../images/bt_start.png'
      });
      isPlay = true;
      this.backgroundAudioManager = backgroundAudioManager;
      backgroundAudioManager.title = '123'
      backgroundAudioManager.epname = '123'
      backgroundAudioManager.singer = '123'
      this.backgroundAudioManager.src = music;
      // console.log('开始播放')
      //animation
    }
  },

  rotate: function (n) {
    animation.rotate(360 * (n)).step()
    this.setData({
      animationData: animation.export()
    })
  },
  /**
    * 错误弹窗
    */
  showWrongDialogBtn: function () {
    this.setData({
      showWrongModal: true
    })
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
 * 关闭错误对话框
 */
  hideWrongModal: function () {
    this.setData({
      showWrongModal: false,
    });
    var that = this;
    // list_name = {}重置输入框
    if (musicName.length > 0) {
      for (var i = 0; i < musicName.length; i++) {
        list_name[i] = musicName[i]
        titlelist[i] = musicName[i]
      }
    }
    that.setData({
      list_name: list_name
    })
    that.update();
    times = 0;
    canUseTimes = 0;
  },
  /**
   * 错误对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideWrongModal();
  },
  /**
   * 正确对话框确认按钮点击事件
   */
  toNext: function () {
    this.hideModal();
    next = true;
    this.onShow();
  },
  /**
  * 判断用户答案是否正确
  */
  checkAnswer: function () {
    //判断用户答案是否正确
    for (var i = 0; i < musicName.length; i++) {
      if (list_name[i].name == musicName[i]) {
        checkTheAswer = true;
      }
      else {
        checkTheAswer = false;
        break;
      }
    }
    if (checkTheAswer) {
      this.showDialogBtn();
    }
    else {
      this.showWrongDialogBtn();
    }
  },
  //判断输入框是否填满
  isFull: function () {
    for (var i = 0; i < list_name.length; i++) {
      // console.log("============" + list_name[i].name);
      if (list_name[i].name != null) {
        checkFull = true;
      }
      else {
        checkFull = false;
        break;
      }
    }
    //输入框满了需要校验用户的答案
    // console.log("是否满了" + checkFull);
    return checkFull;
  },

  //点击文本事件
  click: function (e) {
    if (times < musicName.length) {
      var that = this;
      var itemId = e.currentTarget.id;
      var text = e.currentTarget.dataset.text;
      var index = 0;
      that.data.uhide = itemId;
      var obj = {};
      obj.id = times;
      obj.name = text;
      if (clicked.length > 0) {

        index = clicked.length;
        // console.log("数组的长度：" + index);
        var num = clicked[0];
        // console.log("给第几个id赋值：" + num);
        clicked.shift();
        list_name[num] = obj;
        // console.log("歌曲名字：" + list_name[times]);
      }
      else {
        list_name[times] = obj;
      }
      that.setData({
        list_name: list_name,
      })
      times++;
      canUseTimes++;
      // console.log("选择答案的次数" + times);
    }
    if (times == musicName.length) {
      // console.log("是否来这里判断了？？？对比长度");
      this.checkAnswer();
    }
    if (this.isFull()) {
      // console.log("是否来这里判断了？？？");
      this.checkAnswer();
    }
  },


  //答案处点击事件
  nameclick: function (e) {
    if (canUseTimes <= musicName.length || times > 0) {
      hasChangeAnswer = true;
      var that = this;
      var itemId = e.currentTarget.id;
      that.data.uhide = itemId;
      // console.log("点击的ID是" + itemId);
      list_name[itemId] = ""
      //点击过的数组
      clicked.push(itemId);
      //对点击过的ID进行倒序排列
      clicked.sort();

      that.setData({
        list_name: list_name
      })
      that.update();
      canUseTimes--;
      times--;
      if (canUseTimes < 0 && times < 0) {
        canUseTimes = 0;
        times = 0;
      }
      // console.log("可以取消答案的次数" + canUseTimes);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (next) {
      this.onLoad(e);
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '馋猫猜歌名',
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