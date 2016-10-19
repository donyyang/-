var app = getApp();

var publishInfo = {
  data: {},
  handleAdd: function () {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
         var tempFilePaths = res.tempFilePaths; 
         console.log(tempFilePaths)
      }
    });
  },
}

Page(publishInfo);