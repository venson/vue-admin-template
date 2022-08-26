<template>
  <div class="app-container">
    教师列表
    <el-form
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <el-input
          v-model="memberQuery.name"
          placeholder="讲师名"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="memberQuery.level"
          clearable
          placeholder="职位"
        >
          <el-option
            label="高级讲师"
            value="1"
          />
          <el-option
            label="首席讲师"
            value="2"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="memberQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-form-item label="截止时间">
        <el-date-picker
          v-model="memberQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getList()"
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
      :data="memberList.records"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="名称"
        width="180"
      />
      <el-table-column
        label="职位"
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.level === 1? '高级讲师':'首席讲师' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="intro"
        label="资历"
        width="180"
      />
      <el-table-column
        prop="gmtCreate"
        label="加入时间"
        width="180"
      />
      <el-table-column
        prop="sort"
        label="排序"
        width="60"
      />
      <el-table-column
        label="操作"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <router-link :to="'/member/save/' + scope.row.id">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            >
              修改
            </el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeMemberById(scope.row.id)"
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
      :page-sizes="[5,10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getList"
    />
  </div>
</template>

<script>
import member from '@/api/edu/member.js'
export default{
  // data:{

  // },
  data() {
    return {
      memberList: {
        records: [],
      },
      page:1,
      limit: 5,
      total: 0,
      memberQuery:{}
    }
  },
  created() {
    this.getList()

  },
  methods:{
    handleSizeChange(val){
      this.limit = val
      this.getList(this.page)
    },
    getList(page=1){
      this.page=page
      member.getMemberListPage(this.page,this.limit, this.memberQuery)
      .then(response => {
        // console.log(response)
          console.log("=======")
          this.memberList= response.data


      })
      .catch(error => {console.log(error)})
    },
    resetData(){
      this.memberQuery={}
      this.getList()
    },
    removeMemberById(id){

        this.$confirm('此操作将删除讲师的记录,是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            member.deleteMemberById(id)
            .then(() => {
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
