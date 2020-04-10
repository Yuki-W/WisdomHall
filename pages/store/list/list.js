const upload = require('../../../utils/upload.js')
const app = getApp()
Page({
  data: {
    shop: null, //门店基础信息
    isShow: false, //有店铺且审核合格，显示true
    shopImg: '../../../images/logo.png', //门店主图
    // status:true,//店铺状态
  },

  onLoad: function (options) {
    let shop = app.globalData.shop;
    console.log(shop)
    this.setData({
      isShow: shop.flag,
      shop: shop,
      shopImg: `http://localhost:8080/upload/${shop.logo}`
    })
  },
  // 更换门店主图
  changeLogo(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        let tempFilePaths = result.tempFilePaths
        //修改门店主图信息
        upload("/shop/changeImg", tempFilePaths, {
          id: this.data.shop.id
        }).then(res => {
          let data = JSON.parse(res.data)
          console.log(data)
          if (data.flag) {
            this.setData({
              shopImg: tempFilePaths
            })
          } else {
            wx.showToast({
              title: '服务器错误',
              duration: 2000,
              icon: 'none'
            })
          }
        })
      }
    })
  },
  handle(e) {
    let type = e.currentTarget.dataset.type
    let url
    switch (type) {
      case 'table':
        url = `../table/table?shopId=${this.data.shop.id}`
        break;
      case 'basicInfo':
        url = `../basicInfo/basicInfo`
        break;
      case 'storeDetail':
        url = `../storeDetail/storeDetail?shop=${JSON.stringify(this.data.shop)}`
        break;
      case 'foodSet':
        url = `../foodSet/foodSet?shopId=${this.data.shop.id}`
        break;
    }
    wx.navigateTo({
      url: url
    })
  }
})