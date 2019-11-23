// 将base64转换为blob
export function convertBase64UrlToBlob(urlData) {
    var arr = urlData.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }
  
  // 压缩图片
  export function compressImage(path, config) {
    return new Promise((resolve, reject) => {
      var img = new Image()
      img.src = path
      img.onload = function() {
        var that = this
        var w = that.width
        var h = that.height
        var scale = w / h
        w = config.width || config.height * scale
        h = config.height || config.width / scale
        var quality = 0.7 // 默认图片质量为0.7
        // 生成canvas
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        // 创建属性节点
        var anw = document.createAttribute('width')
        anw.nodeValue = w
        var anh = document.createAttribute('height')
        anh.nodeValue = h
        canvas.setAttributeNode(anw)
        canvas.setAttributeNode(anh)
        ctx.drawImage(that, 0, 0, w, h)
        if (config.quality && config.quality <= 1 && config.quality > 0) {
          quality = config.quality
        }
        var base64 = canvas.toDataURL('image/*', quality)
        // var blob = convertBase64UrlToBlob(base64)
        // 回调函数返回base64的值，也可根据自己的需求返回blob的值
        resolve(base64)
      }
    })
  }