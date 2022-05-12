<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin: bottom 4px" finish-status="success">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>

    <ul>
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        {{ chapter.title }}
        <ul>
          <li v-for="video in chapter.children" :key="video.id">
            {{ video.title }}
          </li>
        </ul>
      </li>
    </ul>

    <el-button type="text" @click="dialogChapterFormVisible = true">添加章节</el-button>
    
    <!-- 章节 -->
    <ul class="chapterList" dialogChaptedialo>
      <li v-for="chapter in chapterNestedList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text">添加课时</el-button>
            <el-button style="" type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="text">编辑</el-button>
                <el-button type="text">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>


    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
export default {
  data() {
    return {
      saveBtnDisabled: false,
      courseId: "",
      chapterVideoList: [],
      chapter: {

      },
      dialogChapterFormVisible: false
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      console.log(this.courseId)
    }
    this.getChapterVideo()
  },
  methods: {
    getChapterVideo() {
      chapter.getChapterVideo(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.list
        })
    },
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` });
    },
    next() {
      this.$router.push({ path: `/course/publish/${this.courseId}` });
    },
  },
};
</script>
