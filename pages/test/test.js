const upload = require('../../utils/upload.js')
Page({
  data: {
    files: [],
    url:'',
  },
  onShow(){
    // let logo = wx.getStorageSync('logo')
    // this.setData({logo:logo})
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // that.setData({
        //   files: that.data.files.concat(res.tempFilePaths)
        // });
        let tempFilePaths = res.tempFilePaths
        upload("/shop/uploadImg",tempFilePaths).then(res=>{
          let data = JSON.parse(res.data)
          console.log(data)
          that.setData({
            // url:`../../upload/${data.message}`
            url:`http://172.20.10.7:8080/upload/${data.message}`
          })
        })
        // wx.uploadFile({
        //   url: 'http://172.20.10.7:8080/DianCan/shop/uploadImg',
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData: {
        //     'user':'test'
        //   },
        //   success: (result) => {
        //     let data = result.data
        //     console.log(data)
        //     that.setData({
        //       url:data
        //     })
        //     wx.setStorageSync('logo', data)
        //   },
        //   fail: (res) => {
        //     console.log(res)
        //   }
        // })
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  }
});