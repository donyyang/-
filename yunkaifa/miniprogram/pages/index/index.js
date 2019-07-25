//index.js
const app = getApp()
let newAllLists = [];

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    
    defaultSize: "default",
    productList: [],
    allList: [],
    searchVal: "",
    widowHeight: `${wx.getSystemInfoSync().windowHeight-110}px`,
    pageNum: 0,
    pageSize: 10,
    isMore: true,
    tips: "正在加载",
    actions: [
      {
        name: '删除',
        color: '#fff',
        fontsize: '20',
        width: 100,
        // icon: 'delete',
        background: '#ed3f14'
      },
      {
        name: '修改',
        color: '#fff',
        fontsize: '20',
        width: 100,
        // icon: 'delete',
        background: '#19be6b'
      },
    ]
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '产品列表',
      path: '/index/index'
    }
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      });
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    // 得到产品列表
    this.getProductList();
  },

  handleVal(e) {
    this.setData({
      searchVal: e.detail.value,
    })
  },

  handleSearch() {
    let newArr = [], allArr = [];
    const { productList, searchVal, allList } = this.data;
    allList.map((item, index) => {
      allArr.push(item._id);
      if (item.productName.indexOf(searchVal) != -1 ) {
        newArr.push(item._id);
      }
    })

    if (searchVal.length === 0) {
      newArr = allArr;
    }
    console.log("allArr", newArr);
    const db = wx.cloud.database();
    const _ = db.command;
    // 查询当前用户所有的 counters
    db.collection('productList').where({
      _id: _.in(newArr)
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        this.setData({
          productList: res.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  getProductList() {
    const db = wx.cloud.database();
    let { pageNum, pageSize } = this.data;

    if (pageNum === 0) {
      db.collection('productList')
        .limit(pageSize)
        .get().then(res => {
          console.log(res.data);
          this.setData({
            productList: res.data,
            allList: res.data,
          })
          newAllLists = res.data;
          if (res.data.length < pageSize) {
            this.setData({
              isMore: false,
              tips: "暂无数据"
            })
          }
        })
    } else {
      db.collection('productList')
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .get().then(res => {
          console.log(res.data);
          newAllLists = newAllLists.concat(res.data);
          this.setData({
            productList: newAllLists,
            allList: newAllLists
          })
          if (res.data.length < pageSize) {
            this.setData({
              isMore: false,
              tips: "暂无数据"
            })
          }
        })
    }
  },
  // 删除产品
  handlerDeletePro(item, e) {
    let index = item.detail.index;
    
    let newList = [], that = this;
    let currentItem = null;
    const { productList } = this.data;
    productList.map((nav, index) => {
      if (nav._id === item.target.id) {
        currentItem = nav;
      } else {
        newList.push(nav);
      }
    })
    if (item.detail.index === 0) {
    const db = wx.cloud.database();
    // 必须删除的是_id
    db.collection('productList').doc(currentItem._id).remove()
      .then(() => {
        wx.showToast({
          title: '删除成功',
        });
        this.setData({
          productList: newList
        })
      })
      .catch(() => {
        wx.showToast({
          title: '删除失败',
        })
      })
    } else if (index === 1) {
      let name = currentItem.productName;
      let id = currentItem._id;
      let num = currentItem.productNum;
      
      wx.navigateTo({
        url: `../addProduct/addProduct?id=${id}&name=${name}&num=${num}`,
      })
    }
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  handleLink () {
    wx.navigateTo({
      url: '../addProduct/addProduct',
    })
  },

  handleScroll(e) {
    let { pageNum, isMore } = this.data;
    this.setData({
      pageNum: ++pageNum
    })
    if (isMore) {
      this.getProductList();
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
