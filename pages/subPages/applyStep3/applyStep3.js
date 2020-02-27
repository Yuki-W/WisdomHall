const fetch = require('../../../utils/fetch.js')
const upload = require('../../../utils/upload.js')
Page({
  data: {
    phone: '', //用于注册成功后，重新写入缓存的账号
    business: [], //营业执照
    licence: [], //许可证
    index: 0, //显示示例图的索引
    isShow: false, //弹出框显示
    toastTitle: "·照片方向正确，不能颠倒\n·需文字清晰、边框完整、露出国徽\n·复印件需加盖印章",
    toastImg: ['https://s3plus.meituan.net/v1/mss_6b7c26b3db4c4bbebdbb4d7a9bb76633/images/info_prompt/st05.jpg', 'https://s3plus.meituan.net/v1/mss_6b7c26b3db4c4bbebdbb4d7a9bb76633/images/info_prompt/st06.jpg']
  },
  onShow() {
    this.getInfos()
  },
  getInfos() {
    let bus = wx.getStorageSync('business') || {}
    let lic = wx.getStorageSync('licence') || {}
    if (bus.length > 0) {
      this.setData({
        business: bus
      })
    }
    if (lic.length > 0) {
      this.setData({
        licence: lic
      })
    }
  },
  chooseImage: function (key) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        upload("/shop/uploadImg", tempFilePaths).then(res => {
          let data = JSON.parse(res.data)
          let uploadSrc = data.message
          if (key === 'business') {
            that.setData({
              business: that.data.business.concat(tempFilePaths)
            });
          } else {
            that.setData({
              licence: that.data.licence.concat(tempFilePaths)
            })
          }
          wx.setStorageSync(`upload${key}`, uploadSrc)
          wx.setStorageSync(key, tempFilePaths)
        })
      }
    })
  },
  previewImage: function (e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    if (type === 'business') {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.business // 需要预览的图片http链接列表
      })
    } else {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.licence // 需要预览的图片http链接列表
      })
    }
  },
  handle(e) {
    let type = e.currentTarget.dataset.type
    this.chooseImage(type)
  },
  // 清除上传图片
  reUpload(e) {
    let type = e.currentTarget.dataset.type
    wx.showModal({
      content: '是否要删除图片',
      cancelText: '取消',
      confirmColor: '#07c160',
      confirmText: '确定',
      showCancel: true,
      success: (result) => {
        if(result.confirm){
          // 确认删除
          wx.removeStorageSync(type)
          wx.removeStorageSync(`upload${type}`)
          if(type === "business"){
            this.setData({business:[]})
          }else{
            this.setData({licence:[]})
          }
        }
      }
    })
  },
  // 提交
  submit() {
    if (this.data.business.length === 0) {
      wx.showToast({
        title: '营业执照未上传',
        duration: 2000,
        icon: 'none'
      })
    } else if (this.data.licence.length === 0) {
      wx.showToast({
        title: '许可证未上传',
        duration: 2000,
        icon: 'none'
      })
    } else {
      // 信息全部验证通过，发送给服务器进行处理
      let that = this
      wx.showLoading({
        title: '加载中'
      })
      let arr = new Array()
      let data = basicInfo()
      let cer = certific()
      let locate = handleMap()
      this.setData({
        phone: data.tel
      })
      arr.push(data)
      arr.push(cer)
      arr.push(locate)
      // console.log(arr)
      fetch("/shop/addRegister", arr, 'post').then(res => {
        wx.hideLoading()
        if (res.data.flag) {
          wx.showToast({
            title: '提交成功',
            duration: 2000,
            icon: 'success',
            // 提交成功后跳转
            success: function () {
              wx.clearStorageSync()
              wx.setStorageSync('tel', that.data.phone)
              setTimeout(() => {
                wx.reLaunch({
                  url: '../../index/index'
                })
              });
            }
          })
        }
      })
    }
  },
  show(e) {
    let i = e.currentTarget.dataset.item
    this.setData({
      index: i,
      isShow: true
    })
  },
  // 弹出框隐藏
  cancel() {
    this.setData({
      isShow: false
    })
  }
})

// 处理基本信息数据
function basicInfo() {
  let tel = wx.getStorageSync('tel')
  let person = wx.getStorageSync('person')
  let marjor = wx.getStorageSync('marjor').type
  let minor = wx.getStorageSync('minor') || {}
  let address = wx.getStorageSync('address').address
  let code = wx.getStorageSync('code') || ""
  let logo = wx.getStorageSync('uploadlogo')
  let shopName = wx.getStorageSync('shopName')
  let eneviro = wx.getStorageSync('uploadeneviro')
  return {
    tel: tel,
    person: person,
    marjor: marjor,
    minor: (JSON.stringify(minor) !== "{}" ? minor.type : ""),
    address: address,
    code: code,
    logo: logo,
    shopName: shopName,
    eneviro: eneviro
  }
}

// 处理实名制信息数据
function certific() {
  let tel = wx.getStorageSync('tel')
  let legalName = wx.getStorageSync('legalName')
  let idCard = wx.getStorageSync('idCard')
  let front = wx.getStorageSync('uploadfront')
  let back = wx.getStorageSync('uploadback')
  let business = wx.getStorageSync('uploadbusiness')
  let licence = wx.getStorageSync('uploadlicence')
  return {
    tel: tel,
    legalName: legalName,
    idCard: idCard,
    front: front,
    back: back,
    business: business,
    licence: licence
  }
}
// 处理店铺经纬度
function handleMap() {
  let tel = wx.getStorageSync('tel')
  let locate = wx.getStorageSync('address')
  return {
    tel: tel,
    latitude: locate.latitude,
    longitude: locate.longitude
  }
}