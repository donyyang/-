var app = getApp();

let newActivity = {
  data: {
    activeDate: '',
    address: '',
    activeName:'',
    activeTime:'',
    activeDescript: '',
    createBtn: '创建',
    isShare: false,
    isSwicth: true,
    payAmount: 0,
  },
  onShow () {
    wx.setNavigationBarTitle({
      title: '创建活动',
    })
  },
  handleName (e) {
    this.setData({
      activeName: e.detail.value,
    })
  },
  bindDateChange (e) {
    this.setData({
      activeDate: e.detail.value
    })
  },
  bindTimeChange (e) {
    this.setData({
      activeTime: e.detail.value
    })
  },
  // 活动说明
  handleDescript (e) {
    this.setData({
      activeDescript: e.detail.value,
    })
  },
  // 输入支付金额
  handlePay (e) {
    this.setData({
      payAmount: e.detail.value,
    })
  },
  // 当前日期
  currentDate () {
    let currentDate = new Date(),
        currentYear = currentDate.getFullYear(),
        currentMonth = currentDate.getMonth()+1,
        currentDay = currentDate.getDate(),
        currentHour = currentDate.getHours(),
        currentMinute = currentDate.getMinutes();
    let activeDate = `${currentYear}-${currentMonth}-${currentDay}`,
        activeTime = `${currentHour}:${currentMinute}`;
    this.setData({
      activeDate,
      activeTime,
    });
  },
  onLoad () {
    this.currentDate();

    app.getUserInfo((userInfo, userId) => {
       this.setData({
         userId,
       })
     })
    // try {
    //   var userId = wx.getStorageSync('userId')
    //   if (userId) {
    //    this.setData({
    //      userId,
    //    })
    //   }
    // } catch (e) {
    //   // Do something when catch error
    // }
  },
  handleIptAdress (e) {
    this.setData({
      address: e.detail.value,
    })
  },
  handleAdress () {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28,
          success (res) {
            wx.chooseLocation({
              success (res) {
                that.setData({
                  address: res.address,
                })
              }
            })
          }
        })
      }
    })
  },
  requestCreate (options) {
    // 目前还不能删除的console.log，textera用的是bindblur
   console.log(1234,options.activeDescript);
    var that = this;
    app.fetchApi(`${app.globalData.URL}activity`,'POST',{
      title: options.activeName,
      beginTime: options.activeTime,
      place: options.address,
      description: options.activeDescript,
      creator: options.userId,
      amount: options.payAmount,
    }, (res) => {
      if (res.code == 200) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          createBtn: '分享',
          isShare: true,
        });
        wx.redirectTo({
          url: `../responeActivity/responeActivity?activityId=${res.data.id}`,
          success: function(res){
          },
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '创建失败',
        });
      }
    });
  },
  // 收费开关
  handleSwitch (e) {
    this.setData({
      isSwicth: e.detail.value,
    })
  },
  // handleCreate () {
  //   let activeTime = this.data.activeDate +' '+ this.data.activeTime,
  //       address = this.data.address,
  //       activeName = this.data.activeName,
  //       activeDescript = this.data.activeDescript,
  //       payAmount = this.data.payAmount,
  //       userId = this.data.userId,
  //       isShare = this.data.isShare;
  //   let that = this;
  //   if (address.trim().length == 0) {
  //     wx.showModal({
  //       title: '提示',
  //       content: '请输入活动地点',
  //       success: function(res) {
         
  //       }
  //     });
  //     return;
  //   }
  //   if (activeName.trim().length == 0) {
  //     wx.showModal({
  //       title: '提示',
  //       content: '请输入活动名称',
  //       success: function(res) {
  //       }
  //     })
  //     return;
  //   }
  //   let options = {
  //     activeName,
  //     activeTime,
  //     address,
  //     activeDescript,
  //     userId,
  //     payAmount
  //   };
  //   if (!isShare) {
  //     this.requestCreate(options);
  //   } else {
  //     // 分享的操作
  //   }
  // },
  formSubmit: function(e) {
    let activeTime = this.data.activeDate +' '+ this.data.activeTime,
        address = this.data.address,
        activeName = this.data.activeName,
        activeDescript = e.detail.value.activeDescript,
        payAmount = this.data.payAmount,
        userId = this.data.userId,
        isShare = this.data.isShare;
    let that = this;
    if (address.trim().length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入活动地点',
        success: function(res) {
         
        }
      });
      return;
    }
    if (activeName.trim().length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入活动名称',
        success: function(res) {
        }
      })
      return;
    }
    let options = {
      activeName,
      activeTime,
      address,
      activeDescript,
      userId,
      payAmount
    };
    if (!isShare) {
      this.requestCreate(options);
    } else {
      // 分享的操作
    }
  },
}

Page(newActivity);