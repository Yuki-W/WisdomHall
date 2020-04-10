const fetch  = require("../../../utils/fetch.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tableClass: '', //桌位区域分类
    shopID:'',
    tableID: '', //桌位编号
    availNum: '', //容纳人数
    flag:false,//是否修改标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.hasOwnProperty("table_name")) {
      this.setData({
        tableClass: options.table_name,
        shopID:options.shopID
      })
    }else{
      let jsonArr = JSON.parse(options.item)
      this.setData({
        tableClass:jsonArr.table_name,
        tableID:jsonArr.table_id,
        availNum:jsonArr.tab_avail_num,
        shopID:jsonArr.shop_id,
        flag:true
      })
    }
  },
  //添加事件
  handle(e) {
    let type = e.currentTarget.dataset.type
    let val = e.detail.value
    switch (type) {
      case 'tableID':
        this.setData({
          tableID: val
        })
        break;
      case 'availNum':
        this.setData({
          availNum: val
        })
        break;
      case 'cancel':
        this.setData({
          tableID: '',
          availNum: ''
        })
        break;
      case 'submit':
        let reg = /^[0-9]+$/
        if(this.data.tableID.length===0 || this.data.availNum.length===0){
          wx.showToast({
            title: '输入内容为空，请完善',
            duration: 2000,
            icon: 'none'
          })
        }else if(!reg.test(this.data.tableID) || !reg.test(this.data.availNum)){
          wx.showToast({
            title: '只能输入数字',
            duration: 2000,
            icon: 'none'
          })
        }else if(!this.data.flag){
          fetch('/shop/addTbInfo',JSON.stringify({
            'tableID':this.data.tableID,
            'shopID':this.data.shopID,
            'tableName':this.data.tableClass,
            'availNum':this.data.availNum
          }),'post').then(res=>{
            if(res.data.flag){
              wx.showToast({
                title: '添加成功',
                duration: 2000,
                icon: 'success',
                success:res => {
                  this.setData({
                    tableID:'',
                    availNum:''
                  })
                }
              })
            }else{
              wx.showToast({
                title: '桌位编号重复，请重新输入',
                duration: 2000,
                icon: 'none'
              })
            }
          })
        }else if(this.data.flag){
          fetch('/shop/updateTbInfo',JSON.stringify({
            'tableID':this.data.tableID,
            'shopID':this.data.shopID,
            'tableName':this.data.tableClass,
            'availNum':this.data.availNum
          }),'post').then(res => {
            // console.log(res)
            wx.showToast({
              title: '修改成功',
              duration: 2000,
              icon: 'success'
            })
          })
        }
        break;
    }
  }
})