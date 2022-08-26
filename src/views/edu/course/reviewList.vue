<template>
  <div class="app-container">
    Review List
    <!-- 表格列表 -->
    <el-table
      :data="pageInfo.records"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="课程名称"
        min-width="180"
      />
      <el-table-column
        label="主讲"
        min-width="100"
        prop="memberName"
      />
      <el-table-column
        prop="totalHour"
        label="课时"
        min-width="80"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.isPublished ? "published" : "unpublished" }}
          {{ scope.row.isModified ? "/modified" :"" }}
          {{ scope.row.review === 1 ? "reviewing" :"" }}
          {{ scope.row.review === 2 ? "/rejected" :"" }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['course.review']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="reviewCourseById(scope.row.id)"
          >
            Review
          </el-button>
          <el-button
            v-permission="['course.review.reject']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="rejectReviewByCourseId(scope.row.id)"
          >
            Reject
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
      :total="pageInfo.total"
      @size-change="handleSizeChange"
      @current-change="getReviewList"
    />
  </div>
</template>


<script>
import course from '@/api/edu/course'
import reviewApi from '@/api/edu/review'
import { mapGetters } from 'vuex'
import permission from '@/directive/permission/index'
export default {
  directives: { permission },
  data() {
    return {
      pageInfo: {
        records: [],
        hasNext: '',
        hasPrevious: '',
        current: 0,
        pages:0,
        size: 0,
        total: 0,
      },
      page: 1,
      limit: 10,
      condition: "",

    }
  },
  computed: {
    ...mapGetters([
      'name',
      'id',
      'buttons'
    ])

  },
  created() {
    this.getReviewList()
  },
  methods: {
    reviewCourseById(id){
      this.$router.push({path: `review/${id}`})
    },
    handleSizeChange(val){
      this.limit = val
      this.getCourseList(this.page)

    },
    getReviewList(page = 1) {
      this.page = page
      reviewApi.getPageCourseReviewList(page, this.limit)
        .then(response => {
          this.pageInfo = response.data
          console.log(this.pageInfo)
        })
    },
    rejectReviewByCourseId(id) {
      this.$confirm('Reject？', 'Prompt', {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          reviewApi.rejectReviewByCourseId(id)
            .then(() => {
              this.$message({
                type: 'success',
                message: "Reject success"
              })
              this.getReviewList()
            })
        })
    }
  },

}
</script>
