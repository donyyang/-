var app = getApp();
// 点击管理员从底部弹出的框出现的内容
var manageAction=[];
    // 点击成员从底部弹出的框出现的内容
var userAction=[];

var lookGroupInfo = {
  data: {
    myNickName:null,
    searchId: null,
    publishInfo: '发布通知',
    createPerson: '创建者',
    managePerson: '管理员',
    groupPerson: '群组成员',
    modifyNameHidden: true,
    modifyRemarkHidden: true,
    modifyNikNameHidden: true,
    modifyName: '',
    modifyRemark: '',
    modifyNickName: '',
    modifyHead: '',
    groupId: '',
    // 判断是否是创建的群，url上传了一个创建群特有的参数
    createGroup: '',
    manageGroup: '',
    userGroup: '',

    isCreateGroup:'',
    isNameHide: false,
    isRemarkHide: false,
    isNicknameHide: false,
    modifyNameIsHide: true,
    modifyRemarkIsHide: true,
    modifyNickNameIsHide: true,
    modifyHeadHidden: true,
    // 管理员
    manageList:[],
    // 头像
    modifyHead: '',
    isModifyHead: false,
    // 用户
    userList: [],
    myHeader: null,
    manageSheet: [],
    userSheet: [],
    actionSheetManage: true,
    actionSheetUser: true,
    // 获取点击时成员的IDID
    currentUserId: '',
    infoTips: '',
    toastHidden: true,
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '群资料'
    });
  },
  // 用户头，用户备注，组昵称
  requestModify: function (modifyKey, modifyName) {
    app.fetchApi(app.globalData.HOST_URI+'/userInfo/update',{
      groupId: this.data.groupId,
      key: modifyKey,
      userId: app.globalData.userId,
      value: encodeURI(modifyName)
    },function (err,data) {
      if (data.code == 200) {
        that.setData({
          toastHidden:false,
          infoTips: '操作成功',
        });
      }
    })
    // wx.request({
    //   url: app.globalData.HOST_URI+'/userInfo/update',
    //   data: {
    //     groupId: this.data.groupId,
    //     key: modifyKey,
    //     userId: app.globalData.userId,
    //     value: encodeURI(modifyName)
    //   },
    //   success: function (res) {
    //     var data = res.data;
    //   },
    // })
  },
  // 组名称的ajax
  requestName: function (groupName) {
    var that = this;
    app.fetchApi(app.globalData.HOST_URI+'/group/change',{
      groupId: this.data.groupId,
      groupName: encodeURI(groupName),
      userId: app.globalData.userId,
    },function (err,data) {
      if (data.code == 200) {
        that.setData({
          toastHidden:false,
          infoTips: '操作成功',
        });
      }
    })
  },
  // 组名称
  modifyNameConfir: function () {
    var modifName = this.data.modifyName;
    
    if (!modifName.length) {
      this.setData({
        modifyName: this.data.searchId.groupName
      })
    }
    this.requestName(this.data.modifyName);
    this.setData({
      isNameHide: true,
      modifyNameIsHide: false,
      modifyNameHidden: true,
    });
  },
  modifyNameCancle: function () {
    this.setData({
      modifyNameHidden: true,
    })
  },
  // 备注
  modifyRemarkConfir: function () {
    var mRemark = this.data.modifyRemark;

    if (!mRemark.length) {
      this.setData({
        modifyRemark: this.data.searchId.groupRemark
      });
    }

    this.requestModify('groupremark',this.data.modifyRemark);
    this.setData({
      isRemarkHide: true,
      modifyRemarkIsHide: false,
      modifyRemarkHidden: true,
    })
  },
  modifyRemarkCancle: function () {
    this.setData({
      modifyRemarkHidden: true,
    })
  },
  // 昵称
  modifyNikNameConfir: function () {
    var modifNickName = this.data.modifyNickName;
    if (!modifNickName.length) {
      this.setData({
        modifyNickName: app.globalData.myNickName,
      });
    }
    this.requestModify('username',this.data.modifyNickName);
    this.setData({
      isNicknameHide: true,
      modifyNickNameIsHide: false,
      modifyNikNameHidden: true,
    })
  },
  modifyNikNameCancle: function () {
    this.setData({
      modifyNikNameHidden: true,
    })
  },
  // 头像
  modifyHeadConfir: function () {
    var modifHead = this.data.modifyHead;
    if (!modifHead.length) {
      this.setData({
        modifyHead: this.data.searchId.userHead,
      });
    }
    this.requestModify('userhead',this.data.modifyHead);
    this.setData({
      modifyHeadHidden: true,
    })
  },
  modifyHeadCancle: function () {
    this.setData({
      modifyHeadHidden: true,
    })
  },

  handleName: function () {
    if (this.data.createGroup == 'show') {
      this.setData({
        modifyNameHidden: false,
      });
    } else {
      return;
    }
  },
  handleRemark: function () {
    this.setData({
      modifyRemarkHidden: false,
    });
  },
  handleNickname: function () {
    this.setData({
      modifyNikNameHidden: false,
    })
  },
  handleHead: function () {
    this.setData({
      modifyHeadHidden: false,
    })
  },
  // 输入时
  modifyName: function (e) {
    this.setData({
      modifyName: e.detail.value,
    })
  },
  modifyRemark: function (e) {
    this.setData({
      modifyRemark: e.detail.value,
    })
  },
  modifyNikName: function (e) {
    this.setData({
      modifyNickName: e.detail.value,
    })
  },
  // 修改头像
  modifyHead: function () {
    var that = this;
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths; 
        console.log(res)
        that.setData({
          modifyHead: tempFilePaths,
          isModifyHead: true,
        })
      }
    })
  },
  //   先调用类似搜索的，
  requestSearch: function (groupId) {
    var that = this;
    app.fetchApi(app.globalData.HOST_URI+'/user/usergroup',{
      groupId: groupId,
      userId: app.globalData.userId,
    },function (err,data) {
      if (data.code == 200) {
        var data = data.data;
        if (data.u.userHead == null) {
            data.u.userHead = app.globalData.userHead;
          }
        var changeData = {
          gmtCreate: data.g.gmtCreate,
          gmtModify: data.g.gmtModify,
          groupId: data.g.groupId,
          groupName: decodeURI(data.g.groupName),
          groupPostion: data.g.groupPostion,
          groupQrcode: data.g.groupQrcode,
          groupRemark: decodeURI(data.g.groupRemark),
          groupUserRemark: decodeURI(data.g.groupUserRemark),
          isDelete: data.g.isDelete,
          userHead: data.u.userHead,
        }
        that.setData({
          searchId: changeData,
        });
      }
    })
  },
  // 调用用户列表
  requestList: function (groupId) {
    var that = this;
    app.fetchApi(app.globalData.HOST_URI+'/user/userlist',{
      groupId: groupId,
    },function (err,data) {
      if (data.code == 200) {
        var data = data.data;
        var manageArr = [],
            userArr = [];
        console.log(data)
        data.map(function (item, index) {
          if (item.userHead == null) {
            item.userHead = app.globalData.userHead;
          }
          if (item.userPosition == 1) {
            manageArr.push(item);
          } else if (item.userPosition == 2) {
            userArr.push(item);
          }
        });

        that.setData({
          manageList: manageArr,
          userList: userArr,
        });
      }
    })
  },
  onLoad: function (options) {
    // 从参数中传了两次值，判断是否为创建的群组，是的话显示修改name的框  
    this.setData({
      createGroup: options.createGroup,
      manageGroup: options.manageGroup,
      userGroup: options.userGroup,
      myHeader: app.globalData.userInfo.avatarUrl,
      myNickName: app.globalData.userInfo.nickName,
    })

    var createGroup = this.data.createGroup;
    var manageGroup = this.data.manageGroup;
    var userGroup = this.data.userGroup;
    if (createGroup == 'show') {
      manageAction = [
        {
          name:'移交群主权限',
          id: 'Power'
        },
        {
          name:'移除管理员',
          id: 'moveMange'
        },
        {
          name: '移除群组',
          id: 'nodeGroup',
        }
      ];
      userAction = [
        {
          name:'移交群主权限',
          id: 'Power'
        },
        {
          name:'设置为管理员',
          id: 'setMange'
        },
        {
          name:'移除群租',
          id: 'moveGroup'
        },
        ];

      this.setData({
        manageSheet: manageAction,
        userSheet: userAction,
      })
    }
    if(manageGroup == 'show') {
      manageAction = [];
      userAction = [
        {
          name:'设置为管理员',
          id: 'moveMange'
        },
        {
          name:'移除群组',
          id: 'moveGroup'
        },
      ];

      this.setData({
        manageSheet: manageAction,
        userSheet: userAction,
      })
    }
    if(userGroup == 'show') {
      manageAction = [];
      userAction = [];

      this.setData({
        manageSheet: manageAction,
        userSheet: userAction,
      })
    }
    var that = this;
    this.setData({
      groupId: options.groupId,
    })
    if (options.groupId) {
      this.requestSearch(options.groupId);
      this.requestList(options.groupId);
    };
  },
  // 二维码页面
  handleCode: function () {
    var that = this;
    var groupId = this.data.searchId.groupId;
    var groupName = this.data.searchId.groupName;

    wx.navigateTo({
      url: '../codePic/codePic?groupId='+groupId+'&groupName='+groupName,
    })
  },

  // 后期还得判断是否为群主，管理员，成员
  // 点击管理员,
  handleManage: function (e) {
    var dataset = e.currentTarget.dataset;

    this.setData({
      actionSheetManage: false,
      currentUserId: dataset.userid,
    }) 
  },
  handleUser: function (e) {
    var dataset = e.currentTarget.dataset;

    this.setData({
      actionSheetUser: false,
      currentUserId: dataset.userid,
    })
  },
  // 点击取消
  actionSheetManage: function () {
    this.setData({
      actionSheetManage: true,
    })
  },
  actionSheetUser: function () {
    this.setData({
      actionSheetUser: true,
    })
  },
  // 移交群主权限 
  handlePower: function (e) {
    var that = this;
    this.setData({
      actionSheetUser: true,
      actionSheetManage: true,
    });

    app.fetchApi(app.globalData.HOST_URI+'/user/transfer',{
      groupId: this.data.groupId,
      userId: app.globalData.userId,
      newUserId: this.data.currentUserId,
    },function (err,data) {
      if (data.code == 200) {
        that.setData({
          toastHidden:false,
          infoTips: '操作成功',
        });
      }
    })
  },
  // 移除管理员 
  handlemoveMange: function (e) {
    var that = this;
    this.setData({
      actionSheetUser: true,
      actionSheetManage: true,
    });

    app.fetchApi(app.globalData.HOST_URI+'/user/admin/delete',{
      groupId: this.data.groupId,
      opUserId: app.globalData.userId,
      userId: this.data.currentUserId,
    },function (err,data) {
      if (data.code == 200) {
        that.setData({
          toastHidden:false,
          infoTips: '操作成功',
        });
      }
    })
  },
  // 移除群租
  handlenodeGroup: function (e) {
    var that = this;
    this.setData({
      actionSheetUser: true,
      actionSheetManage: true,
    });

    app.fetchApi(app.globalData.HOST_URI+'/group/delete',{
      groupId: this.data.groupId,
      opUserId: app.globalData.userId,
      userId: this.data.currentUserId,
    },function (err,data) {
      if (data.code == 200) {
        that.setData({
          toastHidden:false,
          infoTips: '操作成功',
        });
        setTimeout(function () {
          console.log(12);
        },500)
      }
    })
  },
  // 设置为管理员 
  handlensetMange: function (e) {
    var that = this;
    this.setData({
      actionSheetUser: true,
      actionSheetManage: true,
    })
    app.fetchApi(app.globalData.HOST_URI+'/user/admin/set',{
      groupId: this.data.groupId,
    },function (err,data) {
      if (data.code == 200) {
        that.setData({
          toastHidden:false,
          infoTips: '操作成功',
        });
      }
    })
  },
  handleToast: function () {
    this.setData({
      toastHidden: true,
    });
  }
}

Page(lookGroupInfo);