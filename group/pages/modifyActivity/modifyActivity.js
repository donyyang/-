let app = getApp();

let modifyActivity = {
  data: {
    activityId: '',
    activeDate: '',
    address: '',
    activeName:'',
    activeTime:'',
    activeDescript: '',
    createBtn: '修改',
    isShare: false,
  },
  onShow () {
    wx.setNavigationBarTitle({
      title: '修改活动',
    })
  },
  onLoad (options) {
    console.log(options);
    let activityId = options.activityId;
    app.getUserInfo((userInfo, userId) => {
      this.setData({
        userId,
      });
      this.requestActivity(activityId, userId);
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
    this.setData({
        activityId,
    });
  },
  handleName (e) {
    this.setData({
      activeName: e.detail.value,
    })
  },
//   bindDateChange (e) {
//     this.setData({
//       activeDate: e.detail.value
//     })
//   },
//   bindTimeChange (e) {
//     this.setData({
//       activeTime: e.detail.value
//     })
//   },
  // 活动说明
  handleDescript (e) {
    this.setData({
      activeDescript: e.detail.value,
    })
  },
//   活动内容
  requestActivity (activityId, userId) {
      app.fetchApi(`${app.globalData.URL}activity/detail`,"GET",{
        activityId,
        userId,
      },(res) => {
          let data = res.data;
          if (res.code == 200) {
            this.setData({
                activeName: data.title,
                activeDate: data.beginTime,
                address: data.place,
                activeDescript: data.description,
            })
          }
      })
  },
  handleIptAdress (e) {
    this.setData({
      address: e.detail.value,
    })
  },
//   handleAdress () {
//     let that = this;
//     wx.getLocation({
//       type: 'gcj02', //返回可以用于wx.openLocation的经纬度
//       success (res) {
//         let latitude = res.latitude
//         let longitude = res.longitude
//         wx.openLocation({
//           latitude: latitude,
//           longitude: longitude,
//           scale: 28,
//           success (res) {
//             wx.chooseLocation({
//               success (res) {
//                 that.setData({
//                   address: res.address,
//                 })
//               }
//             })
//           }
//         })
//       }
//     })
//   },
  requestCreate (activityId, activeName, activeDescript, userId) {
    // 目前还不能删除的console.log，textera用的是bindblur
   console.log(activeDescript);
    var that = this;
    app.fetchApi(`${app.globalData.URL}activity`,'PUT',{
      activityId,
      title: activeName,
      description: activeDescript,
      userId,
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
  // handleCreate () {
  //   // let activeTime = this.data.activeDate +' '+ this.data.activeTime,
  //   //     address = this.data.address,
  //   //     activeName = this.data.activeName,
  //   //     activeDescript = this.data.activeDescript,
  //   //     isShare = this.data.isShare;
  //   let activityId = this.data.activityId,
  //       activeName = this.data.activeName,
  //       activeDescript = this.data.activeDescript,
  //       isShare = this.data.isShare;
  //   let that = this;

  //   if (activeName.trim().length == 0) {
  //     wx.showModal({
  //       title: '提示',
  //       content: '请输入活动名称',
  //       success: function(res) {
  //       }
  //     })
  //     return;
  //   }
  //   if (!isShare) {
  //   //   this.requestCreate(activeName, activeTime, address, activeDescript, this.data.userId);
  //     this.requestCreate(activityId, activeName, activeDescript, this.data.userId);
  //   } else {
  //     // 分享的操作
  //   }
  // },

  formSubmit: function(e) {
    let activityId = this.data.activityId,
        activeName = this.data.activeName,
        activeDescript = e.detail.value.activeDescript,
        isShare = this.data.isShare;
    let that = this;

    if (activeName.trim().length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入活动名称',
        success: function(res) {
        }
      })
      return;
    }
    if (!isShare) {
    //   this.requestCreate(activeName, activeTime, address, activeDescript, this.data.userId);
      this.requestCreate(activityId, activeName, activeDescript, this.data.userId);
    } else {
      // 分享的操作
    }
  },
}

Page(modifyActivity);