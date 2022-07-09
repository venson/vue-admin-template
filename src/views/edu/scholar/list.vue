<template>
  <div class="app-container">
    Papers List
    <el-form
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <el-input
          v-model="condition"
          placeholder="查询"
        />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getPageScholar()"
      >
        查询
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
      :data="scholarPage.records"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="title"
        min-width="180"
      />
      <el-table-column
        label="year"
        min-width="100"
        prop="year"
      />
      <el-table-column
        prop="totalCitations"
        label="citations"
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
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <router-link :to="'/scholar/info/' + scope.row.id">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            >
              Edit
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
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getPageScholar"
    />
  </div>
</template>


<script>
import scholarApi from '@/api/edu/scholar'
export default {
  data() {
    return {
        scholarPage: {
            records: [],
            hasPrevious: '',
            hasNext: '',

        },
      courseList: null,
      page: 1,
      limit: 8,
      condition: "",
      total: 0,

    }
  },
  created() {
    this.getPageScholar()
  },
  methods: {
    handleSizeChange(val){
      this.limit = val
      this.getScholarPage(this.page)

    },
    getPageScholar(page = 1) {
      this.page = page
      scholarApi.getPageScholar(this.page, this.limit)
        .then(response => {
          console.log(response)
          this.scholarPage = response.data
          console.log(this.scholarPage)
        })
    },
    deleteCourse(id) {
      this.$confirm('Delete the Article？', 'Prompt', {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          course.deleteScholar(id)
            .then(() => {
              this.$message({
                type: 'success',
                message: "Deletion success"
              })
              this.getScholarPage()
            })
        })
    }
  },

}
</script>
