<template>
  <div class="app-container">
    课程列表
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
        @click="getCourseList()"
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
          <el-button-group>
            <el-button
              v-permission="['course.edit.info']"
              type="primary"
              size="mini"
              @click="editDesc(scope.row.id)"
            >
              Desc
            </el-button>
            <el-button
              v-permission="['course.edit.content']"
              type="primary"
              size="mini"
              @click="editContent(scope.row.id)"
            >
              Content
            </el-button>
            <el-button
              v-permission="['course.edit.preview']"
              type="primary"
              size="mini"
              @click="preview(scope.row.id)"
            >
              preview
            </el-button>
          </el-button-group>

          <el-button-group>
            <el-button
              v-permission="['course.remove']"
              type="danger"
              size="mini"
              @click="deleteCourse(scope.row.id)"
            >
              Delete
            </el-button>
          </el-button-group>
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
      @current-change="getCourseList"
    />
  </div>
</template>


<script>
import course from '@/api/edu/course'
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
    this.getCourseList()
  },
  methods: {
    preview(id){
      this.$router.push({path: `preview/${id}`})
    },
    editDesc(id){
      this.$router.push({path: `info/${id}`})
    },
    editContent(id){
      this.$router.push({path: `content/${id}`})
    },
    handleSizeChange(val){
      this.limit = val
      this.getCourseList(this.page)

    },
    getCourseList(page = 1) {
      this.page = page
      course.getCourseList(page, this.limit, this.condition)
        .then(response => {
          this.pageInfo = response.data
          console.log(this.pageInfo)
          console.log(this.pageInfo.total)
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
