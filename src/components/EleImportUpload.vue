<template>
  <div>
    <!-- 提示列表 -->
    <div v-if="tips && tips.length">
      <el-alert
        show-icon
        type="warning"
      >
        <ol class="ele-import-upload-tips">
          <li
            :key="index"
            v-for="(item, index) of tips"
          >{{item}}</li>
        </ol>
      </el-alert>
    </div>

    <!-- 上傳组件 -->
    <el-upload
      :before-upload="beforeUpload"
      :file-list="fileList"
      :http-request="fakeRequeset"
      :limit="1"
      :show-file-list="false"
      action="/"
      class="ele-import-upload-uploader"
      drag
      v-loading="isLoading"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        將填寫後的文件拖到此處，或
        <em>點擊上傳</em>
      </div>
    </el-upload>

    <!-- 操作 -->
    <div class="ele-import-action">
      <el-button @click="goPre">上一步</el-button>
      <el-button
        :loading="isLoading"
        @click="handleGoNext"
        type="primary"
      >下一步</el-button>
    </div>
  </div>
</template>

<script>
// 上傳文件页面
import excel from '../excel'

export default {
  name: 'EleImportUpload',
  props: {
    tips: Array,
    fields: {
      type: Object,
      required: true
    }
  },
  inject: ['goNext', 'goPre'],
  data () {
    return {
      fileList: [],
      isLoading: false
    }
  },
  methods: {
    // 假上傳
    fakeRequeset () {
      this.fileList = []
    },
    // 检测文件類型
    checkType (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      const extArr = ['xlsx', 'xls', 'csv']
      return extArr.includes(fileExt)
    },
    // 上傳錯處提示
    uploadError (message) {
      this.$notify.error({
        title: '上傳出錯了',
        message: message
      })
    },
    // 检测表头
    checkTableTitle (columns, fields) {
      const titles = Object.values(fields)
      titles.forEach((item) => {
        if (!columns.includes(item)) {
          this.$notify.error({
            title: '數據錯處了',
            message: item + ' 列未找到'
          })
        }
      })
    },
    handleGoNext () {
      this.$notify.error({
        title: '提示',
        message: '請先上傳數據'
      })
    },

    // 改变 tableData 的 key, 並且过滤掉不需要的字段
    changeDatakeyAndFilter (arr) {
      const fields = this.fields
      return arr.map((item) => {
        let res = {}
        for (const key in fields) {
          res[key] = item[fields[key]]
        }
        return res
      })
    },

    async beforeUpload (file) {
      if (this.isLoading) return

      // 检测文件類型
      if (!this.checkType(file)) {
        this.uploadError('文件：' + file.name + ' 文件類型錯誤，請在模板文件上修改後上傳')
        return false
      }

      this.isLoading = true
      try {
        const { columns, tableData } = await excel(file)

        if (!(columns.length && tableData.length)) {
          this.uploadError('請打開模板文件, 並填寫數據')
        } else {
          this.checkTableTitle(columns, this.fields)
          this.$emit('upload', columns, this.changeDatakeyAndFilter(tableData))
          this.goNext()
        }
      } catch (e) {
        // eslint-disable-next-line
        console.error(e)
        this.uploadError('文件讀取出錯，請重新上傳')
      } finally {
        this.isLoading = false
      }

      return false
    }
  }
}
</script>

<style>
.ele-import-upload-tips {
  padding: 0 20px;
  line-height: 20px;
  list-style-type: decimal;
}

.ele-import-upload-uploader {
  margin-top: 20px;
  text-align: center;
}
</style>
