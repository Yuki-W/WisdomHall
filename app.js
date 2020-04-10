const fetch = require("utils/fetch.js")
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // 检测用户以前是否登录过
    this.checkLogin(res => {
      console.log('检验之前是否曾登录：', res.is_login)
      // 记录一个登录标识is_login
      this.globalData.is_login = res.is_login
      if(!res.is_login){
        wx.reLaunch({
          url: 'pages/subPages/login/login'
        })
      }else{
        console.log(`全局tel：${this.globalData.tel}`)
      }
    })
  },

  //判断 tel 是否存在;若存在，则请求服务器，判断 tel 是否有效
  checkLogin(callback) {
    var tel = this.globalData.tel
    if (!tel) {
      //从数据缓存中取 token 
      tel = wx.getStorageSync('tel')
      console.log(`从数据缓存中取出的tel：${tel}`)
      if (tel) {
        this.globalData.tel = tel
      } else {
        callback({
          is_login: false
        })
        return
      }
    }
    fetch('/store/checkLogin',JSON.stringify({tel:tel}),"post").then(res =>{
      console.log(res)
      callback({
        is_login: res.data.flag
      })
    })
  },

  

  globalData: {
    userInfo: null, //用户信息
    tel: null, //保存手机号
    is_login:false,  //是否登录标识
    hasShop:false,//店铺存在标识
    shop:null,//店铺信息
    // api:"http://192.168.0.196:8080"
  }
})
