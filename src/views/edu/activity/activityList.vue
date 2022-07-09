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

    <el-button @click="newActivity">
      New Activity
    </el-button>
    <!-- 表格列表 -->
    <el-table
      :data="pageActivity.records"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="Title"
        min-width="280"
      />
      <el-table-column
        label="Date"
        min-width="100"
        prop="activityDate"
      />
      <el-table-column
        prop="isPublished"
        label="Publish status"
        min-width="100"
      >
        <template slot-scope="scope">
          {{ (scope.row.isPublished === true ? "已发布" : "未发布") +
            (scope.row.publishRequest === 1 ? "/Requested" : "")
              + (scope.row.publishRequest === 2 ? "/rejected" : "")
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="Operations"
        min-width="400"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['activity.edit']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :disabled="scope.row.publishRequest === 1"
            @click="edit(scope.row.id)"
          >
            Edit
          </el-button>
          <el-button
            v-permission="['activity.delete']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteActivity(scope.row.id)"
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
import permission from '@/directive/permission/index'
export default {
  directives: { permission },
  data() {
    return {
      courseList: [],
      pageActivity: {
        records: [],
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
    // console.log(this.buttons)
  },
  methods: {
    getPageList(page = 1) {
      activityApi.getPageActivity(page, this.limit, this.filter)
        .then(response => {
          console.log(response)
          this.pageActivity = response.data
          console.log(this.pageActivity)
        })
    },
    handleSizeChange(val) {
      this.limit = val
      this.getPageList(this.page)

    },
    newActivity() {
      this.$router.push({ path: 'activityInfo' })

    },
    edit(id) {
      this.$router.push({ path: `activityInfo/${id}` })
    },

    deleteActivity(id) {
      activityApi.deleteActivity(id)
        .then(() => {
          this.$message({
            type: 'success',
            message: 'Delete successed'
          })
          this.getPageActivity(this.page)
        })
    }

  },

}   
</script>