<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <!--查询表单-->
    <el-form
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <el-input
          v-model="searchObj.username"
          placeholder="用户名"
        />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="fetchPageAclUserList()"
      >
        查询
      </el-button>
      <el-button
        type="default"
        @click="resetData()"
      >
        清空
      </el-button>
    </el-form>

    <!-- 工具条 -->
    <div>
      <el-button
        v-if="hasPerm('user.add')"
        type="danger"
        size="mini"
        @click="addUser()"
      >
        添加
      </el-button>
      <el-button
        v-if="hasPerm('user.remove')"
        type="danger"
        size="mini"
        @click="removeRows()"
      >
        批量删除
      </el-button>
    </div>

    <!-- 讲师列表 -->
    <el-table
      v-loading="listLoading"
      :data="aclUserPage.records"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
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
        prop="username"
        label="用户名"
        width="150"
      />

      <el-table-column
        prop="nickName"
        label="用户昵称"
      />

      <el-table-column
        prop="gmtCreate"
        label="创建时间"
        width="180"
      />

      <el-table-column
        label="操作"
        width="230"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-if="hasPerm('user.edit')"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editUserById(scope.row.id)"
          />
          <el-button
            v-if="hasPerm('user.remove')"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="aclUserPage.current"
      :total="aclUserPage.total"
      :page-size="limit"
      :page-sizes="[5, 10, 20]"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchPageAclUserList"
      @size-change="changeSize"
    />

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
    >
      <el-form
        ref="user"
        :model="user"
        :rules="validateRules"
        label-width="120px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item
          label="姓名"
          prop="nickName"
        >
          <el-input v-model="user.nickName" />
        </el-form-item>

        <el-form-item
          label="e-mail"
          prop="eMail"
        >
          <el-input v-model="user.email" />
        </el-form-item>
        <el-form-item
          label="密码"
        >
          <el-button
            v-if="dialogType==='EDIT'"
            type="danger"
            @click="resetPassword"
          >
            Reset Password
          </el-button>
          <el-input
            v-else-if="dialogType==='NEW'"
            v-model="user.password"
          />
        </el-form-item>
      </el-form>
      <el-checkbox
        v-model="roleCheckAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >
        全选
      </el-checkbox>
      <div style="margin: 15px 0;" />
      <el-checkbox-group
        v-model="checkedRoles"
        @change="handleCheckedRolesChange"
      >
        <el-checkbox
          v-for="role in roleList"
          :key="role.id"
          :label="role.id"
        >
          {{ role.roleName }}
        </el-checkbox>
      </el-checkbox-group>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditCancel">Cancel</el-button>
        <el-button
          type="primary"
          @click="dialogEditSave"
        >Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/acl/user";
import {mapGetters} from "vuex";
import permission from "@/directive/permission/permission";

const validatePass = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('密码不能小于6位'))
  } else {
    callback()
  }
}
export default {
  directives: {permission},
  data() {
    return {
      allRoleList: [],
      validateRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名必须输入' }],
        nickName: [{ required: true, trigger: 'blur', message: '用户名必须输入' }],
        eMail: [{ required: true, trigger: 'blur', message:'e-mail必须输入',validator: validatePass }]
      },
      user:{},
      roleCheckAll: false,
      checkedRoles: [], //已选中
      roleList: [], //所有的
      isIndeterminate: true,
      dialogVisible: false,
      dialogTitle: '',
      dialogType: 'EDIT',

      listLoading: true, // 数据是否正在加载
      aclUserPage: {
        records: [],
        current: 0,
        total:0,
      }, // 讲师列表
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象
      multipleSelection: [] // 批量选择中选择的记录列表
    }
  },
  computed:{
    ...mapGetters([
      'id',
      'name',
    ])

  },

  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    console.log('list created......')
    this.fetchPageAclUserList()
    this.getAllRoleList()
  },

  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {
    console.log('list mounted......')
  },

  methods: {
    resetPassword(){
      userApi.resetPassword(this.user)
    },
    editUserById(id){
      this.getRoleListById(id)
      this.fetchUserById(id)
      this.dialogTitle='Edit User'
      this.dialogVisible=true
      this.dialogType='EDIT'
    },
    fetchUserById(id) {
      userApi.getById(id).then(response => {
        this.user = response.data.item
      })
    },
    getRoleListById(userId){
      userApi.getAssign(userId).then(response => {
        console.log("roles")
        console.log(response)
        let jsonObj = response.data.assignRoles
        this.checkedRoles = this.getJsonToList(jsonObj,"id")
        this.roleList= response.data.allRolesList
        console.log(this.checkedRoles)
      })
    },
    getAllRoleList(){
      userApi.getAssign(1).then(response => {
        console.log("roles")
        this.allRoleList= response.data.allRolesList
        console.log(this.checkedRoles)
      })
    },
    //把json数据转成string再转成对象，根据Key获取value数据
    getJsonToList(json,key){

      //把JSON字符串转成对象
      let list = JSON.parse(JSON.stringify(json));
      let strText = []
      //遍历这个集合对象，获取key的值
      for(let i = 0; i < list.length; i++){
        strText.push(list[i][key])
      }
      return strText;

    },
    handleCheckAllChange(val) {
      this.checkedRoles = val ? this.roleList : [];
      this.isIndeterminate = false;
      this.saveBtnDisabled = false;
    },
    handleCheckedRolesChange(value) {

      this.saveBtnDisabled = false;
      let checkedCount = value.length;
      this.roleCheckAll = checkedCount === this.roleList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length;
    },
    update(){
      //修改权限
      userApi.updateById(this.user).then(response => {
        if (response.success) {
          this.$message({
            type: 'success',
            message: response.message
          })
        }
      })
    },
    save(){
      userApi.save(this.user).then(response => {
        if (response.success) {
          this.$message({
            type: 'success',
            message: response.message
          })
        }
      })
    },
    dialogEditSave(){
      if(this.checkedRoles.length===0){
        this.$message.error("No Role for user")
        return
      }
      this.saveBtnDisabled = true // 防止表单重复提交
      switch (this.dialogType){
        case 'EDIT':
          this.update()
          break
        case 'NEW':
          this.save()
          break
      }

      let ids = this.checkedRoles.join(",")
      console.log(ids)
      userApi.saveAssign(this.user.id, ids).then(response => {
        if(response.success){
          this.$message({
            type:'success',
            message:'Role 保存成功'
          })
        }
      })

    },
    dialogEditCancel(){
      this.dialogVisible = false
    },

    // 当页码发生改变的时候
    changeSize(size) {
      console.log(size)
      this.limit = size
      this.fetchPageAclUserList(1)
    },

    addUser(){
      this.dialogTitle="Add New User"
      this.user.username=''
      this.user.nickName=''
      this.user.eMail=''
      this.roleList = this.allRoleList
      this.checkedRoles = []
      this.dialogType='NEW'
      this.dialogVisible=true


    },

    fetchPageAclUserList(page = 1) {
      console.log('翻页。。。' + page)
      // 异步获取远程数据（ajax）
      this.page = page

      userApi.getPageList(this.page, this.limit, this.searchObj).then(
        response => {
          this.aclUserPage = response.data

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
    removeDataById(id) {
      // debugger
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return userApi.removeById(id)
      }).then((response) => {
        this.fetchData(this.page)
        if (response.success) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
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
    removeRows() {
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
        var idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        // console.log(idList)
        })
        // 调用api
        return userApi.removeRows(idList)
      }).then((response) => {
        this.fetchData(this.page)
        if (response.success) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 执行搜索
    // queryString：文本框中输入的值
    // cb：一个函数
    querySearch(queryString, cb) {
      console.log(queryString)
      console.log(cb)

    }
  }
}
</script>


