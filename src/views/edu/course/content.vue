<template>
  <div>
    <el-container class="app-container">
      <el-header height="100px">
        <h3 style="text-align: center">
          New Course
        </h3>
        <el-steps
          :active="2"
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
      </el-header>
      <el-container height="700px">
        <el-aside width="260px">
          <el-button
            type="text"
            @click="newChapter"
          >
            New Chapter
          </el-button>
          <el-tree
            :data="chapterSectionList"
            node-key="id"
            default-expand-all
            :props="props"
            :expand-on-click-node="false"
          >
            <!-- <span class="custom-tree-node" slot-scope="{ node, data }"> -->
            <span
              slot-scope="{ node, data }"
              class="custom-tree-node"
              style="width:100%;height:45px"
            >
              <span style="display:block">{{ node.label }}</span>

              <span style="position:absolute;right:0">
                <el-button
                  v-if="node.level === 1"
                  v-permission="['course.edit.content']"
                  type="text"
                  size="mini"
                  @click="newSection(node)"
                >
                  New
                </el-button>
                <el-button
                  v-permission="['course.edit.content']"
                  type="text"
                  size="mini"
                  @click="editContent(node, data)"
                >
                  <i class="el-icon-edit" />
                </el-button>
                <el-button
                  v-permission="['course.edit.remove']"
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)"
                >
                  <i class="el-icon-delete" />
                </el-button>

              </span>
              <span style="float:left" />
              <el-tag
                v-if="data.review==='NONE'"
                type=""
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
              <el-tooltip
                content="Reviewed and published"
                placement="top"
                class="m2"
              >
                <el-tag
                  v-if="data.isPublished ===true"
                  type="success"
                  size="mini"
                  effect="dark"
                >P</el-tag>
              </el-tooltip>
              <el-tooltip
                content="Modified Since Review"
                placement="top"
                class="m2"
              >
                <el-tag
                  v-if="data.isModified ===true"
                  type="danger"
                  size="mini"
                  effect="dark"
                >M</el-tag>
              </el-tooltip>
            </span>
          </el-tree>
        </el-aside>
        <el-main>
          <!-- content edit  -->
          <el-form :model="editBuffer">
            <el-form-item
              :label="editBufferLabel"
              label-width="60px"
            >
              <el-input v-model="editBuffer.title" />
            </el-form-item>

            <el-form-item
              v-if="editBufferLevel === 2"
              label="Bilibili"
              label-width="60px"
            >
              <el-input v-model="editBuffer.videoLink" />
            </el-form-item>
            <el-form-item
              label="Sort"
              label-width="60px"
            >
              <el-input
                v-model="editBuffer.sort"
                class="el-input-sort"
              />
              <el-button
                type="success"
                style="margin-left:20px"
                @click="saveOrUpdate()"
              >
                Save
              </el-button>
            </el-form-item>
          </el-form>
          <!-- Markdown editor -->
          <v-md-editor
            v-model="editBuffer.markdown.markdown"
            :left-toolbar="lefttoolbar"
            :disabled-menus="[]"
            highlight-current
            height="400px"
            @upload-image="handleUploadImage"
          />
          <div>
            <el-button @click="previous">
              上一步
            </el-button>
            <el-button
              :disabled="saveBtnDisabled"
              type="primary"
              @click="next"
            >
              下一步
            </el-button>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import contentApi from '@/api/edu/content'
import chapterApi from '@/api/edu/chapter'
import sectionApi from '@/api/edu/section'
import ossApi from '@/api/oss'
import Compressor from 'compressorjs'
export default {
  data() {
    return {
      props: {
        label: 'title',
        isLeaf: 'isLeaf'
      },

      lefttoolbar: "undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save",
      saveBtnDisabled: false,
      courseId: "",
      chapterSectionList: [],
      content: {
        id: '',
        chapterSectionId: '',
        chapterSection: '',
        content: ''
      },
      sectionBack:{},
      section: {
        title: "",
        id: "",
        sort: 0,
        courseId: "",
        chapterId: "",
        isFree: true,
      },
      chapterBack:{},
      chapter: {
        courseId: "",
        title: "",
        sort: 0,
      },
      editBuffer:{
        title: '',
        courseId: '',
        sort: '',
        videoLink: '',
        markdown:{
          markdown: "",
        }
      },
      editBufferLevel: '',
      editBufferId: '',
      editBufferLabel: '',

      saveSectionBtnDisabled: false,
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      console.log("courseId at start:" + this.courseId)
      this.getTreeNode()
    }
  },
  methods: {
    stepOne(){
      this.$router.push({path: `/course/info/${this.courseId}`})
    },
    stepTwo(){
      this.$router.push({path: `/course/Content/${this.courseId}`})
    },
    stepThree(){
      this.$router.push({path: `/course/preview/${this.courseId}`})
    },
    editContent(node, data) {
      this.editBufferLevel = node.level
      this.editBufferId = data.id
      console.log("data")
      console.log(data)
      console.log("node")
      console.log(node)
      if (this.isChapter(node)) {
        this.editBufferLabel = 'Chapter'
        this.getChapterById(data.id)
      } else {
        this.editBufferLabel = 'Section'
        this.getSectionById(data.id)
      }

      console.log(this.editData)
    },

    isChapter(node) {
      return node.level === 1
    },
    isSection(node) {
      return node.level === 2
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    handleUploadImage(event, insertImage, files) {

      let formData = new FormData();
      new Compressor(files[0],{
        quality: 0.6,
        maxHeight: 600,
        maxWidth: 1000,
        fit: 'contain',
        success(result){
          formData.append('file', result,result.name)
          let url = '';
          let desc = files[0].name;
          ossApi.uploadImage(formData)
            .then(response => {
              url = response.data.url
              insertImage({
                url: url,
                desc: desc
              });
            })
        }
      })

    },
    getSectionById(id) {
      // return Promise.resolve(
        sectionApi.getSectionById(id)
          .then(response => {
            this.section = response.data.item;
            this.sectionBack = Object.assign({},this.section)
            this.editBuffer = this.section;
          })
          // )

    },
    getChapterById(id) {
      // return Promise.resolve(
        chapterApi.getChapterById(id)
          .then(response => {
            this.chapter = response.data.item;
            console.log(this.chapter)
            this.chapterBack = Object.assign({},this.chapter)
            this.editBuffer = this.chapter;
          })
          // )
    },
    //  Deleting Section by id
    deleteSection(id) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: 'warning'
      }).then(() => {
        sectionApi.deleteSectionById(id).then(() => {
          this.getTreeNode()
        })
      })

    },
    // save or update button function
    saveOrUpdateSection() {
      if (this.section.id) {
        console.log("update")
        this.updateSection()
      } else {
        console.log("add")
        this.addSection()
      }
      this.dialogSectionFormVisible = false
    },
    // init  editData
    initNewEditBuffer() {
      this.editBuffer.courseId = this.courseId
      this.editBuffer.title = '';
      this.editBuffer.videoLink = '';
      this.editBuffer.markdown.markdown = ''
      this.editBuffer.sort = ''
    },

    // new chapter
    newChapter() {
      console.log("new Chapter")
      this.chapter = {markdown:{markdown:''}}
      this.chapter.courseId = this.courseId
      this.initNewEditBuffer()
      this.editBufferLabel = 'Chapter'
      this.editBufferLevel = 1
    },

    newSection(node) {
      console.log("add Section")
      this.section = {markdown:{markdown:''}}
      this.initNewEditBuffer()
      this.editBufferLabel = 'Section'
      this.section.courseId = this.courseId
      this.section.chapterId = node.data.id
      this.editBufferLevel = 2
    },

    saveBuffer(target){
      if(target ==='section'){
        this.section.title = this.editBuffer.title
        this.section.sort = this.editBuffer.sort
        this.section.videoLink = this.editBuffer.videoLink
        this.section.markdown.markdown = this.editBuffer.markdown.markdown
      }else if(target ==='chapter'){
        this.chapter.title = this.editBuffer.title
        this.chapter.sort = this.editBuffer.sort
        this.chapter.markdown.markdown = this.editBuffer.markdown.markdown
      }
    },
    updateSection() {
      this.saveBuffer('section')
      console.log("updateSection" + this.section)
      sectionApi.updateSectionById(this.section.id,this.section).then(() => {
        this.$message({
          type: 'success',
          message: 'Section updated'
        });
        this.getTreeNode()
      });
    },
    // get chapter section for tree display
    getTreeNode() {
      contentApi.getTreeNode(this.courseId).then((response) => {
        this.chapterSectionList = response.data.tree;
        console.log(response)
        console.log(this.chapterSectionList)
      });
    },

    // remove chapter
    removeChapter(id) {
      this.$confirm("此操作删除章节记录，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        chapterApi.deleteChapterById(id).then(() => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getTreeNode();
        });
      });
    },
    saveChapter() {
      this.saveBuffer('chapter')
        chapterApi.addChapter(this.chapter)
          .then(response => {
            this.$message({
              type: "success",
              message: 'Chapter added'
            });
            this.editBuffer.id = response.data.id
            this.chapter.id = response.data.id
            console.log(this.chapter);
            this.getTreeNode();

          })
    },
    saveSection() {
      this.saveBuffer('section')
        sectionApi.addSection(this.section)
        .then(response => {
          this.$message({
            type: "success",
            message: 'Section added'
          });
          this.editBuffer.id = response.data.id;
          this.section.id = response.data.id
          this.getTreeNode();
        })},
    updateChapter() {
      this.saveBuffer('chapter')
      chapterApi.updateChapterById(this.chapter.id,this.chapter).then(() => {
        this.$message({
          type: "success",
          message: "Chapter updated",
        });
        this.getTreeNode();
      });
    },

    saveOrUpdate() {
      console.log("editBuffer content while saveorupdate")
      if (this.editBufferLevel === 1) {
        if (this.chapter.id) {
           this.updateChapter();
        } else {
          this.saveChapter();
        }
      } else if (this.editBufferLevel === 2) {
        if (this.section.id) {
          this.updateSection();
        } else {
          this.saveSection();

        }
      }
      this.getTreeNode()
    },
    // previous button
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` });
    },
    next() {
      this.$router.push({ path: `/course/preview/${this.courseId}` });
    },
  }
}
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
  font-size: 14px;
  margin: 5px 0;
  padding: 5px;
  height: 70px;
  /* line-height: 50px; */
  width: 100%;
  border: 1px solid #ddd;
}

.chapterList .acts {
  float: right;
  font-size: 14px;
}

.contentMarker  {
  float: left;
  padding-left: 3px;
  padding-right: 3px;
  font-size: 14px;
  padding-top: 2px;
}

::v-deep .el-tree-node__content{
  height: 45px !important;
}
.sectionList {
  padding-left: 10px;
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

.sectionList .sectionActs {
  float: right;
  font-size: 12px;
}
.c_r{
  color:red;
}
.c_g{
  color:green;
}
.c_y{
  color:yellow;
}

.el-input-sort {
  width: 100px
}
.m2{
  margin: 2px;
}
</style>
