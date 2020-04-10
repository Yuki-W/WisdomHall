const fetch = require('../../../utils/fetch.js')
Page({
  data: {
    shopId: 0, //门店编号
    clssData: null,
    listData: null, //包含子列表的分类
    activeIndex: 0, //当前选中的菜单分类
    scrollTop:100,
    toView:'a1'
  },
  // 左侧菜单项选择
  selectMenu(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeIndex: index,
      toView: `a${index}`
    })
  },
  onLoad: function (options) {
    this.setData({
      shopId: options.shopId
    })
  },
  onShow() {
    this.selectClass()
    this.selectAll()
  },
  selectAll() {
    fetch(`/food/findFoodInfo?id=${this.data.shopId}`).then(res => {
      console.log(res)
      if (res.data.flag) {
        this.setData({
          listData: res.data.message
        })
      }
    })
  },
  selectClass() {
    fetch(`/food/findClass?id=${this.data.shopId}`).then(res => {
      this.setData({
        clssData: res.data.message
      })
    })
  },
  handle(e) {
    let type = e.currentTarget.dataset.type
    let url = '';
    if (type === 'classfic') {
      url = `./classfic/classfic?id=${this.data.shopId}`
    } else {
      url = `./newFood/newFood?id=${this.data.shopId}`
    }
    wx.navigateTo({
      url: url
    })
  }
})