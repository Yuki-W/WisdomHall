Page({
  data: {
    isAgree: false, //复选框
    disabled: true //提交按钮控制
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length,
      disabled: !e.detail.value.length
    });
  },
  submit(){
    wx.navigateTo({
      url: '../applyStep1/applyStep1'
    })
  }
})