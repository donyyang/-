var app = getApp();
var dataList = [];

var single = {
  data: {
    singelTitle: '查看详情',
    publishInfo: '发布通知',
    singleGroupData: [],
    groupId: '',
    // 从url上的到参数，判断是否是创建的群，加入的群，还是管理的群
    createGroup: 'hide',
    manageGroup: 'hide',
    userGroup: 'hide',
    page: 1,
    loadHidden: true,
    eachData: [],
    isHidden: true,
  },
  bindscrolltoupper: function () {
    console.log(top);
  },
  bindscrolltolower: function () {
    var page = this.data.page,
        articleDatas = this.data.articleDatas,
        eachData = this.data.eachData;
    
    if (!eachData.length) {
      this.setData({
        isHidden: false
      })
      return;
    }

    this.setData({
      page: page + 1,
      loadHidden: false,
    })
    this.requestList(this.data.page, this.data.groupId);
  },
  // 转换日期
  changeDate: function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute].map(this.formatNumber).join(':')
  },
  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n;
  },
  changeRead: function (isRead) {
    var changeIsRead;
    if(isRead == 0) {
      changeIsRead = '未读';
    } else if (isRead == 1) {
      changeIsRead = '已读';
    }
    return changeIsRead;
  },
  requestList: function (page, infoId) {
    var that = this;
    app.fetchApi(app.globalData.HOST_URI + '/msg/group/list',{
      cpage: page,
      groupId: infoId,
      pagesize: 5,
      userId: app.globalData.userId,
    },function (err,data) {
      if (data.code == 200) {
        var data = data.data.content;
        data.map(function (item, index) {
          var createDate = that.changeDate(new Date(item.msgSendTime)),
              changeIsRead = that.changeRead(item.isRead);
          item.msgSendTime = createDate.slice(5,11);
          // 把gmtCreate转换为了msgSendTime,把gmtModify改为createDate
          item.gmtCreate = createDate.slice(0,11);
          item.gmtModify = createDate;
          item.isRead = changeIsRead;
          dataList.push(item);
        })
        that.setData({
          singleGroupData: dataList,
          loadHidden: true,
          eachData: data,
        });
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    // 创建
    if (options.createGroup && options.createGroup == 'show') {
      this.setData({
        createGroup: options.createGroup,
      })
    } else {
      this.setData({
        createGroup: 'hide',
      })
    }
    // 管理
    if (options.manageGroup && options.manageGroup == 'show') {
      this.setData({
        manageGroup: options.manageGroup,
      })
    } else {
      this.setData({
        manageGroup: 'hide',
      })
    }
    // 用户
    if (options.userGroup && options.userGroup == 'show') {
      this.setData({
        userGroup: options.userGroup,
      })
    } else {
      this.setData({
        userGroup: 'hide',
      })
    }
    this.setData({
      groupId: options.infoId,
    })
    this.requestList(1,options.infoId);
  },
  handleDetial: function (e) {
    var that = this;
    var dataset = e.currentTarget.dataset;
    app.globalData.singledata = dataset;  
   
    if(dataset.isread == "未读") {
      app.fetchApi(app.globalData.HOST_URI+'/msg/marking',{
        groupId: dataset.groupid,
        msgId: dataset.msgid,
        userId: app.globalData.userId,
      },function (err,data) {
        
      })

      // wx.request({
      //   url: app.globalData.HOST_URI+'/msg/marking',
      //   data: {
      //     groupId: dataset.groupid,
      //     msgId: dataset.msgid,
      //     userId: app.globalData.userId,
      //   },
      //   success: function (res) {
      //     var data = res.data;
      //   }
      // })
    }

    this.data.singleGroupData.map(function (item, index) {
      if(item.msgId == dataset.msgid && item.isRead == "未读") {
        item.isRead = "已读";
      }
    })
    
    this.setData({
      singleGroupData: this.data.singleGroupData,
    });
    wx.navigateTo({
      url: '../../components/articleLists/articleLists',
    })
  },
  // 查看群资料
  handleData: function () {
    var groupId = this.data.groupId;
    var createGroup = this.data.createGroup;
    var manageGroup = this.data.manageGroup;
    var userGroup = this.data.userGroup;
    
    if (createGroup == 'show') {
      wx.redirectTo({
        url: '../lookGroupInfo/lookGroupInfo?groupId='+groupId+'&createGroup='+createGroup,
      })
    }
    if (manageGroup == 'show') {
      wx.redirectTo({
        url: '../lookGroupInfo/lookGroupInfo?groupId='+groupId+'&manageGroup='+manageGroup,
      })
    }
    if (userGroup == 'show') {
      wx.redirectTo({
        url: '../lookGroupInfo/lookGroupInfo?groupId='+groupId+'&userGroup='+userGroup,
      })
    }
  },
  // 发布通知
  handlePublish: function () {
    wx.navigator({
      url: '../publishInfo/publishInfo',
    })
  },
}
Page(single);