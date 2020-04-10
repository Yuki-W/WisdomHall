const app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    hasShop:false,
    shop:null,//店铺信息
    imgSrc:'../../../images/logo.png',
    tabs: ["全部", "审核中", "已完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function (options) {
    this.switchTab()
    this.getInfo()
  },
  
  getInfo(){
    let shops = app.globalData.shop
    let src;
    if(JSON.stringify(shops) !== "{}"){
      src = shops.logo
    }
    this.setData({
      hasShop:app.globalData.hasShop,
      shop:shops,
      imgSrc:`http://localhost:8080/upload/${src}`
    })
  },

  //页面跳转
  navigat(e){
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `../${type}/${type}`
    })
  },

  //选项卡切换
  switchTab() {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
})