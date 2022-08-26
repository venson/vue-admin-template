<template>
  <el-container
    class="app-container"
  >
    <el-header height="70px">
      <div class="ccInfo">
        <img
          :src="course.cover"
          alt="img can not find"
        >
        <div class="main">
          <h2> {{ course.title }} </h2>
          <span>共{{ course.totalHour }}课时</span> <span>所属分类: {{ course.topSubject }} - {{ course.levelISubject }}</span>
        </div>
        <div style="float: right">
          <el-button
            v-permission="['course.review.pass']"
            type="success"
            @click="passAllReviewDialog"
          >
            Pass All
          </el-button>
          <el-button
            v-permission="['course.review.reject']"
            type="danger"
            @click="rejectAllReviewDialog"
          >
            Reject All
          </el-button>
        </div>
      </div>
    </el-header>
    <el-container>
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
            :class="data.isRemoveAfterReview === true ? 'custom-tree-node-line': 'custom-tree-node'"
            style="width:100%;height:45px"
          >
            <span style="display:block"> {{ node.label }}</span>
            <el-tag
              v-if="data.review==='NONE'"
              type=""
              alt="new content"
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
              type="warning"
              size="mini"
              effect="dark"
            >Applied</el-tag>
            <el-tag
              v-if="data.review ==='FINISHED'"
              type="success"
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
        <el-container
          v-if="previewContent.videoLink"
          class="bilibili-frame"
        >
          <iframe
            :src="previewContent.videoLink"
            scrolling="no"
            border="0"
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
            style="height:100%;width:100%"
          />
        </el-container>
        <el-container>
          <el-main class="md-frame">
            <v-md-preview
              :text="previewContent.markdown.markdown"
              height="100%"
            />
            <span
              v-if="previewContent.review === 'APPLIED'"
              style="float: right"
            >
              <el-button
                v-permission="['course.review.pass']"
                type="success"
                size="mini"
                @click="passReviewDialog"
              >
                Pass
              </el-button>
              <el-button
                v-permission="['course.review.reject']"
                type="danger"
                size="mini"
                @click="rejectReviewDialog"
              >
                Reject
              </el-button>

            </span>
            <div>
              <el-table
                v-if="reviewList.length !==0"
                :data="reviewList"
                style="width:100%"
              >
                <el-table-column type="expand">
                  <template
                    slot-scope="props"
                  >
                    <div class="requestMsg">
                      <p
                        v-for="(msg,index) in props.row.requestMsg"
                        :key="index"
                      >
                        {{ msg }}
                      </p>
                    </div>
                    <div class="reviewMsg">
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
          </el-main>
        </el-container>
        <!--        bilibili video link-->
        <!-- </el-header> -->
        <!-- <el-main > -->

        <!-- Markdown editor -->
        <!-- </el-main> -->
        <!-- </el-container> -->
      </el-main>
    </el-container>
    <el-dialog
      :title="dialogWindowTitle"
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
          @click="dialogConfirm"
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
      dialogWindowTitle:'',
      dialogOpt: '',
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

    passAll(){
      reviewApi.passReviewByCourseId(this.courseId,this.reviewApplyVo)
      .then(()=>{
        this.$message.success('All Reviews are passed')
      })
    },
    rejectAll(){
      reviewApi.rejectReviewByCourseId(this.courseId,this.reviewApplyVo)
        .then(()=>{
          this.$message.success('All Reviews are rejected')
        })
    },

    dialogConfirm(){
      this.$confirm('Confirm?','Prompt',{
        confirmButtonText:'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(()=>{
        switch(this.dialogOpt){
         case "pass": this.passReview()
            break
          case "reject": this.rejectReview()
            break
          case "passAll": this.passAll()
            break
          case "rejectAll": this.rejectAll()
            break
        }
      }).then(()=>{
        this.dialogReviewVisible = false
        this.getTreeNode()
      })
      },
    passReview(){
      debugger
      console.log("pass review")
      if(this.dialogType ==='chapter'){
        reviewApi.passReviewByChapterId(this.previewContent.id, this.reviewApplyVo)
          .then(()=>{
            this.$message.success('Review passed')
          })
      }else if(this.dialogType ==='section'){
        reviewApi.passReviewBySectionId(this.previewContent.id, this.reviewApplyVo)
          .then(()=>{
            this.$message.success('Review passed')
          })
      }
    },

    rejectReview(){
      console.log("reject review")
      if(this.dialogType ==='chapter'){
        reviewApi.rejectReviewByChapterId(this.previewContent.id, this.reviewApplyVo)
          .then(()=>{
            this.$message.success('Review rejected success')
          })
      }else if(this.dialogType ==='section'){
        reviewApi.rejectReviewBySectionId(this.previewContent.id, this.reviewApplyVo)
          .then(()=>{
            this.$message.success('Review rejected success')
          })
      }
    },
    reviewCancel(){
      this.dialogReviewVisible = false;
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
          console.log('reviewList')
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
    passReviewDialog(){
      if(this.previewContent.review !=='APPLIED'){
        this.$message({
          type: 'error',
          message: 'not applied yet'
        })
        return
      }else{
        this.dialogWindowTitle = 'Pass review'
        this.dialogTitle = 'Pass review about ' + this.previewContent.title
        this.dialogOpt = 'pass'
        this.dialogReviewVisible = true;
      }
    },
    rejectReviewDialog(){
      this.dialogReviewVisible=false
    },

    passAllReviewDialog(){
        this.dialogWindowTitle  = 'Pass all reviews'
        this.dialogTitle = 'Pass all Reviews about ' + this.course.title
        this.dialogOpt = 'passAll'
        this.dialogReviewVisible = true;
    },
    rejectAllReviewDialog(){
      this.dialogWindowTitle  = 'Reject all reviews'
      this.dialogTitle = 'Reject all reviews about ' + this.course.title
        this.dialogOpt = 'rejectAll'
        this.dialogReviewVisible = true;
    },
    previous() {
      this.$router.push({ path: `/course/content/${this.courseId}` })
    },
  },
};
</script>
<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 5px;
  overflow: hidden;
  border: 1px dashed #DDD;
  margin-bottom: 5px;
  position: relative;
}

.ccInfo img {
  background: #d6d6d6;
  width: 75px;
  height: 50px;
  display: block;
  float: left;
  border: none;
}

.ccInfo .main {
  margin-left: 70px;
  float:left;
}

.ccInfo .main h2 {
  font-size: 16px;
  margin-bottom: 5px;
  line-height: 1;
  font-weight: normal;
}

.ccInfo .main p {
  margin-bottom: 5px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 30px;
  overflow: hidden;
}

.ccInfo .main p {
  margin-bottom: 5px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 30px;
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
.custom-tree-node-line{
  text-decoration: line-through;
}
.bilibili-frame{
  height:400px !important;
}
.md-frame{
  height:50vh;
}
</style>
