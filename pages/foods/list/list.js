const app = getApp()
Page({

  data: {
    shop:null,//门店基础信息
    isShow:false,//有店铺且审核合格，显示true
    status:true,//店铺状态
  },

  onLoad: function (options) {

    let shop = app.globalData.shop;
    console.log(shop)
    this.setData({
      isShow : shop.flag,
      shop:shop
    })
  },
})