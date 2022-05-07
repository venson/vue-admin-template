<template>
  <div class="app-container">
    教师添加

    <el-form label-width="120px">
      <el-form-item label="讲师姓名">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input v-model="teacher.sort" />
      </el-form-item>
    </el-form>
  </div>
</template>
