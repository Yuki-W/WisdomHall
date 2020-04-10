const fetch = require("../.././../utils/fetch.js")
Page({
  data: {
    tableType:null,//桌位类别对象
    tableInfo:null,//桌位信息列表
    startX: 0, //开始坐标
    startY: 0,
    isTouchMove:false
  },
  onLoad: function (options) {
    let obj = JSON.parse(options.obj)
    console.log(obj)
    this.setData({tableType:obj})
  },
  onShow(){
    this.selectAll()
  },
  // 查询桌位信息列表
  selectAll(){
    fetch('/shop/findTableInfo',JSON.stringify({
      'shop_id':this.data.tableType.shop_id,
      'name':this.data.tableType.table_class_name
    }),'post').then(res => {
      this.setData({tableInfo:res.data.message})
    })
  },

  //添加修改操作
  handle(e){
    let type = e.currentTarget.dataset.type
    let str
    if(type === 'insert'){
      str = `?table_name=${this.data.tableType.table_class_name}&shopID=${this.data.tableType.shop_id}`
    }else{
      str = `?item=${JSON.stringify(type)}`
    }
    wx.navigateTo({
      url: '../addTbInfo/addTbInfo'+str
    })
  },

  // 删除事件
  delete(e){
    let that = this
    wx.showModal({
      content: '此操作不可撤销',
      confirmText: '确定',
      cancelText: '取消',
      showCancel: true,
      success: (result) => {
        // 获取待删除选项的主键ID
        let curIndex = e.currentTarget.dataset.index
        if(result.confirm){
          fetch(`/shop/delTbInfoByID?id=${curIndex}`).then(res=>{
            if(res.data.flag){
              wx.showToast({
                title: '删除成功',
                duration: 2000,
                icon: 'success',
                success:(res)=>{
                  setTimeout(() => {
                    that.selectAll()
                  });
                }
              })
            }else{
              wx.showToast({
                title: '删除失败，服务器错误',
                duration: 2000,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  //手指触摸动作开始，记录起点X坐标
  touchStart(e) {
    this.data.tableInfo.forEach(function(item,i){
      if(item.isTouchMove){
        item.isTouchMove = false
      }
      if(item.isTouchMove === undefined){
        item.isTouchMove = false
      }
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      tableInfo:this.data.tableInfo
    })
  },
  // 滑动事件处理
  touchMove(e) {
    let that = this
    let index = e.currentTarget.dataset.index;  //当前索引
    let startX = that.data.startX; //开始X坐标
    let startY = that.data.startY; //开始Y坐标
    let touchMoveX = e.changedTouches[0].clientX; //滑动变化坐标
    let touchMoveY = e.changedTouches[0].clientY
    //获取滑动角度
    let angle = that.angle({
      X: startX,
      Y: startY
    }, {
      X: touchMoveX,
      Y: touchMoveY
    })
    that.data.tableInfo.forEach(function(item,i){
      item.isTouchMove = false
      // 滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if(i === index){
      if (touchMoveX > startX) { //右滑
        item.isTouchMove = false
        // this.setData({isTouchMove:false})
      } else {
        item.isTouchMove = true
        // this.setData({isTouchMove:true})
      }
    }
    })
    this.setData({
      tableInfo:that.data.tableInfo
    })
  },
  angle(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  }
})