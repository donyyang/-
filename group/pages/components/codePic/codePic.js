var app = getApp();

var codePic = {
  data: {
    codePic: null,
    groupName: '',
  },
  // 二维码接口
  requestCode: function (groupId) {
    var that = this;
    app.fetchApi(app.globalData.HOST_URI + '/qr/create',{
      groupId: groupId,
    },function (err,data) {
      if (data.code == 200) {
        var data = data;
        that.setData({
          codePic: data
        })
      }
    })
  },
  onLoad: function (options) {
    var groupId = options.groupId;
    var groupName = options.groupName;

    this.setData({
      groupName: groupName,
    })
    console.log(123,groupName);
    this.requestCode(groupId);
  },
}

Page(codePic);