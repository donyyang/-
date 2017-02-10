//app.js
/**
 online - wss://ws.xiaoyuanhao.com
 test   - wss://ws.xiaoyuanhao.com/test
 dev    - wss://ws.xiaoyuanhao.com/dev
 */
App({
  onLaunch () {
  },
  fetchApi (url, method, data, callback) {
    let header;
    method == 'GET' ? header = {"content-type":"application/x-www-form-urlencoded"} : header = { 'Content-Type': 'application/json' }
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success (res) {
        callback(res.data)
      },
      fail (e) {
        callback(e)
      }
    })
  },
  getUserInfo (cb){
    var that = this

    if(this.globalData.userInfo && this.globalData.userId){
      typeof cb == "function" && cb(this.globalData.userInfo,this.globalData.userId)
    }else{
      //调用登录接口
      wx.login({
        success: function (loginRes) {
          console.log(234,loginRes.code);
          if (that.globalData.userId) {
            return cb(that.globalData.userInfo,that.globalData.userId);
          }
          if (loginRes.code) {
            that.fetchApi(`${that.globalData.URL}onLogin`,'GET', {
              code: loginRes.code,
            }, (res) => {
              if (res.code == 200) {
                 wx.getUserInfo({
                  success: function (userInfores) {
                    that.globalData.userInfo = userInfores.userInfo
                    that.fetchApi(`${that.globalData.URL}activity/userInfo`,'POST',{
                      userId: res.data.userId,
                      userInfo: userInfores.userInfo,
                    },(userRes) => {
                    that.globalData.userId = userRes.data.userId;
                    try {
                        wx.setStorageSync('userId', userRes.data.userId)
                    } catch (e) {    
                    }
                    typeof cb == "function" && cb(that.globalData.userInfo,that.globalData.userId)
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    userId: '',
    URL: 'https://m.xiaoyuanhao.com/api/cms/',
    wsURL: 'wss://ws.xiaoyuanhao.com/',
    UPLOADURL: 'https://m.xiaoyuanhao.com/api/cms/store/file',
  }
})