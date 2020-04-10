const fetch = require('../../../utils/fetch.js')
const app = getApp()
Page({
  data: {
    shopId:null,//店铺ID
    isShowToast: false,
    startX: 0, //开始坐标
    startY: 0,
    tableClassArr: null, //桌位类别对象
    input:'',
    value:''
  },
  onLoad: function (options) {
    // console.log(options)
    this.setData({shopId:Number(options.shopId)})
  },
  onShow(){
    this.selectAll()
  },
  // 跳转到子页面事件
  skip(e){
    let obj = e.currentTarget.dataset.obj
    wx.navigateTo({
      url: `../tbInfo/tbInfo?obj=${JSON.stringify(obj)}`,
    })
  },
  // 查询所有列表信息
  selectAll(){
    let that = this
    fetch('/shop/findTbClass', JSON.stringify({
      tel: app.globalData.tel
    }), 'post').then(res => {
      console.log(res)
      // if(res.data.flag){
        that.setData({
          tableClassArr: res.data.message
        })
      // }
    })
  },
  input(e){
    this.setData({input:e.detail.value})
  },
  // 删除事件
  delete(e){
    let that = this
    wx.showModal({
      content: '删除后所属桌位信息将全部删除，此操作不可撤销',
      confirmText: '确定',
      cancelText: '取消',
      showCancel: true,
      success: (result) => {
        // 获取待删除选项的主键ID
        let item = e.currentTarget.dataset.item
        console.log(item)
        if(result.confirm){
          fetch('/shop/delTableClass',JSON.stringify({item:item}),'post').then(res=>{
            // console.log(res)
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
  // 添加事件
  insert(){
    let that = this
    let val = this.data.input
    if(val.length === 0){
      wx.showToast({
        title: '请输入内容',
        duration: 2000,
        icon: 'none'
      })
    }else{
      if(!testReg(val)){
        wx.showToast({
          title: '输入的内容只能包含中文',
          duration: 2000,
          icon: 'none'
        })
      }else{
        fetch("/shop/addTableClass",JSON.stringify({
          id:that.data.shopId,
          name:that.data.input
        }),'post').then(res=>{
          console.log(res)
          if(res.data.flag){
            wx.showToast({
              title: '添加成功',
              duration: 2000,
              icon: 'success',
              success:res=>{
                setTimeout(() => {
                  that.selectAll()
                 that.setData({
                   value:'',
                   isShowToast:!that.data.isShowToast,
                  })
                });
              }
            })
          }else{
            wx.showToast({
              title: '数据插入重复',
              duration: 2000,
              icon: 'none'
            })
          }
        })
      }
    }
  },
  // 自定义弹出框事件
  handle(){
    this.setData({
      isShowToast:!this.data.isShowToast
    })
  },
  //手指触摸动作开始，记录起点X坐标
  touchStart(e) {
    this.data.tableClassArr.forEach(function(item,i){
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
      tableClassArr:this.data.tableClassArr
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
    that.data.tableClassArr.forEach(function(item,i){
      item.isTouchMove = false
      // 滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if(i === index){
      if (touchMoveX > startX) { //右滑
        item.isTouchMove = false
      } else {
        item.isTouchMove = true
      }
    }
    })
    this.setData({
      tableClassArr:that.data.tableClassArr
    })
  },

  /*
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  }
})

// 正则判断全为中文
function testReg(val){
  let reg = /^[\u4e00-\u9fa5]+$/;
  return reg.test(val);
}