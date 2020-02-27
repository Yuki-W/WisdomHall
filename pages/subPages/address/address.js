// 引入SDK核心类
const QQMapWX = require('../../../utils/qqmap-wx-jssdk');
const qqmap = new QQMapWX({
  key: 'FKJBZ-NKMCO-QLJWL-SKGET-O5YQ7-GKFME' // 必填
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:null,  //纬度
    longitude:null, //经度 
    scale:'18',//缩放
    mapw:'100%',//地图宽度
    maph:'0',//地图高度
    mapCtx:null,
    address:'', // 地址信息
    location:null,//地址信息经纬度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options || {})
    // 获取窗口的宽度和高度
    wx.getSystemInfo({
      success: (res) => {
        // var mapw = res.windowWidth  //宽度
        var maph = res.windowHeight //高度
        this.setData({
          maph:`${maph*0.8}px`
        })
      },
    })
    var option = options || {}
    if(Object.keys(option).length !== 0){
      this.setData({
        longitude:option.longitude,
        latitude:option.latitude
      })
    }else{
      this.getLocate()
    }
  },

  getLocate(){
    // 获取用户地理位置授权
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
      },
      fail: (res) => {
        wx.showModal({
          title: '提示',
          content: '定位功能需要授权地理定位选项',
          confirmText: '去授权',
          showCancel: false,
          success: (res) => {
            if(res.confirm){
              wx.openSetting({
                success: (res) => {
                  if(res.authSetting['scope.scope.userLocation']){
                    console.log('授权成功')
                    console.log(res)
                  }
                },
              })
            }
          }
        })
      },
    })
  },
  onShow(){
    if(!(this.data.longitude&&this.data.latitude)){
      // 当经纬度都没值时请求获取定位
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.setData({
            latitude:res.latitude,
            longitude:res.longitude
          })
          this.getAddress(res)
        },
      })
    }
  },

  // 视野变化获取中心点坐标
  regionChange(e){
    let that = this
    this.mapCtx = wx.createMapContext('map')
    if(e.type === 'end'){
      this.mapCtx.getCenterLocation({
        success:res => {
          // console.log(res)
          that.getAddress(res)
        }
      })
    }
  },

  //逆地址解析
  getAddress(res){
    let that = this
    qqmap.reverseGeocoder({
      location:{
        latitude:res.latitude,
        longitude:res.longitude
      },
      success: res => {
        console.log(res)
        that.setData({
          address:res.result.address,
          location:res.result.location
        })
      }
    })
  },
  // 确定地址
  submit(){
    let that = this
    if(this.location !== null){
      wx.setStorageSync('address', {
          longitude:that.data.location.lng,
          latitude:that.data.location.lat,
          address:that.data.address
      })
      wx.navigateBack()
    }
  }
})