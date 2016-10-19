var app = getApp();

var createGroup = {
  data: {
    iptName: '',
    iptRemark: '',
    // iptNickName: '',
    modalHidden: true,
    modalCont: '请输入群组名称',
    newGroup: []
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '创建群组'
    })
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
  handleName: function (e) {
    this.setData({
      iptName: e.detail.value,
    });
  },
  handleRemRemark: function (e) {
    this.setData({
      iptRemark: e.detail.value,
    });
  },
  // handleNickName: function (e) {
  //   this.setData({
  //     iptNickName: e.detail.value,
  //   });
  // },
  handleNext: function () {
    var groupName = this.data.iptName;
    var iptRemark = this.data.iptRemark;

    if (!groupName.length) {
      this.setData({
        modalHidden: false,
      })
      return;
    }    
    wx.redirectTo({
      url: '../groupInfo/groupInfo?groupName='+groupName+'&groupRemark='+iptRemark+''
    });
  },
}
Page(createGroup);