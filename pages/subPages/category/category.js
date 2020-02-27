const fetch = require('../../../utils/fetch.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["主营", "次营"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    windowWid: 0, //系统窗口宽度
    lists: null, //经营品类别数组
    curIndex: 0,  // 当前页选中项索引
    oldIndex:0,//前一页选中项索引
    isCurPage:true,//默认当前页为主营
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          windowWid: res.windowWidth,
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    wx.showLoading({
      title: '加载中'
    })
    //请求服务器数据
    fetch('/store/selAllCate').then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.data.flag) {
        this.setData({
          lists: res.data.message
        })
      } else {
        wx.showToast({
          title: '服务器错误',
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  onReady(){
    let marjorObj = wx.getStorageSync('marjor') || {}
    let minorObj = wx.getStorageSync('minor') || {}
    if(marjorObj){
      this.setData({
        curIndex:marjorObj.index
      })
    }
    if(minorObj){
      this.setData({
        oldIndex:minorObj.index
      })
    }
  },
  // 选项卡切换
  tabClick: function (e) {
    if(e.currentTarget.id !== this.data.activeIndex){
      // 两个值不相等，则说明选项卡被切换了
      this.setData({
        isCurPage:!this.data.isCurPage
      })
    }
    // console.log(this.data.isCurPage)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  // 选中事件
  selection(e) {
    // console.log(e)
    if(this.data.isCurPage){
      // 当前页
      this.setData({
        curIndex: e.currentTarget.dataset.index
      })
      wx.setStorageSync('marjor', {
        index:e.currentTarget.dataset.index,
        type:e.currentTarget.dataset.type
      })
    }else{
      this.setData({
        oldIndex: e.currentTarget.dataset.index
      })
      wx.setStorageSync('minor', {
        index:e.currentTarget.dataset.index,
        type:e.currentTarget.dataset.type
      })
    }
  },
  // 取消选中
  cancel() {
    if(this.data.isCurPage){
      this.setData({
        curIndex: 0,
        oldIndex:0
      })
      wx.removeStorageSync('marjor');
    }else{
      this.setData({
        oldIndex:0
      })
    }
    wx.removeStorageSync('minor');
  },
  // 提交事件
  submit(){
    if(this.data.curIndex === 0){
      wx.showToast({
        title: '请先选中主营类别后提交',
        duration: 2000,
        icon: 'none'
      })
    }else{
      wx.navigateBack()
    }
  }


  // swiper 滑块改变时触发的事件
  // bindchange(e){
  //   var windowWid = this.data.windowWid
  //   // 获取每一块的宽度
  //   var width = windowWid / this.data.tabs.length
  //   this.setData({
  //     // 滑动改变时，修改当前下标值
  //     activeIndex:e.detail.current,
  //     sliderOffset:e.detail.current * width 
  //   })
  // },
})