<template>
  <el-container
    class="app-container"
    height="800px"
  >
    <el-header height="500px">
      <h2 style="text-align: center">
        New Course
      </h2>
      <el-steps
        :active="3"
        process-status="wait"
        align-center
        style="margin: bottom 4px"
        finish-status="success"
      >
        <el-step title="Course Base Info" />
        <el-step title="Edit Course" />
        <el-step title="Publish" />
      </el-steps>

      <div class="ccInfo">
        <img :src="coursePublish.cover">
        <div class="main">
          <h2> {{ coursePublish.title }} </h2>
          <p class="gray">
            <span>共{{ coursePublish.lessonNum }}课时</span>
          </p>
          <p><span>所属分类: {{ coursePublish.topSubject }} - {{ coursePublish.levelISubject }}</span></p>
        </div>
        <div>
          <el-button @click="previous">
            返回修改
          </el-button>
          <el-button
            :disable="saveBtnDisabled"
            type="primary"
            @click="publish()"
          >
            发布课程
          </el-button>
        </div>
      </div>
    </el-header>
    <el-container height="700px">
      <el-aside width="260px">
        <el-tree
          :data="chapterSectionList" 
          node-key="id"
          default-expand-all
          :props="props"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <span
            slot-scope="{ node}"
            class="custom-tree-node"
            style="width:200px;height:28px"
          >
            <span style="display:inline-block"> {{ node.label }}</span>
          </span>
        </el-tree>
      </el-aside>
      <el-main>
        <!-- <el-container > -->
        <!-- <el-header height="400px" v-if="current.src"> -->
        <iframe
          v-if="current.src" 
          :src="current.src"
          scrolling="no" 
          border="0"
          frameborder="no" 
          framespacing="0"
          allowfullscreen="true"
          style="height:500px;width:100%"
        />
        <!-- </el-header> -->
        <!-- <el-main > -->
      
        <!-- Markdown editor -->
        <v-md-preview
          :text="current.content"
          height="800px"
        />
      <!-- </el-main> -->
      <!-- </el-container> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import course from '@/api/edu/course';
import chapterApi from '@/api/edu/chapter'
import contentApi from '@/api/edu/content'
import sectionApi from '@/api/edu/section'
export default {
  data() {
    return {
      srcReg: /src\s*=\s*"(.+?)"/,
      props: {
        label: 'title',
        isLeaf: 'isLeaf'
      },
      coursePublish: {
      },
      current:{
        content: '',
        videoLink: '',
        src: ''
      },

      saveBtnDisabled: false,
      courseId: "",
      chapterSectionList: [],
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getCourseInfo()
      this.getChapterSection()
    }
  },
  methods: {
    handleNodeClick(data,node){
      console.log(data)
      console.log("node")
      console.log(node)
      if (node.level ===1){
        this.getChapter(node.data.id)
        this.getChapterContent(node.data.id)
      }else{
        this.getSection(node.data.id)
        this.getSectionContent(node.data.id)
      }

    },

    getSectionContent(id) {
      // debugger
      return Promise.resolve(
        contentApi.getSectionContent(id)
          .then(response => {
            if (response.data.item) {
              this.current.content = response.data.item.content
              this.content = response.data.item
              console.log("content")
              console.log(this.content)
            } else {
              this.current.content = "<h3>No Content available, edit right now</h3>"
            }
          }))

    },
    // get the content for the chapter by id
    getChapterContent(id) {
        contentApi.getChapterContent(id)
          .then(response => {
            if (response.data.item) {
              this.current.content = response.data.item.content
              this.content = response.data.item
              console.log("content")
              console.log(this.content)
            } else {
              this.current.content = "<h3>No Content available, edit right now</h3>"
            }
          })
    },
    // get chapter section for tree display
    getChapterSection() {
      chapterApi.getChapterSection(this.courseId).then((response) => {
        this.chapterSectionList = response.data.list;
        console.log(this.chapterSectionList)
      });
    },

    getSection(id) {
        sectionApi.getSection(id)
          .then(response => {
            // const reg = /src="(.+?)"/
            this.section = response.data.item;
            this.current.title = this.section.title
            this.current.sort = this.section.sort
            this.current.videoLink = this.section.videoLink
            this.current.src = this.current.videoLink.match(this.srcReg)[1]
            console.log("print current")
            console.log(this.current)
            // console.log(this.current.videoLink)
            // console.log(reg.match(this.current.videoLink))
            // console.log(this.current.videoLink.match(reg))
          })

    },
    getChapter(id) {
        chapterApi.getChapter(id)
          .then(response => {
            this.chapter = response.data.item;
            this.current.title = this.chapter.title
            this.current.sort = this.chapter.sort
            this.current.videoLink = ''
            this.current.src=''
            console.log(this.current)
          })
    },
    getCourseInfo() {
      course.getPublishCourseInfo(this.courseId)
        .then(response => {
          console.log(response.data.item)
          this.coursePublish = response.data.item
        })
    },
    previous() {
      this.$router.push({ path: `/course/chapter/${this.courseId}` })
    },
    publish() {
      course.publishCourse(this.courseId)
        .then(() => {
          this.$message({
            type: 'success',
            message: "发布成功"
          })
          this.$router.push({ path: `/course/list` })
        })
    },
  },
};
</script>
<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #DDD;
  margin-bottom: 40px;
  position: relative;
}

.ccInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}

.ccInfo .main {
  margin-left: 520px;
}

.ccInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>
