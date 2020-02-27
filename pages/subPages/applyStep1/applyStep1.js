const upload = require('../../../utils/upload.js')
Page({
  data: {
    tel: '', //商家注册手机号
    marjor: null, //主营
    minor: null, //次营
    location: null, //门店地址
    logo: [], //门脸图
    eneviro: [], //店内环境图
    code: "", //门牌号
    person: "", //联系人姓名
    shopName: "", //门店牌匾名称
    clearInput: "", //清空名字输入框内容
    index: 0, //显示示例图的索引
    isShow: false, //弹出框显示
    toastTitle: ["·需拍出完整门匾、门框（建议正对门店2米处拍摄）", "·需真实反应用餐环境（收银台、用餐桌椅等）"],
    toastImg: ['https://shadow.elemecdn.com/lib/kd-resource@0.1.0/door-pic.jpeg', 'https://shadow.elemecdn.com/lib/kd-resource@0.1.0/indoor-pic.jpeg']
  },
  getInfos() {
    let marjor = wx.getStorageSync('marjor') || {}
    let minor = wx.getStorageSync('minor') || {}
    let tel = wx.getStorageSync('tel') || ""
    let locate = wx.getStorageSync('address') || {}
    let logo = wx.getStorageSync('logo') || []
    let eneviro = wx.getStorageSync('eneviro') || []
    let code = wx.getStorageSync('code') || ""
    let shopName = wx.getStorageSync('shopName') || ""
    let person = wx.getStorageSync('person') || ""
    if (Object.keys(locate).length !== 0) { //缓存中有地址信息
      // console.log(locate.address)
      this.setData({
        location: locate
      })
    }
    if (JSON.stringify(marjor) !== "{}") {
      // console.log(`主营：${marjor.type}`)
      this.setData({
        marjor: marjor.type
      })
    } else {
      this.setData({
        marjor: null
      })
    }
    if (JSON.stringify(minor) !== "{}") {
      // console.log(`次营：${minor.type}`)
      this.setData({
        minor: minor.type
      })
    } else {
      this.setData({
        minor: null
      })
    }
    if (tel.length > 0) {
      this.setData({
        tel: tel
      })
    }
    if (logo.length> 0) {
      this.setData({
        logo: logo
      })
    }
    if (eneviro.length > 0) {
      this.setData({
        eneviro: eneviro
      })
    }
    if (code.length > 0) {
      // console.log(code)
      this.setData({
        code: code
      })
    }
    if (shopName.length > 0) {
      this.setData({
        shopName: shopName
      })
    }
    if (person.length > 0) {
      this.setData({
        person: person
      })
    }
  },
  onShow() {
    this.getInfos()
  },

  handle(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    switch (type) {
      case "category":
        wx.navigateTo({
          url: '../category/category'
        })
        break;
      case "address":
        var url;
        if (this.data.location) {

          url = `../address/address?longitude=${this.data.location.longitude}&latitude=${this.data.location.latitude}`
        } else {
          url = `../address/address`
        }
        wx.navigateTo({
          url: url
        })
        break;
      case "logo":
        this.imgFiles(type)
        break;
      case "eneviro":
        this.imgFiles(type)
        break;
      case "code":
        this.setData({
          code: e.detail.value
        })
        wx.setStorageSync('code', e.detail.value)
        break;
      case "shopName":
        this.setData({
          shopName: e.detail.value
        })
        wx.setStorageSync('shopName', e.detail.value)
        break;
      case "person":
        let value = e.detail.value
        let nameReg = /^[\u4E00-\u9FA5]{2,4}$/;
        if (nameReg.test(value)) { //姓名校验通过
          this.setData({
            person: e.detail.value
          })
          wx.setStorageSync('person', e.detail.value)
        } else {
          this.setData({
            person: ""
          })
          wx.showModal({
            title: '提示',
            content: '输入错误，至少包含2-4个中文字符',
            confirmText: '确定',
            showCancel: false,
            success: res => {
              this.setData({
                clearInput: ""
              })
              wx.removeStorageSync('person')
            }
          })
        }
        break;
    }
  },
  
  //获取图片
  imgFiles(key) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        upload("/shop/uploadImg",tempFilePaths).then(res=>{
          let data = JSON.parse(res.data)
          // 获取服务器上传图片路径
          let uploadSrc = data.message
          if(key === "logo"){
            that.setData({
              logo:that.data.logo.concat(tempFilePaths)
            })
          }else{
            that.setData({
              eneviro:that.data.eneviro.concat(tempFilePaths)
            })
          }
          wx.setStorageSync(`upload${key}`, uploadSrc)
          wx.setStorageSync(key, tempFilePaths)
        })

      }
    })
  },

  //图片预览
  previewImage: function (e) {
    let type = e.currentTarget.dataset.type
    if (type === 'logo') {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.logo // 需要预览的图片http链接列表
      })
    } else {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.eneviro // 需要预览的图片http链接列表
      })
    }
  },

  //删除图片
  clear(e){
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
          if(type === "logo"){
            this.setData({logo:[]})
          }else{
            this.setData({eneviro:[]})
          }
        }
      }
    })
  },

  // 下一步按钮
  next() {
    // 提交前检测内容是否填写完善
    if (!this.data.marjor) {
      wx.showToast({
        title: '请先选择经营品类',
        duration: 2000,
        icon: 'none'
      })
    } else if (!this.data.location) {
      wx.showToast({
        title: '请选择店铺地址',
        duration: 2000,
        icon: 'none'
      })
    } else if (this.data.logo.length === 0) {
      wx.showToast({
        title: '请上传门脸图照片',
        duration: 2000,
        icon: 'none'
      })
    } else if (this.data.shopName.length === 0) {
      wx.showToast({
        title: '请填写门店牌匾名称',
        duration: 2000,
        icon: 'none'
      })
    } else if (this.data.eneviro.length === 0) {
      wx.showToast({
        title: '请上传店内环境图',
        duration: 2000,
        icon: 'none'
      })
    } else if (this.data.person.length === 0) {
      wx.showToast({
        title: '请填写联系人姓名',
        duration: 2000,
        icon: 'none'
      })
    } else { //全部通过
      wx.navigateTo({
        url: '../applyStep2/applyStep2'
      })
    }
  },

  // 示例图弹窗层
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