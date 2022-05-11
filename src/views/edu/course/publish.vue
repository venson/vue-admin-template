<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="3"
      process-status="wait"
      align-center
      style="margin: bottom 4px"
      finish-status="success"
    >
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>
    <el-form>
      <el-form-item>
        <el-button
          type="primary"
          @click="previous"
          >Previous</el-button
        >
        <el-button
          :disabled="BtnDisabled"
          type="primary"
          @click="next"
          >Next</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      BtnDisabled: false,
    };
  },
  created() {},
  methods: {
    previous(){
      this.$router.push({path:'/course/chapter/1'})
    },
    next() {
      this.$router.push({path:'/course/list'})
    },
  },
};
</script>
