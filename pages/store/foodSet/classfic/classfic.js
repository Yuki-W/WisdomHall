const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    shopId: 0,
    listData: null,
    isShowToast: false, //弹窗
    value: '', //类别名称
    timpObj: null, //临时修改的分类对象
    isHide:false
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({shopId:options.id})
  },
  onShow(){
    this.selectAll()
  },
  selectAll(){
    fetch(`/food/findClass?id=${this.data.shopId}`).then(res => {
      console.log(res)
      this.setData({
        listData: res.data.message
      })
    })
  },
  input(e) {
    this.setData({
      value: e.detail.value
    })
  },
  handle(e) {
    let type = e.currentTarget.dataset.type
    switch (type) {
      case 'add':
        this.setData({
          isShowToast: !this.data.isShowToast,
          timpObj:null,
          value:'',
          isHide:false
        })
        break;
      case 'update':
        let item = e.currentTarget.dataset.item
        console.log(item)
        this.setData({
          isShowToast: !this.data.isShowToast,
          timpObj: item,
          value:item.name,
          isHide:true
        })
        break;
      case 'del':
        let data = e.currentTarget.dataset.item
        fetch(`/food/delClass?id=${data.id}`).then(res => {
          wx.showToast({
            title: '删除成功',
            duration: 2000,
            icon: 'success',
            success: (res) => {
              this.selectAll()
            }
          })
        })
        break;
    }
  },
  insert() {
    let val = this.data.value
    if (!testReg(val)) {
      wx.showToast({
        title: '只能输入中文字符',
        duration: 2000,
        icon: 'none'
      })
    } else {
      fetch("/food/upClassInfo", JSON.stringify({
        id: this.data.timpObj? this.data.timpObj.id:0,
        shopId: this.data.shopId,
        name: this.data.value
      }), 'post').then(res => {
        if (res.data.flag) {
          wx.showToast({
            title: '成功',
            duration: 2000,
            icon: 'success',
            success: res => {
              this.setData({
                isShowToast: !this.data.isShowToast
              })
              this.selectAll()
            }
          })
        } else {
          wx.showToast({
            title: '服务器繁忙，请稍后再试',
            duration: 2000,
            icon: 'none'
          })
        }
      })
    }
  }
})
// 正则判断全为中文
function testReg(val) {
  let reg = /^[\u4e00-\u9fa5]+$/;
  return reg.test(val);
}