// 封装的网络请求
/**
 * path: 接口地址(相对)
 * data: 请求数据
 * method:请求方式（GET 和 POST）
 */
module.exports = function(path,data,method){

  return new Promise((resolve,reject) => {
    wx.request({
      url:  `http://localhost:8080/DianCan${path}`,  //接口地址
      method: method, //请求方法
      data: data,//参数
      success: resolve,
      // 请求失败执行fail操作
      fail: () => {
        reject()
        wx.showModal({
          showCancel: false,
          title: '服务器繁忙'
        })
      }
    })
  })
}