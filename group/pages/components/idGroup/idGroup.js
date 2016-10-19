var app = getApp();

var idGroup = {
  data: {
    groupId: '',
    modalCont: '请输入群组id',
    modalHidden: true,
  },
  modalConfir: function () {
    this.setData({
     modalHidden: true,
    })
  },
  modalCancle: function () {
    this.setData({
     modalHidden: true,
    })
  },
  // input输入值
  handleIpt: function (e) {
    this.setData({
      groupId: e.detail.value,
    })
  },
  // 点击查找
  handleSearch: function () {
    var searchGroupId = this.data.groupId;

    if (!searchGroupId.length) {
      this.setData({
        modalHidden: false,
      })
      return;
    }
     wx.navigateTo({
      url: '../searchId/searchId?groupId='+searchGroupId
    });
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '查找群组'
    })
  },
}

Page(idGroup);