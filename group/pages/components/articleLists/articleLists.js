// var util = require('../../utils/util.js');
var app = getApp();
var articleLists = {
  data: {
    singleData: null,
    unRead: "未读",
    unReadData: []
  },
  onLoad: function () {
    this.setData({
      singleData: app.globalData.singledata
    })
  },
  // 点击未读调用ajax
  handleUnRead: function () {
    var dataset = this.data.singleData,
        that = this;

    app.fetchApi(app.globalData.HOST_URI+"/msg/readuser",{
      msgId: dataset.msgid
    },function (err,data) {
      if (data.code == 200) {
        var data = data.data;
        data.map(function (item, index) {
          if(!item.userHead) {
            item.userHead = app.globalData.userHead;
          }
        })

        that.setData({
          unReadData: data
        });
      }
    })
    // wx.request({
    //   url: app.globalData.HOST_URI+"/msg/readuser",
    //   data: {
    //     msgId: dataset.msgid
    //   },
    //   success: function (res) {
    //     var data = res.data.data;
    //     data.map(function (item, index) {
    //       if(!item.userHead) {
    //         item.userHead = app.globalData.userHead;
    //       }
    //     })

    //     that.setData({
    //       unReadData: data
    //     });
    //   }
    // })
  },
}

Page(articleLists);