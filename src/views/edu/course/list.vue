<template>
  <div class="app-container">
    课程列表
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="condition" placeholder="查询"></el-input>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getCourseList()">查询</el-button>
      <el-button type="default" icon="el-icon-refresh-left" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格列表 -->
    <el-table :data="courseList" stripe style="width: 100%">
      <el-table-column prop="title" label="课程名称" min-width="180">
      </el-table-column>
      <el-table-column label="教师" min-width="80" prop="teacherName">
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时" min-width="80">
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="180">
        <template slot-scope="scope">
          {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲信息</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCourse(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->


    <el-pagination :current-page="page" :page-size="limit" @size-change="handleSizeChange"
      @current-change="getCourseList" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>


<script>
import course from '@/api/edu/course'
export default {
  data() {
    return {
      courseList: null,
      page: 1,
      limit: 8,
      condition: "",
      total: 0,

    }
  },
  created() {
    this.getCourseList()
  },
  methods: {
    handleSizeChange(val){
      this.limit = val
      this.getCourseList(this.page)

    },
    getCourseList(page = 1) {
      this.page = page
      course.getCourseList(this.page, this.limit, this.condition)
        .then(response => {
          console.log(response)
          this.courseList = response.data.row
          this.total = response.data.total
        })
    },
    deleteCourse(id) {
      this.$confirm('确认删除课程？', '提示', {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          course.deleteCourse(id)
            .then(() => {
              this.$message({
                type: 'success',
                message: "删除成功"
              })
              this.getCourseList()
            })
        })
    }
  },

}
</script>
