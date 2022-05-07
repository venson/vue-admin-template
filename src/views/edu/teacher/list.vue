<template>
  <div class="app-container">
    教师列表
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item >
        <el-input v-model="teacherQuery.name" placeholder="讲师名"></el-input>
      </el-form-item>
      <el-form-item >
        <el-select v-model="teacherQuery.level" clearable placeholder="职位">
          <el-option label="高级讲师" value="1"></el-option>
          <el-option label="首席讲师" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"/>
      </el-form-item>

      <el-form-item label="截止时间">
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"/>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" icon="el-icon-refresh-left" @click="resetData()">清空</el-button>
    </el-form>

  <!-- 表格列表 -->
  <el-table
    :data="list"
    stripe
    style="width: 100%">
    <el-table-column
      prop="name"
      label="名称"
      width="180">
    </el-table-column>
    <el-table-column
      label="职位"
      width="180">
      <template slot-scope="scope">
        {{scope.row.level === 1? '高级讲师':'首席讲师'}}
      </template>
    </el-table-column>
    <el-table-column
      prop="intro"
      label="资历"
      width="180">
    </el-table-column>
    <el-table-column
      prop="gmtCreate"
      label="加入时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="sort"
      label="排序"
      width="60">
    </el-table-column>
    <el-table-column
      label="操作"
      width="200"
      align="center">
      <template slot-scope="scope">
        <router-link :to="'/edu/teacher/edit/' + scope.row.id">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
        </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeTeacherById(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

    <!-- 分页 -->


  <el-pagination
    :current-page="page"
    :page-size="limit"
    @size-change="page"
    @current-change="getList"
    :page-sizes="[10, 20, 30, 40]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</div>


</template>

<script>
import teacher from '@/api/edu/teacher.js'
export default{
  // data:{

  // },
  data() {
    return {
      list:null,
      page:1,
      limit: 10,
      total: 0,
      teacherQuery:{}
    }
  },
  created() {
    this.getList()

  },
  methods:{
    getList(page=1){
      this.page=page
      teacher.getTeacherListPage(this.page,this.limit, this.teacherQuery)
      .then(response => {
        // console.log(response)
          console.log("=======")
          this.list = response.data.row
          this.total = response.data.total
          console.log(this.list)
          console.log(this.total)


      })
      .catch(error => {console.log(error)})
    },
    resetData(){
      this.teacherQuery={}
      this.getList()
    },
    removeTeacherById(id){

        this.$confirm('此操作将删除讲师的记录,是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            teacher.deleteTeacherById(id)
            .then(response => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getList()
              })
        })



    }


  }

}
</script>
