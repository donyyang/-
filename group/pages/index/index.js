 var app = getApp()
 let createDataList = [];

 var indexs = {
   data: {
    userInfo: '',
    createDatas: [],
    attendDatas: [],
    cforbidenLower: false,
    createPage: 1,
    currentTime: '',
   },
   requestList (page,userId) {
    var that = this;
    let currentTime = this.data.currentTime;
    app.fetchApi(`${app.globalData.URL}activity/createList`,"GET",{
      userId,
      page: page,
      pageSize: 10,
    },(res) => {
      if (res.code == 200) {
        let createData = res.data;

        if (createData.length) {
          createData.map((item, index) => {
            createDataList.push(item);
          })
        }
        this.setData({
          createDatas: createDataList,
        });
        
        if (createData.length < 10) {
          this.setData({
            cforbidenLower: true,
          })
        }
      }
    })
  },
   onShow () {
    let currentTime = new Date();
    this.setData({
      currentTime,
      createPage: 1,
      cforbidenLower: false,
    });
    createDataList = [];
    
    wx.setNavigationBarTitle({
      title: '发起活动',
    })
    app.getUserInfo((userInfo, userId) => {
      this.setData({
        userId,
      })
      if (userId.length != 0) { 
        this.requestList(1, this.data.userId);
      }
    })
    // try {
    //   let userId = wx.getStorageSync('userId');
    //   console.log(userId);
    //   if (userId) {
    //     this.setData({
    //       userId,
    //     });
    //     if (userId.length != 0) { 
    //       this.requestList(1, this.data.userId);
    //     }
    //   }
    // } catch (e) {
    //   // Do something when catch error
    // }
    
    var that = this;
  },
  cbindscrolltolower () {
    var createPage = this.data.createPage,
        userId = this.data.userId,
        cforbidenLower = this.data.cforbidenLower;

    if (cforbidenLower) {
      return;
    }

    this.setData({
      createPage: createPage + 1,
    })
    this.requestList(this.data.createPage, userId);
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
  // 编辑活动
  jumpActive (currentId) {
    wx.navigateTo({
      url: `../modifyActivity/modifyActivity?activityId=${currentId}`
    })
  },
   // 关闭活动
  requestClose (currentId) {
    app.fetchApi(`${app.globalData.URL}activity/close`,'GET',{
      activityId: currentId,
      userId: this.data.userId,
    },(res) => {
      if (res.code == 200) {
        wx.showToast({
          title: '关闭成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  // 关闭活动等
  handleOperate (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['编辑活动','关闭活动'],
      success: function(res) {
        if (!res.cancel) {
          let currentIdx = res.tapIndex,
              currentId = e.currentTarget.dataset.id;
          
          if (currentIdx == 0) {
            that.jumpActive(currentId);
          } else {
            that.requestClose(currentId);
          }
        }
      }
    })
  },
 }
 Page(indexs);