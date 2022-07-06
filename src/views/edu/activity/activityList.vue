<template>
  <div class="app-container">
    课程列表
    <el-form
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <el-input
          v-model="filter.title"
          placeholder="Title"
        />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getPageList()"
      >
        Search
      </el-button>
      <el-button
        type="default"
        icon="el-icon-refresh-left"
        @click="resetData()"
      >
        清空
      </el-button>
    </el-form>

    <!-- 表格列表 -->
    <el-table
      :data="pageActivity.records"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="课程名称"
        min-width="180"
      />
      <el-table-column
        label="教师"
        min-width="100"
        prop="memberName"
      />
      <el-table-column
        prop="lessonNum"
        label="课时"
        min-width="80"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="400"
        align="center"
      >
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            >
              Info
            </el-button>
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            >
              Lecture
            </el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteCourse(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->


    <el-pagination
      :current-page="page"
      :page-size="limit"
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageActivity.total"
      @size-change="handleSizeChange"
      @current-change="getPageList"
    />
  </div>
</template>

<script>
import activityApi from '@/api/edu/activity'
export default {
    data(){
        return {
            courseList: [],
            pageActivity:{
                records: [] ,
                total: 0
            },
            filter: {
                title: '',
                begin: '',
                end: '',
            },
            limit: 10,
            page: 1,

        }
    },
    created() {
        this.getPageList()
    },
    methods:{
        getPageList(page=1){
            activityApi.getPageActivity(page,this.limit, this.filter)
            .then(response=>{
                this.pageActivity = response.data
                console.log(this.pageActivity)
            })
        },
    handleSizeChange(val){
      this.limit = val
      this.getPageList(this.page)

    },


    }
}   
</script>