var app = getApp();
var dataList = [];

var infoList = {
  data: {
    checkInfo: "查看详情",
    // 总共的list
    articleDatas: [],
    // 每次请求的list
    eachData: [],
    loadHidden: true,
    page: 1,
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
    this.requestList(this.data.page);
  },
  // 转换日期
  changeDate: function (date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds();

    return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute].map(this.formatNumber).join(':')
  },
  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n;
  },
  // 转换已读未读
  changeRead: function (isRead) {
    var changeIsRead;
    if(isRead == 0) {
      changeIsRead = '未读';
    } else if (isRead == 1) {
      changeIsRead = '已读';
    }
    return changeIsRead;
  },
  requestList: function (page) {
    var that = this;
    app.fetchApi(app.globalData.HOST_URI+'/msg/list',{
      cpage: page,
      pagesize: 5,
      userId: app.globalData.userId,
    },function (err,data) {
      if (data.code == 200) {
        console.log(211)
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
        });
        
        that.setData({
          articleDatas: dataList,
          loadHidden: true,
          eachData: data,
        });
      }
    })
  },
  onLoad: function () {
    var that = this;
    this.requestList(1);
  },
  handleDetial: function (e) {
    console.log(e)
    var that = this;
    var dataset = e.currentTarget.dataset;
    app.globalData.singledata = dataset;  
   
    if(dataset.isread == "未读") {
      app.fetchApi(app.globalData.HOST_URI+'/msg/marking',{
        groupId: dataset.groupid,
        msgId: dataset.msgid,
        userId: this.data.currentUserId,
      },function (err,data) {
        
      })

      // wx.request({
      //   url: app.globalData.HOST_URI+'/msg/marking',
      //   data: {
      //     groupId: dataset.groupid,
      //     msgId: dataset.msgid,
      //     userId: "u001"
      //   },
      //   success: function (res) {
      //     var data = res.data;
      //   }
      // })
    }

    this.data.articleDatas.map(function (item, index) {
      if(item.msgId == dataset.msgid && item.isRead == "未读") {
        item.isRead = "已读";
      }
    })
    
    this.setData({
      articleDatas: this.data.articleDatas,
    });
    wx.navigateTo({
      url: '../articleLists/articleLists'
    });
  },
}

Page(infoList);