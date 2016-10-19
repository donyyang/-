//app.js
App({
  onLaunch: function () {
    this.getUserInfo();
  }, 
  globalData:{
    items: [
      {
        name: '创建新的群组',
        page: 'createGroup'
      },
      {
        name: '通过群组ID添加群组',
        page: 'idGroup'
      },
      {
        name: '扫描二维码添加群组',
        page: 'codeGroup'
      },
    ],
    // 单独的data,从页面中的数据传过来
    singledata:null,
    userInfo: null,
    HOST_URI: "http://115.236.94.220:55102/smater",
    userId: 'u001',
    // 点击每个群组的data
    groupData: [],
    myNickName: 'weixin',
    // 默认的头像
    userHead: 'http://b.hiphotos.baidu.com/baike/w%3D268%3Bg%3D0/sign=92e00c9b8f5494ee8722081f15ce87c3/29381f30e924b899c83ff41c6d061d950a7bf697.jpg',
  },
  // 封装的ajax
  fetchApi (url, data, callback) {
    wx.request({
      url,
      data: data,
      header: { 'Content-Type': 'application/json' },
      success (res) {
        callback(null, res.data)
      },
      fail (e) {
        callback(e)
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo)
    } else {
      wx.login({
        success: function (logRes) {
          
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
              console.log(res);
            }
          })
          // console.log(222,logRes.code);
          if (logRes.code) {
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                appid: 'wxc5340924550d61ce',
                secret: '422b5316230e22a99a67f6ae8daa0718',
                js_code: logRes.code,
                grant_type: 'authorization_code',
              },
              success: function (res) {
                // console.log(11112,res)
              }
            })
          }
        }
      })
    }
  },
})