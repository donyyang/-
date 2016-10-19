var app = getApp();

var groupInfo = {
  data: {
    newGroup: {},
    myNickName: app.globalData.myNickName,
    manageGroupTitle: '我创建的群组',
    modifyHidden: true,
    modifyGname: '',
    modifyGremark: '',
    modifyShow: true,
    isShow: false,
    addModifyName: '',
    addModifyRemark: '',
    toastHidden: true,
    infoTips: '',
  },
  modifyName: function (e) {
    this.setData({
      modifyGname: e.detail.value
    })
  },
  modifyRemark: function (e) {
    this.setData({
      modifyGremark: e.detail.value
    })
  },
  // 修改接口
  requestModify: function () {
    var that = this;
    var modifyname = this.data.modifyGname;
    var modifyremark = this.data.modifyGremark;
    if (!modifyname.length) {
      this.setData({
        modifyGname: this.data.newGroup.groupName,
      });
    };
    if (!modifyremark.length) {
      this.setData({
        modifyGremark: this.data.newGroup.groupRemark,
      });
    };

    app.fetchApi(app.globalData.HOST_URI + '/group/change',{
      groupId: this.data.newGroup.groupId,
      groupName: encodeURI(this.data.modifyGname),
      groupRemark: encodeURI(this.data.modifyGremark),
      userId: app.globalData.userId,
    },function (err,data) {
      if (data.code == 200) {
        var data = data;
        that.setData({
          isShow: true,
          modifyShow: false,
          addModifyName: that.data.modifyGname,
          addModifyRemark: that.data.modifyGremark,
          toastHidden: false,
          infoTips: '操作成功',
        })
      }
    })

    // wx.request({
    //   url: app.globalData.HOST_URI + '/group/change',
    //   data: {
    //     groupId: this.data.newGroup.groupId,
    //     groupName: encodeURI(this.data.modifyGname),
    //     groupRemark: encodeURI(this.data.modifyGremark),
    //     userId: app.globalData.userId,
    //   },
    //   success: function (res) {
    //     var data = res.data;
    //     that.setData({
    //       isShow: true,
    //       modifyShow: false,
    //       addModifyName: that.data.modifyGname,
    //       addModifyRemark: that.data.modifyGremark,
    //     })

    //     console.log(that.data.newGroup.groupName);
    //     console.log(that.data.newGroup.groupRemark);
    //   }
    // })
  },
  modifyConfir: function () {
    this.setData({
      modifyHidden: true,
    });
    this.requestModify();
  },
  modifyCancle: function () {
    this.setData({
      modifyHidden: true,
    })
  },
  handleModify: function () {
    this.setData({
      modifyHidden: false,
    });
  },
  handleCode: function () {
    var groupId = this.data.newGroup.groupId;
    var groupName = this.data.newGroup.groupName;
    
    wx.navigateTo({
      url: '../codePic/codePic?groupId='+groupId+'&groupName='+groupName,
    })
  },

  onLoad: function (options) {
    var that = this;
    this.setData({
      myNickName: app.globalData.myNickName
    })
    app.fetchApi(app.globalData.HOST_URI + '/group/add',{
      groupName: encodeURI(options.groupName),
      groupRemark: encodeURI(options.groupRemark),
      userId: app.globalData.userId,
      userName: encodeURI(app.globalData.myNickName),
    },function (err,data) {
      if (data.code == 200) {
        var data = data.data;
        var changeData = {
          gmtCreate: data.gmtCreate,
          gmtModify: data.gmtModify,
          groupId: data.groupId,
          groupName: decodeURI(data.groupName),
          groupPostion: data.groupPostion,
          groupQrcode: data.groupQrcode,
          groupRemark: decodeURI(data.groupRemark),
          groupUserRemark: decodeURI(data.groupUserRemark),
          isDelete: data.isDelete,
        }
  
        that.setData({
          newGroup: changeData
        });
      }
    })
  },
  handleToast: function () {
    this.setData({
      toastHidden: true,
    });
  },
}

Page(groupInfo);