const fetch = require('../../../../utils/fetch.js');
const upload = require('../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    food_name: '',
    food_price: '',
    old_price: '',
    storeId: 0,
    // checkOnStatus: true, //上架状态
    checkStatus: false, //原价状态
    foodsList: [],
    nameList: [],
    curIndex: 0,
    files: []
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // that.setData({
        //   files: that.data.files.concat(res.tempFilePaths)
        // });
        let tempFilePaths = res.tempFilePaths
        upload("/shop/uploadImg", tempFilePaths).then(res => {
          let data = JSON.parse(res.data)
          // 获取服务器上传图片路径
          let uploadSrc = data.message
          that.setData({
            files: that.data.files.concat(tempFilePaths)
          });
          wx.setStorageSync(`uploadFoodPic`, uploadSrc)
          wx.setStorageSync('tempFoodPic', tempFilePaths)
        })
      }
    })
  },
  nameHandle(e) {
    this.setData({
      food_name: e.detail.value
    })
  },
  priceHandle(e) {
    this.setData({
      food_price: e.detail.value
    })
  },
  oldPriHandle(e) {
    this.setData({
      old_price: e.detail.value
    })
  },
  submit() {
    let name = this.data.food_name;
    let class_id = this.data.foodsList[this.data.curIndex].id;
    let food_price = this.data.food_price;
    let old_price = this.data.old_price;
    let pic_url = this.data.files;
    let status = this.data.checkStatus;
    console.log(this.checkMoney(food_price))
    if(pic_url.length===0){
      this.toast('请先上传图片','none');
    }else if(name === ''){
      this.toast('请填写菜品名称','none');
    }else if(!this.checkMoney(food_price)){
      this.toast('菜品价格填写有误，请检查','none');
    }else if(status && !this.checkMoney(old_price)){
      this.toast('原价填写有误，请检查','none');
    }else{
      let upFoodPic = wx.getStorageSync('uploadFoodPic');
      const data = {
            name:name,
            class_id:class_id,
            imgUrl:upFoodPic,
            price:food_price,
            old_price:old_price
      }
      fetch('/food/addFood',data,'post').then(res => {
        if(res.data.flag){
          this.setData({
            files:[],
            food_name:'',
            food_price:'',
            old_price:'',
            checkStatus:false
          })
        }
      })
    }
  },
  checkMoney(val) {
    let testReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (val !== null && testReg.test(val)) {
      return true;
    } else {
      return false;
    }
  },
  loaCalssData() {
    wx.showLoading({
      title: '正在加载'
    })
    let shopId = this.data.storeId;
    fetch(`/food/findClass?id=${shopId}`).then(res => {
      wx.hideLoading({});
      console.log(res)
      let data = res.data;
      if (data.flag) {
        let arr = [];
        data.message.forEach(item => {
          arr.push(item.name);
        })
        this.setData({
          nameList: arr,
          foodsList: data.message
        });
      } else {
        wx.showToast({
          title: '暂未查询到分类，请先设置菜品分类',
          duration: 3000,
          icon: 'none',
          success: (res) => {
            setTimeout(() => {
              wx.redirectTo({
                url: `../classfic/classfic?id=${this.data.storeId}`
              })
            });
          }
        })
      }
    })
  },
  bindCountryChange: function (e) {
    let curIndex = e.detail.value;
    this.setData({
      curIndex: curIndex
    })
  },
  switChange(e) {
    let status = e.detail.value
    let type = e.currentTarget.dataset.type
    if (type === 'price') {
      this.setData({
        checkStatus: status
      })
    } 
    // else {
    //   this.setData({
    //     checkOnStatus: status
    //   })
    // }
  },

  //提示框
  toast(msg,icon){
    wx.showToast({
      title: msg,
      complete: (res) => {},
      duration: 2000,
      icon: icon
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      storeId: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loaCalssData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})