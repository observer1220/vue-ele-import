<template>
  <div class="ele-import-download">
    <el-link
      :href="filepath"
      :underline="false"
      @click.native="handleDownload"
      target="_blank"
    >
      <i class="el-icon-document"></i>
    </el-link>
    <div>
      <el-link
        :href="filepath"
        :underline="false"
        @click.native="handleDownload"
        target="_blank"
      >點擊下載模板文件</el-link>
    </div>

    <div class="ele-import-action">
      <el-button
        @click="handleDownload"
        type="success"
      >
        <el-link
          :href="filepath"
          :underline="false"
          style="color: white"
          target="_blank"
        >下載模板</el-link>
      </el-button>
      <el-button
        @click="handleNext"
        type="primary"
      >下一步</el-button>
    </div>
  </div>
</template>

<script>
// 下載文件页面
import Cookie from 'js-cookie'

export default {
  name: 'EleImportDownload',
  props: {
    filepath: {
      type: String,
      required: true
    }
  },
  inject: ['goNext'],
  data () {
    return {
      hasDownload: false
    }
  },
  methods: {
    // 點擊下載
    handleDownload () {
      Cookie.set('ele-import-download-' + this.filepath, true)
      this.hasDownload = true
    },

    // 點擊下一步
    handleNext () {
      if (this.hasDownload) {
        this.goNext()
      } else {
        this.$message.error('您還未下載模板文件')
      }
    },

    // 判断是否已经下載
    checkHasDownload () {
      this.hasDownload = Cookie.get('ele-import-download-' + this.filepath)
    }
  },
  mounted () {
    // 判断是否下載过
    this.checkHasDownload()
  }
}
</script>

<style scoped>
.ele-import-download {
  text-align: center;
}

.ele-import-download .el-icon-document {
  font-size: 150px;
  line-height: 1.2;
  color: #67c23a;
}
</style>
