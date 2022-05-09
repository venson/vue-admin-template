<template>
  <div class="app-container">
    教师添加

    <el-form label-width="120px">
      <el-form-item label="讲师姓名">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input v-model="teacher.sort" controls-position="right" min="0" />
      </el-form-item>
      <el-form-item label="教师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级教师" />
          <el-option :value="2" label="首席教师" />
        </el-select>
      </el-form-item>
      <el-form-item label="教师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="教师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>
      <!--avatar of teachers-->
      <el-form-item label="教师头像">

        <pan-thumb :image="teacher.avatar" />
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
        </el-button>
          <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + 'eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  components: {ImageCropper, PanThumb},
  data() {
    return {
      teacher: {
        avatar: '',
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      saveBtnDisabled: false,
      BASE_API: process.env.VUE_APP_BASE_API
    }
  },
  created() {
    console.log(this.BASE_API)

    // get the id of the teacher if the url have id
    if(this.$route.params && this.$route.params.id){
      const id = this.$route.params.id
      this.getTeacherInfoById(id)
      console.log(id)
    }
  },
  methods: {
    close(){
      this.imagecropperShow = false

    },
    cropSuccess(data){
      this.close(),
      this.teacher.avatar = data.url

    },
    // get the teacher infomation by id
    getTeacherInfoById(id){
      teacherApi.getTeacherInfoById(id)
      .then(response =>{
          this.teacher = response.data.teacher
        })
    },

    // save or update teacher infomation
    saveOrUpdate() {
      if (!this.teacher.id ){
      this.saveTeacher();
      }else{
        this.updateTeacherInfo()
      }
    },
    updateTeacherInfo(){
      teacherApi.updateTeacher(this.teacher)
      .then(response =>{
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.$router.push({path: '/teacher/list'})
        })
    },

  // save teacher infomation
    saveTeacher() {
      teacherApi.addTeacher(this.teacher).then((response) => {
        this.$message({
          type: "success",
          message: "添加成功",
        });
        this.$router.push({ path: "/teacher/list" })
      })
    }
  }
}
</script>
