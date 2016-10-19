var app = getApp();

var searchId = {
  data: {
    myNickName: null,
    myHeader: null,
    searchId: null,
    createPerson: '创建者',
    managePerson: '管理员',
    groupPerson: '群组成员'
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '群资料'
    })
  },
  requestSearch: function (groupId) {
    var that = this;
    app.fetchApi(app.globalData.HOST_URI+'/group/search',{
      key: groupId,
    },function (err,data) {
      if (data.code == 200) {
        var data = data.data[0];
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
            searchId: changeData,
          });
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      groupId: options.groupId,
      myNickName: app.globalData.userInfo.nickName,
      myHeader: app.globalData.userInfo.avatarUrl,
    })
    if (options.groupId) {
      this.requestSearch(options.groupId);
    };
  },
  handleCode: function () {
    var groupId = this.data.searchId.groupId;
    var groupName = this.data.searchId.groupName;

    wx.navigateTo({
      url: '../codePic/codePic?groupId='+groupId+'&groupName='+groupName,
    })
  }
}

Page(searchId);