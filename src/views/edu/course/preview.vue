<template>
  <el-container
    class="app-container"
    height="800px"
  >
    <el-header height="350px">
      <h2 style="text-align: center">
        New Course
      </h2>

      <el-steps
        :active="3"
        process-status="wait"
        align-center
        style="margin-bottom: 4px"
        finish-status="success"
      >
        <el-step
          title="Course Base Info"
          @click.native="stepOne"
        />
        <el-step
          title="Edit Course"
          @click.native="stepTwo"
        />
        <el-step
          title="Preview"
          @click.native="stepThree"
        />
      </el-steps>
      <div class="ccInfo">
        <img
          :src="course.cover"
          alt="img can not find"
        >
        <div class="main">
          <h2> {{ course.title }} </h2>
          <p class="gray">
            <span>共{{ course.totalHour }}课时</span>
          </p>
          <p><span>所属分类: {{ course.topSubject }} - {{ course.levelISubject }}</span></p>
        </div>
        <el-button
          type="warning"
          size="mini"
          class="m_5"
          @click="requestReviewByCourseId"
        >
          Review for Course
        </el-button>
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
            slot-scope="{ node, data}"
            class="custom-tree-node"
            style="width:100%;height:45px"
          >
            <span style="display:block"> {{ node.label }}</span>
            <el-tag
              v-if="data.review==='NONE'"
              type="primary"
              size="mini"
              effect="dark"
            >New</el-tag>
            <el-tag
              v-if="data.review ==='REJECTED'"
              type="danger"
              size="mini"
              effect="dark"
            >Rejected</el-tag>
            <el-tag
              v-if="data.review ==='APPLIED'"
              type="danger"
              size="mini"
              effect="dark"
            >Applied</el-tag>
            <el-tag
              v-if="data.review ==='FINISHED'"
              type="danger"
              size="mini"
              effect="dark"
            >Reviewed</el-tag>
            <el-tag
              v-if="data.isPublished ===true"
              type="danger"
              size="mini"
              effect="dark"
            >Published</el-tag>
            <el-tag
              v-if="data.isModified ===true"
              type="danger"
              size="mini"
              effect="dark"
            >Modified</el-tag>
          </span>
        </el-tree>
      </el-aside>
      <el-main>
        <span
          v-if="previewContent.id!==''"
          style=""
        >
          <el-button
            v-if="(previewContent.isModified === true) || (previewContent.review ==='NONE')"
            v-permission="['course.review.request']"
            type="success"
            class="m_5"
            size="mini"
            @click="requestReviewDialog(previewContent)"
          >
            <!--                v-if="(node.isModified === false) || (node.review ==='NONE')"-->
            Request Review
          </el-button>
          <!--          /TODO need implement-->
          <el-button
            v-if="false && previewContent.review === 'APPLIED'"
            type="danger"
            size="mini"
            class="m_5"
            @click="withDrawReviewDialog(previewContent)"
          >
            Withdraw Review
          </el-button>

        </span>
        <iframe
          v-if="previewContent.videoLink"
          :src="previewContent.videoLink"
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
          :text="previewContent.markdown.markdown"
          height="800px"
        />
        <div>
          <el-table
            :data="reviewList"
            style="width:100%"
          >
            <el-table-column type="expand">
              <template
                slot-scope="props"
              >
                <div class="requestMsg">
                  <p>Request Message</p>
                  <p
                    v-for="(msg,index) in props.row.requestMsg"
                    :key="index"
                  >
                    {{ msg }}
                  </p>
                </div>
                <div class="reviewMsg">
                  <p>Review Message</p>
                  <p
                    v-for="(msg,index) in props.row.reviewMsg"
                    :key="index"
                  >
                    {{ msg }}
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="Date"
              prop="gmtCreate"
            />
            <el-table-column
              label="Status"
              prop="status"
            />
          </el-table>
        </div>
      <!-- </el-main> -->
      <!-- </el-container> -->
      </el-main>
    </el-container>
    <el-dialog
      title="Request Review"
      :visible.sync="dialogReviewVisible"
    >
      <span>{{ dialogTitle }}</span>
      <el-form :model="reviewApplyVo">
        <el-form-item
          label="Message"
          label-width="200"
        >
          <el-input
            v-model="reviewApplyVo.msg"
            type="textarea"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="reviewCancel">Cancel</el-button>
        <el-button
          type="primary"
          @click="reviewConfirm"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import courseApi from '@/api/edu/course';
import chapterApi from '@/api/edu/chapter'
import sectionApi from '@/api/edu/section'
import contentApi from '@/api/edu/content'
import reviewApi from '@/api/edu/review'
import permission from "@/directive/permission/permission";
import {mapGetters} from "vuex";

export default {
  directives: { permission },

  data() {
    return {
      dialogType: '',
      dialogTitle:'',
      dialogReviewVisible: false,
      srcReg: /src\s*=\s*"(.+?)"/,
      props: {
        label: 'title',
        isLeaf: 'isLeaf'
      },
      previewContent:{
        id: '',
        review:'',
        isModified: false,
        markdown: {markdown: ''}
      },
      reviewApplyVo:{
        msg: '',
        courseId: '',
        id: '',
        name: '',

      },

      course: {
        cover:'',
        totalHour:'',
        title: '',
      },
      reviewList:[],
      saveBtnDisabled: false,
      courseId: "",
      chapterSectionList: [{
        id: '',
        title: '',
        isLeaf: '',
        children: [],
      }],
    };
  },
  computed:{
    ...mapGetters([
      'name',
      'id',
      'buttons'
    ])
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getTreeNode()
      this.getCoursePreview()
      this.reviewApplyVo.id = this.id
      this.reviewApplyVo.name = this.name
      this.reviewApplyVo.courseId = this.courseId
      console.log(this.reviewApplyVo)
    }
  },
  methods: {
    requestReviewByCourseId(){
      this.$confirm('Request review for the Course?','prompt',{
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }).then(()=>{
        this.dialogType='course'
        this.dialogTitle=this.course.title
        this.dialogReviewVisible = true
      })

    },
    stepOne(){
      this.$router.push({path: `/course/info/${this.courseId}`})
    },
    stepTwo(){
      this.$router.push({path: `/course/content/${this.courseId}`})
    },
    stepThree(){
      this.$router.push({path: `/course/preview/${this.courseId}`})
    },
    reviewConfirm(){
      console.log("apply chapter")
      if(this.dialogType ==='chapter'){
        reviewApi.requestReviewByChapterId(this.previewContent.id, this.reviewApplyVo)
          .then(()=>{
            this.$message.success('Review Applied success')
            this.dialogReviewVisible =false
            this.getTreeNode()
          })
      }else if(this.dialogType ==='section'){
          reviewApi.requestReviewBySectionId(this.previewContent.id, this.reviewApplyVo)
            .then(()=>{
              this.$message.success('Review Applied success')
              this.dialogReviewVisible =false
              this.getTreeNode()
            })
    }else if(this.dialogType ==='course'){
        reviewApi.requestReviewByCourseId(this.courseId,this.reviewApplyVo)
          .then(()=>{
            this.$message({
              type: 'success',
              message: 'Request success'
            })
          })
      }
      this.dialogReviewVisible=false
  },

    reviewCancel(){
      this.dialogReviewVisible=false
    },
    getTreeNode() {
      contentApi.getTreeNode(this.courseId).then((response) => {
        this.chapterSectionList = response.data.tree;
        // console.log(this.chapterSectionList)
      })
    },

    getCoursePreview(){
      courseApi.getCoursePreviewInfo(this.courseId)
      .then(response =>{
        console.log(response)
        this.course = response.data.item
        // console.log(this.course)
      })
    },

    handleNodeClick(data,node){
      console.log(data)
      console.log("node")
      console.log(node)
      if (node.level ===1){
        this.getChapterById(node.data.id)
      }else{
        this.getSectionById(node.data.id)
      }

    },


    getSectionById(id) {
        sectionApi.getSectionById(id)
          .then(response => {
            // const reg = /src="(.+?)"/
            this.section = response.data.item;
            let videoLink = this.section.videoLink
            if(videoLink.indexOf('iframe')!==-1){
              this.section.videoLink = this.section.videoLink.match(this.srcReg)[1]
            }
            this.previewContent = this.section;
            this.dialogType = 'section'
            // console.log(this.previewContent)
          })
      reviewApi.getReviewListBySectionId(id)
        .then(response=>{
          this.reviewList = response.data.item;
          console.log(response)
          console.log(this.reviewList)
          this.reviewList.forEach(o=>{
            if(o.requestMsg!==null){
              o.requestMsg = o.requestMsg.split('/?newMsg?/')
            }
            if(o.reviewMsg!==null){
              o.reviewMsg = o.reviewMsg.split('/?newMsg?/')
            }
          })
          console.log(this.reviewList)
        })

    },
    getChapterById(id) {
        chapterApi.getChapterById(id)
          .then(response => {
            this.chapter = response.data.item;
            this.previewContent = this.chapter;
            this.dialogType = 'chapter'
          })
        reviewApi.getReviewListByChapterId(id)
      .then(response=>{
        this.reviewList = response.data.item;
        this.reviewList.forEach(o=>{
          o.requestMsg = o.requestMsg.split('/?newMsg?/')
          o.reviewMsg = o.reviewMsg.split('/?newMsg?/')
        })
      })
    },
    requestReviewDialog(previewContent){
      if(this.dialogType ==='course'){
        this.dialogReviewVisible = true;
        this.dialogTitle = this.title
      }
      if(previewContent.review ==='APPLIED'){
        this.$message({
          type: 'error',
          message: 'Already under review'
        })
        return
      }
      if(previewContent.review ==='FINISHED' && !previewContent.isModified){
        this.$message({
          type: 'error',
          message: 'No modification since publish'
        })
        return
      }
      this.dialogReviewVisible = true;
      this.dialogTitle = previewContent.title
    },
    withDrawReviewDialog(){},

    previous() {
      this.$router.push({ path: `/course/content/${this.courseId}` })
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
  width: 225px;
  height: 150px;
  display: block;
  float: left;
  border: none;
}

.ccInfo .main {
  margin-left: 240px;
}

.ccInfo .main h2 {
  font-size: 20px;
  margin-bottom: 10px;
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
.m_5{
  margin: 5px;
}

::v-deep .el-tree-node__content{
  height: 45px !important;
}

.contentMarker  {
  float: left;
  padding-left: 3px;
  padding-right: 3px;
  font-size: 14px;
  padding-top: 2px;
}
.c_r{
  color:red;
}
.c_g{
  color:green;
}
.c_y{
  color:darkorange;
}

.sectionList p {
  float: left;
  font-size: 12px;
  margin: 5px 0;
  padding: 5px;
  height: 70px;
  /* line-height: 30px; */
  width: 100%;
  border: 1px dotted #ddd;
}
.requestMsg{
  float:left;
  width: 50%;
}

.reviewMsg{
  float:right;
  width: 50%;
}
</style>
