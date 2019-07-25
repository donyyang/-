let newOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proName: "",
    proNum: "",
    id: "",
    isModify: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    newOptions = options;

    if (options && options.id) {
      this.setData({
        proName: options.name,
        proNum: options.num,
        id: options.id,
        isModify: true
      })
    }

    this.getProductList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  handleCount (e) {
    console.log(e)
    this.setData({
      proNum: e.detail.value
    })
  },
  handleName (e) {
    this.setData({
      proName: e.detail.value
    })
  },
  getProductList() {
    const db = wx.cloud.database();
    db.collection('productList').get().then(res => {
      console.log(res.data);
      this.setData({
        productList: res.data,
      })
    })
  },
  handleConfirm() {
    let { proName, proNum, isModify, productList, id } = this.data;
    if (proName.length === 0 || proNum.length === 0) {
      wx.showToast({
        title: '不能为空哦～',
      })
      return;
    }
    const db = wx.cloud.database();
    if (isModify) {
      let currentItem =  productList.find((item, index) => {
        return item._id = id;
      })
      // 更新的是id
      db.collection('productList').doc(currentItem._id).update({
        data: {
          productName: proName,
          productNum: proNum
        },
        success: res => {
          wx.showToast({
            title: '更新成功',
          });
          wx.redirectTo({
            url: '../index/index',
          })
        },
        fail: err => {
          icon: 'none',
            console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    } else {
      db.collection('productList').add({
        data: {
          productName: proName,
          productNum: proNum
        },  
        success: res => {
          wx.showToast({
            title: '新增记录成功',
          });
          wx.redirectTo({
            url: '../index/index',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})