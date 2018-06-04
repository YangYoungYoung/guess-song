// pages/pkstyle/pkstyle.js
var app = getApp()
var animation;
var musicName;
var music = [];
var mixname;
var oid;
var isRight;
var score;
var backgroundAudioManager = wx.getBackgroundAudioManager();
var timer;
//对方的动画对象
var rivalanimation;
//对方的总分数
var oppositeScore = 0;
//我的总分数
var userscore = 0;
//第几题
var topicNum = 0;
//是否进入下一题
var isNext = false;
var temp;
var isFirst = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null,
    timerId: 0,
    countDownNumber: 12,
    animationData: {},
    userscore: 0,
    yourscore: 0,
    opponentname: null,//对手昵称
    opponentimage:'',//对手头像
    disable:false,//设置按钮是否可以点击，默认可以点击
    index:6,
    content: '回答错误',
    pageCountDownNumber: 1//定时器
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("我现在的总分数是：" + userscore);
    wx.stopBackgroundAudio();

    // 调用应用实例的方法获取全局数据
    let app = getApp();
    // toast组件实例
    new app.ToastPannel();
    oid = wx.getStorageSync('oid');
    musicName = null;
    music = [];
    mixname = null;
    topicNum++;
    if (topicNum>5){
      topicNum =1;
    } 
    //将彩色圆环归0
    this.drawCircle(0)
    console.log("当前为关卡数：" + topicNum);
    console.log("对方的openid为：" + oid);
    var that = this;
    
    that.setData({
      count: 0, // 设置 计数器 初始为0
      countDownNumber: 12,
      countTimer: null,
      content: '回答错误',
      disable: false,//设置按钮不禁用
      pageCountDownNumber: 1//定时器
    });
    wx.request({
      url: 'https://xyt.xuanyutong.cn/Servlet/musicSelectServlet',
      // url: 'http://192.168.0.146:8080/Servlet/musicSelectServlet',
      method: "POST",
      header: {
        // ' -Type': 'application/json'
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        openid: wx.getStorageSync('openid'),
        oid:oid
      },
      success: function (res) {
        // 获取到对方的头像，用户名
        console.log("获取对手用户名" + res.data.name);
        console.log("获取对手头像" + res.data.avatar);
        that.setData({
          opponentname:res.data.name,
          opponentimage: res.data.avatar
        })

        //播放音乐
        that.backgroundAudioManager = wx.getBackgroundAudioManager();
        backgroundAudioManager.title = '123'
        backgroundAudioManager.epname = '123'
        backgroundAudioManager.singer = '123'
        backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
        that.backgroundAudioManager.src = res.data.voice;
        console.log("获取混淆歌曲" + res.data.voice);
        //获取正确歌名
        musicName = res.data.musicname;
        console.log("获取正确歌曲====" + res.data.musicname);
        //获取混淆歌曲
        mixname = res.data.mixname;
        console.log("获取混淆歌曲====" + res.data.mixname);
        if (mixname.length > 0) {
          for (var j = 0; j < mixname.length; j++) {
            var obj = {};
            obj.id = j;
            obj.name = mixname[j]
            music.push(obj);
            console.log("============" + music);
            that.setData({
              list: music
            })
          }
        }
        //开始画圈圈
        // that.drawProgressbg();
        // that.countInterval();
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
    timer = setInterval(function () {
      page.setData({
        countDownNumber: page.data.countDownNumber - 1
      });
      if (page.data.countDownNumber == 0) {
        clearInterval(timer);
        score = 0;
        userscore += score;
        //时间停止的话走这里
        that.scroeReq();
      }
    }, 1000);
    that.timer = timer;
  },

  clickbtn: function (e) {
    var checkTheAnswer = false;
    var that = this;
    var itemId = e.currentTarget.id;
    var text = e.currentTarget.dataset.text;
    console.log("当前点击的id:" + itemId);
    //设置按钮是否禁用
    that.setData({
      disable: true
    })
    if (text.length > 0) {
      for (var i = 0; i < musicName.length; i++) {
        console.log("------------------正确歌名" + musicName[i]);
        console.log("------------------选择歌名" + text[i]);
        if (text[i] == musicName[i]) {
          checkTheAnswer = true;
          // temp = i;
          console.log("正确答案的位置是："+temp);
        } else {
          checkTheAnswer = false;
          break;
        }
      }
    }
    //如果回答正确
    if (checkTheAnswer) {
      console.log("=================回答正确");
      score = that.data.countDownNumber * 5;
      console.log("获取分数" + score);
      that.setData({
        content: '回答正确'
      })
      // itemId.css("background-color","#33CC33");
      // that.setData({
      //   viewBg:"green"
      // })
      // this.setData({
      //   index: itemId
      // })

    }
    //如果回答错误
    else {
      console.log("=================回答错误");
      score = 0;
      // itemId.css("background-color", "#990000");
      // this.setData({
      //   index: temp
      // })
      that.setData({
        content: '回答错误'
      })
    }
    
    userscore += score;
    console.log("我的总分数是" + userscore);
    that.scroeReq();
  },
  //选择完返回数据给服务器
  scroeReq: function () {
    var that = this;
    console.log("=================" + oid);
    wx.request({
      url: 'https://xyt.xuanyutong.cn/Servlet/selectMusicScoreServlet',
      // url: 'http://192.168.0.153:8080/Servlet/selectMusicScoreServlet',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        openid: wx.getStorageSync('openid'),
        oid: oid,
        score: userscore
      },
      success: function (res) {
        
        // 触发toast组件
        that.show(that.data.content);
        //取消计时器
        clearInterval(timer);
        console.log("对方的分数=====" + res.data.oppositeScore);
        oppositeScore = res.data.oppositeScore;
        // yourscore += oppositeScore;
        that.setData({
          userscore: userscore,
          yourscore: oppositeScore
        })
        
        that.pkAnimation(userscore, oppositeScore);
        //音乐停止
        wx.stopBackgroundAudio();
        //如果关数到了第五关就按分数对比，如果不到第五关就跳转到下一关
        //倒计时关闭当前页，重定向到pk界面
        var pagetimer = setInterval(function () {
          that.setData({
            pageCountDownNumber: that.data.pageCountDownNumber - 1
          });
          if (that.data.pageCountDownNumber == 0) {
            clearInterval(pagetimer);
            // wx.navigateTo({
            //   url: '../pkstyle/pkstyle?oid=' + oid
            // })
            if (topicNum == 5) {
              // console.log("")
              //记录分数清空
              userscore = 0;
              oppositeScore = 0;
              that.setData({
                userscore: 0,
                yourscore: 0
              })
              //跳转到结果界面
              wx.redirectTo({
                url: '../pkend/pkend'
              })
            }
            else {
              isNext = true;
              that.onShow();
                // this.onLoad();
            }
          }
        }, 1000);
        
      }
    })
  },


  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(4);// 设置圆环的宽度
    ctx.setStrokeStyle('#20183b'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(110, 110, 50, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#2661DD");
    gradient.addColorStop("0.5", "#40ED94");
    gradient.addColorStop("1.0", "#5956CC");

    context.setLineWidth(10);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(55, 110, 50, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  countInterval: function () {
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    this.countTimer = setInterval(() => {
      if (this.data.count <= 120) {
        /* 绘制彩色圆环进度条 
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        this.drawCircle(this.data.count / (120 / 2))
        this.data.count++;
      }
      else {
        //时间到音乐自动停止
        // wx.stopBackgroundAudio();
        // isNext = true;
        // this.onShow();
      }
    }, 100)
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  onReady: function () {
    // this.drawProgressbg();
    this.countInterval();
  },

  onShow: function () {
    // console.log("=============是不是又走了一次这里");
    if (isNext) {
      this.onLoad();
      isNext = false;
    }
  },
  /**
     * 根据分数，两侧动画
     */
  pkAnimation: function (score, oppositeScore) {
    //实际变化的距离
    var temp1 = score * 1.2;
    var temp2 = oppositeScore * 1.2;
    var that = this;
    console.log("------------------" + temp1);
    console.log("------------------" + temp2);
    animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    that.animation = animation;
    that.animation.translateY(-temp1).step({ duration: 1000 })
    that.setData({
      animationData: that.animation.export()
    })
    //对手的动画变化
    rivalanimation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    that.rivalanimation = rivalanimation;
    that.rivalanimation.translateY(-temp2).step({ duration: 1000 })
    that.setData({
      rivalanimation: that.rivalanimation.export()
    })
  },
  /**
    * 监听页面隐藏
    *    当前页面调到另一个页面时会执行
    */
  onHide: function () {
    // console.log('index---------onHide()')
    // musicName = null;
    // music = [];
    // mixname = null;

    // if (topicNum > 5) {
    //   topicNum = 0;
    // }
   
  },

  /**
   * 当页面销毁时调用
   */
  onUnload: function () {
    console.log('index---------onUnload')
    var that = this;
    clearInterval(timer);
    that.setData({
      userscore: 0,
      yourscore: 0
    })
    // that.data.thauserscore = 0;
    // that.data.yourscore = 0;
    console.log("我现在的总分数是：" + userscore);
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
