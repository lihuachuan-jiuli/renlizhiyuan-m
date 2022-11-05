<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="limit"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{disabled: fileComputed }"
      action="#"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDhGerqbP1Qix40lKgo25xa1FgwynQr33q', // 身份识别 ID
  SecretKey: 'g9PTLyMVHp8B1dz71oTyJTTM6h4FG6cx' // 身份密钥
})
export default {
  props: {
    limit: {
      default: 1,
      type: Number
    }
  },
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      showPercent: false,
      percent: 0
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完够了
    fileComputed() {
      return this.fileList.length === this.limit
    }
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file) {
      // file是点击删除的文件
    //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    handleChange(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    },
    upload(params) {
      if (params.file) {
        this.showPercent = true
        // 执行上传操作
        cos.putObject({
          Bucket: 'jiuli-1300304661', // 存储桶
          Region: 'ap-chengdu', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          // data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            //   此时说明文件上传成功  要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === params.file.uid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, status: 'success' }
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 500)
          }
        })
      }
    }
  }
}
</script>
<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
