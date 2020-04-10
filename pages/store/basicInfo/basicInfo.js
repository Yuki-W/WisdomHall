Page({
  data: {
    shop: null, //店铺对象
    status: false, //营业状态

    countries: [
      ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    ],
    countryIndex: null,
    startDay: '', //开始营业日期
    endDay: '', //结束营业日期

    startTime: "00:00",
    endTime: "00:00",
  },
  onLoad: function (options) {
    // let shop = JSON.parse(options.shop)
    // if (Object.keys(shop).length > 0) {
    //   this.setData({
    //     shop: shop
    //   })
    // }
  },
  // 开关切换
  switch () {
    this.setData({
      status: !this.data.status
    })
  },
  bindCountryChange: function (e) {
    let that = this
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    let curArr = e.detail.value
    this.setData({
      startDay: (that.data.countries[0])[curArr[0]],
      endDay: (that.data.countries[1])[curArr[1]]
    })
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

  }
})