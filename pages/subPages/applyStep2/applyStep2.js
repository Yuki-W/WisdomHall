const upload = require('../../../utils/upload.js')
Page({
    data: {
        legalName: '', //法人代表姓名
        idCard: '', //身份证号
        contactNumber: '', //后续工作人员联系电话
        front: [], //身份证正面照
        back: [], //身份证背面照
        cardFlag: false, //身份证号验证结果
        index: 0, //显示示例图的索引
        isShow: false, //弹出框显示
        toastTitle: ["·需拍摄手持身份证正面\n·清晰拍出人物五官及身份证信息", "·需拍摄手持身份证反面\n·不可自拍、不可只拍身份证"],
        toastImg: ['https://s3plus.meituan.net/v1/mss_6b7c26b3db4c4bbebdbb4d7a9bb76633/images/info_prompt/st03.jpg', 'https://s3plus.meituan.net/v1/mss_6b7c26b3db4c4bbebdbb4d7a9bb76633/images/info_prompt/st04.jpg']
    },
    // 上传图片
    chooseImage(key) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths
                upload("/shop/uploadImg",tempFilePaths).then(res=>{
                    let data = JSON.parse(res.data)
                    let uploadSrc = data.message
                    if (key === "front") {
                        that.setData({
                            front: that.data.front.concat(tempFilePaths)
                        });
                    } else{
                        that.setData({
                            back: that.data.back.concat(tempFilePaths)
                        });
                    }
                    wx.setStorageSync(`upload${key}`, uploadSrc)
                    wx.setStorageSync(key, tempFilePaths)

                })
            }
        })
    },
    // 图片预览
    previewImage(e) {
        let type = e.currentTarget.dataset.type
        if (type === 'front') {
            wx.previewImage({
                current: e.currentTarget.id, // 当前显示图片的http链接
                urls: this.data.front // 需要预览的图片http链接列表
            })
        } else {
            wx.previewImage({
                current: e.currentTarget.id,
                urls: this.data.back
            })
        }
    },

    //删除图片
  clear(e){
    let type = e.currentTarget.dataset.type
    wx.showModal({
      content: '是否要删除图片',
      cancelText: '取消',
      confirmColor: '#07c160',
      confirmText: '确定',
      showCancel: true,
      success: (result) => {
        if(result.confirm){
          // 确认删除
          wx.removeStorageSync(type)
          wx.removeStorageSync(`upload${type}`)
          if(type === "front"){
            this.setData({front:[]})
          }else{
            this.setData({back:[]})
          }
        }
      }
    })
  },
    getInfos() {
        let legalname = wx.getStorageSync('legalName') || ""
        let idCard = wx.getStorageSync('idCard') || ""
        let contactNumber = wx.getStorageSync('contactNumber') || ""
        let front = wx.getStorageSync('front') || {}
        let back = wx.getStorageSync('back') || {}
        if (legalname.length > 0) {
            this.setData({
                legalName: legalname
            })
        }
        if (idCard.length > 0) {
            this.setData({
                idCard: idCard,
                cardFlag: true
            })
        }
        if (contactNumber.length > 0) {
            this.setData({
                contactNumber: contactNumber
            })
        }
        if (front.length > 0) {
            this.setData({
                front: front
            })
        }
        if (back.length > 0) {
            this.setData({
                back: back
            })
        }
    },
    onShow() {
        this.getInfos();
    },
    handle(e) {
        let type = e.currentTarget.dataset.type
        let value = e.detail.value //输入框内容
        switch (type) {
            case 'legalName':
                let nameReg = /^[\u4E00-\u9FA5]{2,4}$/;
                if (nameReg.test(value)) { //姓名校验通过
                    this.setData({
                        legalName: e.detail.value
                    })
                    wx.setStorageSync('legalName', value)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '输入错误，至少包含2-4个中文字符',
                        confirmText: '确定',
                        showCancel: false,
                        success: res => {
                            this.setData({
                                legalName: ""
                            })
                            wx.removeStorageSync('legalName')
                        }
                    })
                }
                break;
            case "idCard":
                let flag = idCardReg(value)
                this.setData({
                    cardFlag: flag
                })
                if (flag) {
                    this.setData({
                        idCard: value
                    })
                    wx.setStorageSync('idCard', value)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '身份证号填写错误，请检查',
                        confirmText: '确定',
                        showCancel: false,
                        success: res => {
                            wx.removeStorageSync('idCard')
                        }
                    })
                }
                break;
            case 'contactNumber':
                let telReg = /^1[3|4|5|7|8][0-9]{9}$/;
                if (telReg.test(value)) { //验证通过
                    this.setData({
                        contactNumber: value
                    })
                    wx.setStorageSync('contactNumber', value)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '手机号填写错误',
                        confirmText: '确定',
                        showCancel: false,
                        success: res => {
                            this.setData({
                                contactNumber: ''
                            })
                            wx.removeStorageSync('contactNumber')
                        }
                    })
                }
                break;
            case 'front':
                this.chooseImage(type)
                break;
            case 'back':
                this.chooseImage(type);
                break;
        }
    },
    next() {
        if (this.data.legalName.length === 0) {
            wx.showToast({
                title: '请先完善法定代表人姓名',
                duration: 2000,
                icon: 'none'
            })
        } else if (!this.data.cardFlag) {
            wx.showToast({
                title: '请先完善身份证号码',
                duration: 2000,
                icon: 'none'
            })
        } else if (this.data.contactNumber.length === 0) {
            wx.showToast({
                title: '请填写手机号',
                duration: 2000,
                icon: 'none'
            })
        } else if (this.data.front.length === 0) {
            wx.showToast({
                title: '请先上传正面照',
                duration: 2000,
                icon: 'none'
            })
        } else if (this.data.back.length === 0) {
            wx.showToast({
                title: '请先上传反面照',
                duration: 2000,
                icon: 'none'
            })
        } else {
            wx.navigateTo({
                url: '../applyStep3/applyStep3'
            })
        }
    },
    // 示例图弹窗层
    show(e) {
        let i = e.currentTarget.dataset.item
        this.setData({
            index: i,
            isShow: true
        })
    },
    // 弹出框隐藏
    cancel() {
        this.setData({
            isShow: false
        })
    }
})

// 正则身份验证 18位 和 15位
function idCardReg(val) {
    let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    let _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/
    // 校验身份证：
    if (_IDRe18.test(val) || _IDre15.test(val)) {
        console.log(' 验证通过 ')
        return true
    } else {
        console.log(' 验证未通过 ')
        return false
    }

}