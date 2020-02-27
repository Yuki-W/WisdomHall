const app = getApp()
const fetch = require('../../utils/fetch.js')
Page({
  data: {},
  onLoad: function (options) {
    this.getShopInfo();
  },

  //页面跳转
  navigat(e) {
    // console.log(e);
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `../subPages/${type}/${type}`
    })
  },

  // 查找店铺是否存在
  getShopInfo() {
    let tel = app.globalData.tel
    if (tel) {
      fetch("/shop/findShop", JSON.stringify({
        tel: tel
      }), 'post').then(res => {
        console.log(res)
        app.globalData.hasShop = res.data.flag
        app.globalData.shop = res.data.message
        // imgSrc:`http://172.20.10.7:8080/upload/${imgSrc}`
      })
    }
  },
})