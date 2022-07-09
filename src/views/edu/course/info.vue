<template>
  <div class="app-container">
    <h2 style="text-align: center">
      发布新课程
    </h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin: bottom 4px"
      finish-status="success"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>
      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="getLevelISubjectList"
        >
          <el-option
            v-for="subject in topSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="请选择"
        >
          <el-option
            v-for="subject in levelISubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课程讲师 TODO -->
      <el-form-item label="课程教师">
        <el-select
          v-model="courseInfo.memberId"
          placeholder="请选择"
        >
          <el-option
            v-for="member in memberList"
            :key="member.id"
            :label="member.name"
            :value="member.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number
          v-model="courseInfo.lessonNum"
          :min="0"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>
      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <el-input
          v-model="courseInfo.description"
          placeholder=" 示例："
        />
        <div id="editor">
          <v-md-editor
            v-model="courseInfo.description"
            height="500px"
          />
          <!-- <mavon-editor v-model="courseInfo.description" /> -->
        </div>
      </el-form-item>
      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img
            v-if="courseInfo.cover"
            :src="courseInfo.cover"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          />
        </el-upload>
      </el-form-item>

      <!-- <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item> -->
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="next"
        >
          保存并下一步
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
// import { mavonEditor } from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// import MarkdownItVue from 'markdown-it-vue'
// import 'markdown-it-vue/dist/markdown-it-vue.css'
// import '@toast-ui/editor/dist/toastui-editor.css';
// import { Editor } from '@toast-ui/vue-editor';
// import '@toast-ui/editor/dist/toastui-editor-viewer.css';
// import { Viewer } from '@toast-ui/vue-editor';
// import MarkdownEditor from '@/components/MarkdownEditor'

// import MarkdownEditor from '@/components/MarkdownEditor'

// import mermaid from 'mermaid'
// mermaid.initialize({startOnload:false})

export default {
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        subjectId: '',
        subjectParentId: '',
        memberId: '',
        lessonNum: '',
        description: '',
        cover: '',
        price: 0
      },
      courseId: '',
      memberList: [],
      topSubjectList: [],
      levelISubjectList: [],
      // eslint-disable-next-line no-undef
      BASE_API: process.env.VUE_APP_BASE_API
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getInfo()

      // console.log(this.courseInfo)
    } else {
      this.getTopSubject()
      this.getMemberList()
    }
    // console.log(this.courseInfo.description)
    // console.log(this.viewerText)
  },
  methods: {
    updateCouseInfo() {
      course.updateCouseInfo(this.courseInfo)
    },

    getInfo() {
      course.getCourseInfo(this.courseId).then((response) => {
        this.courseInfo = response.data.course
        // console.log("getInfo courseInfo")
        // console.log(this.courseInfo)
        subject.getSubjectList().then((response) => {
          this.topSubjectList = response.data.list
          // console.log(this.topSubjectList)
          for (let i = 0; i < this.topSubjectList.length; i++) {
            const topSubject = this.topSubjectList[i]
            if (topSubject.id === this.courseInfo.subjectParentId) {
              this.levelISubjectList = topSubject.children
            }
          }
          this.getMemberList()
        })
      })
    },
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头图片只能是JPG格式')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过2MB')
      }
      return isJPG && isLt2M
    },
    getLevelISubjectList(value) {
      // console.log(value);
      for (let i = 0; i < this.topSubjectList.length; i++) {
        if (this.topSubjectList[i].id === value) {
          this.levelISubjectList = this.topSubjectList[i].children
          this.courseInfo.subjectId = this.levelISubjectList[0].id
          break
        }
      }
      // console.log(this.levelISubjectList);
    },
    getTopSubject() {
      subject.getSubjectList().then((response) => {
        this.topSubjectList = response.data.list
      })
    },
    getMemberList() {
      course.getMemberList().then((response) => {
        this.memberList = response.data.items
      })
    },
    next() {
      if (this.courseInfo.id) {
        this.updateCourse()
      } else {
        this.addCourse()
      }
    },
    addCourse() {
      course.addCourseInfo(this.courseInfo).then((response) => {
        // console.log(this.courseInfo)
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.$router.push({
          path: '/course/chapter/' + response.data.courseId
        })
      })
    },
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then((response) => {
        // console.log(this.courseInfo)
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.$router.push({
          path: '/course/chapter/' + this.courseId
        })
      })
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/upload.scss";
</style>
<style scoped>
.tinymce-container {
  line-height: 29px;
}

#editor {
  margin: auto;
  width: 100%;
  /* height: 580px; */
}

.tui-editor .te-md-splitter {
  display: none;
  position: absolute;
  left: 50%;
  top: 0;
  height: 100%;
  /* width: 1px; */
  width: 100%;
  border-left: 1px solid #e5e5e5;
}
</style>
