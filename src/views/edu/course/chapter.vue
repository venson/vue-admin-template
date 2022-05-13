<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin: bottom 4px"
      finish-status="success"
    >
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>
    <el-button type="text" @click="dialogChapterButton()">添加章节</el-button>
    
    <!-- 章节 -->
    <ul class="chapterList" dialogChaptedialo>
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <!-- <el-button type="text">添加课时</el-button> -->
            <el-button stple="" type="text" @click="dialogAddVideo(chapter.id)"
              >添加小节</el-button
            >
            <el-button
              style=""
              type="text"
              @click="dialogEditChapter(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="removeChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="dialogEditVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
        >下一步</el-button
      >
    </div>

    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
      <el-form :model="video" label-width="120px">
        <el-form-item label="小节标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label=1>免费</el-radio>
            <el-radio :label=0>默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";
export default {
  data() {
    return {
      saveBtnDisabled: false,
      courseId: "",
      chapterVideoList: [],
      video: {
        title: "",
        id:"",
        sort: 0,
        courseId: "",
        chapterId: "",
        isFree: true,
      },
      chapter: {
        courseId: "",
        title: "",
        sort: 0,
      },
      dialogChapterFormVisible: false,
      dialogVideoFormVisible: false,
      saveVideoBtnDisabled: false,
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      console.log("courseId at start:" + this.courseId)
      this.getChapterVideo()}
  },
  methods: {
    getVideo(id){
      video.getVideo(id)
      .then(response =>{
          console.log(response)
        this.video = response.data.item
      })

    },
     //  Deleting Video by id
    deleteVideo(id){
      this.$confirm("确认删除?","提示",{
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: 'warning'}).then(response =>{
          video.deleteVideo(id).then(response=>{
          this.getChapterVideo()
          })
        })

    },
    // save or update button function
    saveOrUpdateVideo(){
      if(this.video.id){
        console.log("update")
        this.updateVideo()
      }else{
        console.log("add")
        this.addVideo()
      }
      this.dialogVideoFormVisible=false
    },

    // add
    addVideo() {
      this.video.courseId=this.courseId
      console.log(this.video)
      video.addVideo(this.video).then((response) => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "添加成功",
        });
        this.getChapterVideo();
      });
    },
    updateVideo() {

      console.log("updateVideo" +this.video)
      video.updateVideo(this.video).then((response) => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: 'success',
          message: '修改成功'
        });
        this.getChapterVideo()
      });
    },
    dialogEditVideo(id) {
      video.getVideo(id)
      .then(response => {
          this.video=response.data.item
          this.dialogVideoFormVisible = true;
        })

    },
    dialogAddVideo(id) {
          this.video={}
          this.video.chapterId = id;
          this.dialogVideoFormVisible = true;
    },
    dialogEditChapter(id) {
      chapter.getChapter(id).then((response) => {
        this.chapter = response.data.item;
        this.dialogChapterFormVisible = true;
      });
    },
    dialogChapterButton() {
      this.dialogChapterFormVisible = true;
      this.chapter = {};
    },
    getChapterVideo() {
      chapter.getChapterVideo(this.courseId).then((response) => {
        this.chapterVideoList = response.data.list;
      });
    },
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` });
    },
    removeChapter(id) {
      this.$confirm("此操作删除章节记录，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        chapter.deleteChapter(id).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getChapterVideo();
        });
      });
    },
    saveChapter() {
      this.chapter.courseId = this.courseId;
      chapter.addChapter(this.chapter).then((response) => {
        this.dialogChapterFormVisible = false;
        this.$message({
          type: "success",
          message: "添加成功",
        });
        this.getChapterVideo();
      });
    },
    updateChapter() {
      chapter.updateChapter(this.chapter).then((response) => {
        this.dialogChapterFormVisible = false;
        this.$message({
          type: "success",
          message: "修改成功",
        });
        this.getChapterVideo();
      });
    },
    saveOrUpdate() {
      if (this.chapter.id) {
        this.updateChapter();
      } else {
        this.saveChapter();
      }
    },
    next() {
      this.$router.push({ path: `/course/publish/${this.courseId}` });
    },
  },
};
</script>
<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chapterList li {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chapterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}

.chapterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
