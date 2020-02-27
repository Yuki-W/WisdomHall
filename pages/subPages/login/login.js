const fetch = require('../../../utils/fetch.js')

Page({
  
  data: {
    btnInfo: '获取验证码',
    phone: '', //输入框手机号
    // code: '', //输入框验证码
    is_sendCode: false, //默认没有发送过验证码
    randomCode: '', //生成的验证码
    testPhone: '' //存储获取验证码时的手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取文本框输入数据
  handleInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 获取验证码
  handleBtn() {
    if (!this.data.is_sendCode) {
      let is_phone = checkInput(this.data.phone, "phone")
      if (is_phone) {
        wx.showLoading({
          title: '获取中'
        })
        this.data.randomCode = random(6)
        console.log(this.data.randomCode)
        this.setData({
          testPhone: this.data.phone
        })
        setTimeout(() => {
          wx.hideLoading()
          wx.showModal({
            title: '验证码',
            content: this.data.randomCode,
            confirmText: '确定',
            showCancel: false,
            fail: (res) => {
              wx.showLoading({
                title: '验证码发送失败'
              })
            },
            complete: (res) => {
              wx.hideLoading()
            }
          })
          countDown(this, 60)
        }, 1000);
      } else {
        wx.showToast({
          title: '手机号输入不正确',
          icon: 'none',
          duration: 1000,
        })
      }
    } else {
      // 验证码已发送过
      wx.showToast({
        title: '验证码已发送，请勿重复点击',
        duration: 2000,
        icon: 'none'
      })
    }
  },

  //表单登录
  formSubmit(e) {
    console.log(e)
    let is_phone = checkInput(e.detail.value.phone, "phone")
    let is_code = checkInput(e.detail.value.code, "code")
    if (!is_phone) {
      wx.showToast({
        title: '手机号输入有误',
        duration: 2000,
        icon: 'none'
      })
    } else if (!is_code) {
      wx.showToast({
        title: '验证码输入有误',
        duration: 2000,
        icon: 'none'
      })
    } else if (e.detail.value.code !== this.data.randomCode) {
      wx.showToast({
        title: '验证码错误',
        duration: 2000,
        icon: 'none'
      })
    } else if (this.data.testPhone !== e.detail.value.phone) {
      wx.showToast({
        title: '手机号发生错误改变',
        duration: 2000,
        icon: 'none'
      })
    } else {
      // 提示授权用户信息
      // 验证成功发送给服务器
      fetch('/store/login', e.detail.value).then(res => {
        if (res.data.flag) {
          wx.setStorage({
            key: 'tel',
            data: e.detail.value.phone,
          })
          wx.showToast({
            title: '登录成功',
            duration: 2000,
            icon: "success"
          })
            wx.reLaunch({
              url: '../../index/index'
            })
        } else {
          wx.showToast({
            title: '服务器错误',
            duration: 2000,
            icon: "none",
          })
        }
      })
    }
  }
})
// 验证文本框输入规则
function checkInput(data, type) {
  // 定义验证手机号规则
  let telReg = /^1[3|4|5|7|8][0-9]{9}$/;
  // 定义验证码规则
  let codeReg = /^[0-9]{6}$/;
  let res;
  if (type === "phone")
    res = telReg.test(data) && (data.length === 11)
  else
    res = codeReg.test(data) && (data.length === 6)
  return res
}

//获取验证码
function random(n) {
  if (n > 21) return null
  var re = new RegExp("(\\d{" + n + "})(\\.|$)")
  var num = (Array(n - 1).join(0) + Math.pow(10, n) * Math.random()).match(re)[1]
  return num
}

// 60s倒计时
function countDown(that, time) {
  if (time < 0) {
    that.setData({
      btnInfo: '获取验证码',
      is_sendCode: false,
      randomCode: '' //验证码失效
    })
    return
  }
  that.setData({
    btnInfo: `${time}s后重新获取`,
    is_sendCode: true
  })

  setTimeout(() => {
    time--
    countDown(that, time)
  }, 1000);
}