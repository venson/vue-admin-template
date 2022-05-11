<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模板说明</el-tag>

        <el-tag>
          <i class="el-icon-download" />
          <a :href="'/static/01.xlsx'">模板下载</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="文件上传">
        <el-upload
          ref="upload"
          :action= "BASE_API+'eduservice/edu-subject/addSubject'"
          name="file"
          accept=".xls, .xlsx"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选择文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            :loading="loading"
            >上传到服务器</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      importBtnDisabled: false,
      BASE_API: process.env.VUE_APP_BASE_API,
      loading: false

    };
  },
  methods: {
    submitUpload(){
      console.log(this.BASE_API)
      this.importBtnDisabled=true
      this.loading=true
      this.$refs.upload.submit()

    },
    fileUploadSuccess(){
      this.loading = false
      this.$message({
        type: 'success',
        message: '添加成功'
      })
      this.$route.push({path:'/subject/list'})

    },
    fileUploadError(){
      this.loading = false
      this.$message({
        type: 'error',
        message: '添加失败'
      })
    }
  },
};
</script>
