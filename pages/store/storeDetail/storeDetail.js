const fetch = require('../../../utils/fetch.js')
Page({
  data: {
    shop: null, //门店对象
    status: false, //营业状态
    reserve: false, //预约支持状态
    startTime: "00:00",
    endTime: "00:00",
    array: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    startDay: '请选择',
    endDay: '请选择',
    introduct:'',//餐厅介绍
    price:0,//人均价位
  },
  onLoad: function (options) {
    // console.log(options)
    if (options.hasOwnProperty("shop")) {
      let shop = JSON.parse(options.shop)
      console.log(shop)
      this.setData({
        shop: shop
      })
    }
  },
  onShow(){
    this.selectInfo()
  },
  selectInfo(){
    fetch(`/shop/findDetail?id=${this.data.shop.id}`).then(res => {
      console.log(res)
      if(res.data.flag){
        let item = res.data.message;
        let day = item.day.split(",")
        let times = item.times.split(",")
        console.log(`${day},${times}`)
        this.setData({
          introduct:item.introduct,
          price:item.price,
          reserve:item.reserve,
          status:item.status,
          startDay:day[0],
          endDay:day[1],
          startTime:times[0],
          endTime:times[1]
        })
      }
    })
  },
  // 开关切换
  switch (e) {
    let type = e.currentTarget.dataset.type
    if (type === 'status') {
      this.setData({
        status: !this.data.status
      })
    } else {
      this.setData({
        reserve: !this.data.reserve
      })
    }
  },
  bindTimeChange: function (e) {
    let curIndex = e.currentTarget.dataset.timer
    switch (curIndex) {
      case '0':
        this.setData({
          startTime: e.detail.value
        })
        break;
      case '1':
        this.setData({
          endTime: e.detail.value
        })
        break;
    }
  },
  bindPickerChange: function (e) {
    let curIndex = e.currentTarget.dataset.timer
    let index = e.detail.value
    if (curIndex === "0") {
      this.setData({
        startDay: this.data.array[index]
      })
    } else {
      this.setData({
        endDay: this.data.array[index]
      })

    }
  },
  // 文本输入处理
  handle(e){
    let type = e.currentTarget.dataset.type
    let val = e.detail.value
    if(type==='introduct'){
      this.setData({
        introduct:val
      })
    }else{
      this.setData({price:val})
    }
  },
  submit(){
    let reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;//价格验证
    if(this.data.startDay=='请选择' || this.data.endDay=='请选择'){
      wx.showToast({
        title: '请选择经营时间',
        duration: 2000,
        icon: 'none'
      })
    }else if(this.data.price===0){
      wx.showToast({
        title: '请输入价格信息',
        duration: 2000,
        icon: 'none'
      })
    }else if(!reg.test(this.data.price)){
      wx.showToast({
        title: '价格格式不正确，请仔细检查',
        duration: 2000,
        icon: 'none'
      })
    }else{
      fetch('/shop/addDetails',JSON.stringify({
        id:this.data.shop.id,
        status:this.data.status,
        introduct:this.data.introduct,
        date:`${this.data.startDay},${this.data.endDay}`,
        hours:`${this.data.startTime},${this.data.endTime}`,
        price:this.data.price,
        reserve:this.data.reserve
      }),'post').then(res => {
        // console.log(res)
        wx.showToast({
          title: '操作成功',
          duration: 2000,
          icon: 'success'
        })
      })
    }
  }
})