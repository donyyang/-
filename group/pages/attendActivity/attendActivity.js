//index.js
let attendDataList = [];

var app = getApp()
var curentActivity = {
  data: {
    userInfo: '',
    attendDatas: [],
    aforbidenLower: false,
    attendPage: 1,
    currentTime: '',
  },
  requestAttendList (page, userId) {
    let currentTime = this.data.currentTime;
    app.fetchApi(`${app.globalData.URL}activity/attendList`,"GET",{
      userId,
      page: page,
      pageSize: 10,
    },(res) => {
      if (res.code == 200) {
        let attendData = res.data;

        if (attendData.length) {
          attendData.map((item, index) => {
            attendDataList.push(item);
          })
        }
        this.setData({
          attendDatas: attendDataList,
        });

        if (attendData.length < 10) {
          this.setData({
            aforbidenLower: true,
          })
        };
      }
    })
  },
  onShow () {
    let currentTime = new Date();
    this.setData({
      currentTime,
      attendPage: 1,
      aforbidenLower: false,
    });
    attendDataList = [];
    
    wx.setNavigationBarTitle({
      title: '我参与的活动',
    })
    app.getUserInfo((userInfo, userId) => {
      this.setData({
        userId,
      })
      if (userId.length != 0) { 
        this.requestAttendList(1, this.data.userId);
      }
    })
    // try {
    //   var userId = wx.getStorageSync('userId')
    //   if (userId) {
    //     this.setData({
    //       userId,
    //     });
    //     this.requestAttendList(1, userId);
    //   }
    // } catch (e) {
    //   // Do something when catch error
    // }
  },
  abindscrolltolower () {
    var attendPage = this.data.attendPage,
        userId = this.data.userId,
        aforbidenLower = this.data.aforbidenLower;

    if (aforbidenLower) {
      return;
    }

    this.setData({
      attendPage: attendPage + 1,
    })
    this.requestAttendList(this.data.attendPage, userId);
  },
  handleAddActive () {
    wx.navigateTo({
      url: '../newActivity/newActivity',
      success: function(res){
        // success
      },
    })
  },
  handleDetial (e) {
    let activityId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../responeActivity/responeActivity?activityId=${activityId}`
    })
  },
}

Page(curentActivity);