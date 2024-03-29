<template>
  <div class="app-container">
    <!-- 工具条 -->
    <div>
      <el-button
        v-permission="['banner.add']"
        type="danger"
        size="mini"
        @click="addBanner()"
      >
        Add
      </el-button>
      <el-button
        v-permission="['banner.remove']"
        type="danger"
        size="mini"
        @click="removeBannerBatch()"
      >
        Remove Batch
      </el-button>
    </div>

    <!-- banner列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="10"
      />

      <el-table-column
        label="序号"
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        label="banner"
        min-width="600"
        align="center"
      >
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img
                :src="scope.row.imageUrl"
                alt="scope.row.title"
                width="600px"
              >
            </div>
            <div class="title">
              <p href="">
                {{ scope.row.title }}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="linkUrl" label="链接" /> -->

      <el-table-column
        prop="sort"
        label="Sort"
        min-width="50"
      />

      <el-table-column
        label="Operation"
        min-width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['banner.edit']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editBanner(scope.row.id)"
          />
          <el-button
            v-permission="['banner.remove']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeBanner(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10]"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="getBannerList"
      @size-change="changeSize"
    />
  </div>
</template>

<script>
import bannerApi from '@/api/cms/banner'
import {mapGetters} from "vuex";
import permission from "@/directive/permission/permission";

export default {
  directives: {permission},
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象
      multipleSelection: [] // 批量选择中选择的记录列表
    }
  },
  computed:{
    ...mapGetters([
      'id',
      'buttons'
    ])
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.getBannerList()
  },
  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {
    console.log('list mounted......')
  },
  methods: {
    editBanner(id){
      this.$router.push({path:`/cms/banner/update/${id}`})
    },
    // 当页码发生改变的时候
    changeSize(size) {
      console.log(size)
      this.limit = size
      this.fetchData(1)
    },
    addBanner() {
      this.$router.push({ path: '/cms/banner/add' })
    },
    // 加载banner列表数据
    getBannerList(page = 1) {
      console.log('翻页。。。' + page)
      // 异步获取远程数据（ajax）
      this.page = page
      bannerApi.getPageList(this.page, this.limit).then(
        response => {
          this.list = response.data.item
          this.total = response.data.total
          // 数据加载并绑定成功
          this.listLoading = false
        }
      )
    },
    // 重置查询表单
    resetData() {
      console.log('重置查询表单')
      this.searchObj = {}
      this.fetchData()
    },
    // 根据id删除数据
    removeBanner(id) {
      // debugger
      this.$confirm('Deleting Banner, continue?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        bannerApi.removeBanner(id)
          .then((response) => {
            if (response.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getBannerList(this.page)
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      })
    },
    // 当表格复选框选项发生变化的时候触发
    handleSelectionChange(selection) {
      console.log('handleSelectionChange......')
      console.log(selection)
      this.multipleSelection = selection
    },
    // 批量删除
    removeBannerBatch() {
      console.log('removeRows......')
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的记录!'
        })
        return
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        // 遍历selection，将id取出放入id列表
        let idList = [];
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
          // console.log(idList)
        })
        // 调用api
        bannerApi.removeBanner(idList)
          .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            this.getBannerList(this.page)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      })
    }
  }
}
</script>
