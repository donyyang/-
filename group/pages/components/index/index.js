//index.js
//获取应用实例
var app = getApp()
var myGroup = {
  data: {
    creatGroup: '创建／加入群组',
    groupTitle: '我创建的群组',
    // 我的群的data
    groupData: [],
    myGroup: [],
    manageGroup: [],
    addGroup: [],
    manageGroupTitle: '我管理的群',
    addGroupTitle: '我加入的群',
    // 传到全局中去
    singledata: app.globalData.singledata,
    actionSheetHidden: true,
    actionSheetItems: app.globalData.items,
  },
  requestList: function () {
    var that = this;
    app.fetchApi(app.globalData.HOST_URI + '/group/list',{
      userId: app.globalData.userId,
    },function (err,data) {
      if (data.code == 200) {
        var data = data.data,
            mGroup = [],
            maGroup = [],
            aGroup = [];
        data.map(function (item, index) {
          // 解码
          var changeItem = {
            gmtCreate: item.gmtCreate,
            gmtModify: item.gmtModify,
            groupId: item.groupId,
            groupName: decodeURI(item.groupName),
            groupPostion: item.groupPostion,
            groupQrcode: item.groupQrcode,
            groupRemark: decodeURI(item.groupRemark),
            groupUserRemark: decodeURI(item.groupUserRemark),
            isDelete: item.isDelete,
          }
          if (changeItem.groupPostion == 0) {
            aGroup.push(changeItem);
          } else if (changeItem.groupPostion == 1) {
            mGroup.push(changeItem);
          } else {
            maGroup.push(changeItem);
          }
        })

        that.setData({
          myGroup: mGroup,
          manageGroup: maGroup,
          addGroup: aGroup
        });
      }
    })
  },
  onLoad: function () {
    this.requestList();
  },

  // 显示隐藏弹框
  createGroup: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  // 点击取消隐藏弹框
  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  
  // 创建的群，
  creatGroupVw: function (e) {
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../singleInfo/singleInfo?infoId='+dataset.id+'&createGroup=show',
    });
  },

  // 管理的群,点击会跳转
  manageGroupVw: function (e) {
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../singleInfo/singleInfo?infoId='+dataset.id+'&manageGroup=show',
    });
  },
  // 加入的群
  addGroupVw: function (e) {
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../singleInfo/singleInfo?infoId='+dataset.id+'userGroup=show'
    });
  },
};

// 点击弹框中的内容触发的事件
// for (var i = 0;i < app.globalData.items.length; ++i) {
//   (function (itemName) {
//     myGroup['bind' + itemName] = function (e) {
//       console.log('click' + itemName, e);
//     }
//   })(app.globalData.items[i]);
// }

Page(myGroup);