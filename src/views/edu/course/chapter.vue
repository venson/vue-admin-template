<template>
  <div>
    <el-container class="app-container">
      <el-header height="140px">
        <h2 style="text-align: center">
          New Course
        </h2>
        <el-steps
          :active="2"
          process-status="wait"
          align-center
          style="margin: bottom 4px"
          finish-status="success"
        >
          <el-step title="Course Base Info" />
          <el-step title="Edit Course" />
          <el-step title="Publish" />
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
              style="width:200px;height:28px"
            >
              <span style="display:inline-block"> {{ node.label }}</span>
              <span style="position:absolute;right:0px">
                <el-button
                  v-if="node.level === 1"
                  type="text"
                  size="mini"
                  @click="newSection(node)"
                >
                  New
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="editChapterSection(node, data)"
                >
                  <i class="el-icon-edit" />
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)"
                >
                  <i class="el-icon-delete" />
                </el-button>

              </span>
            </span>
          </el-tree>
        </el-aside>
        <el-main>
          <!-- chapter section form -->
          <el-form :model="editData">
            <el-form-item
              :label="editData.label"
              label-width="60px"
            >
              <el-input v-model="editData.title" />
            </el-form-item>

            <el-form-item
              v-if="editData.level === 2"
              label="Bilibili"
              label-width="60px"
            >
              <el-input v-model="editData.videoLink" />
            </el-form-item>
            <el-form-item
              label="Sort"
              label-width="60px"
            >
              <el-input
                v-model="editData.sort"
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
            v-model="editData.content"
            :left-toolbar="lefttoolbar"
            :disabled-menus="[]"
            highlight-current
            height="800px"
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
import chapterApi from '@/api/edu/chapter'
import contentApi from '@/api/edu/content'
import sectionApi from '@/api/edu/section'
import ossApi from '@/api/oss'
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
      section: {
        title: "",
      },
      content: {
        id: '',
        chapterSectionId: '',
        chapterSection: '',
        content: ''
      },
      section: {
        title: "",
        id: "",
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
      editData: {
        label: 'Title',
        edit: false,
        id: '',
        parentId: '',
        level: '',
        title: '',
        content: '',
        sort: '',
        videoLink: '',
      },

      saveSectionBtnDisabled: false,
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      console.log("courseId at start:" + this.courseId)
      this.getChapterSection()
    }
  },
  methods: {
    editChapterSection(node, data) {
      this.editData.level = node.level
      this.editData.id = data.id
      console.log("data")
      console.log(data)
      console.log("node")
      console.log(node)
      if (this.isChapter(node)) {
        this.editData.label = 'Chapter'
        this.getChapter(data.id)
        this.getChapterContent(data.id)
      } else {
        this.editData.label = 'Section'
        this.getSection(data.id)
        this.getSectionContent(data.id)
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

      var formdata = new FormData()
      formdata.append('file', files[0])
      let url = '';
      let desc = files[0].name;
      ossApi.uploadImage(formdata)
        .then(response => {
          console.log(response.data)
          url = response.data.url
          insertImage({
            url: url,
            desc: desc
          });
        })

    },
    getSection(id) {
      return Promise.resolve(
        sectionApi.getSection(id)
          .then(response => {
            this.section = response.data.item;
            this.editData.title = this.section.title
            this.editData.sort = this.section.sort
            this.editData.videoLink = this.section.videoLink
          }))

    },
    getChapter(id) {
      return Promise.resolve(
        chapterApi.getChapter(id)
          .then(response => {
            this.chapter = response.data.item;
            this.editData.title = this.chapter.title
            this.editData.sort = this.chapter.sort
            this.editData.videoLink = ''
          }))
    },
    //  Deleting Section by id
    deleteSection(id) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: 'warning'
      }).then(response => {
        section.deleteSection(id).then(response => {
          this.getChapterSection()
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
    initNewEditData() {
      this.editData.content = ''
      this.editData.title = ''
      this.editData.sort = 0
      this.content.id = ''
    },

    // new section
    newChapter() {
      console.log("new Chapter")
      this.chapter = {}
      this.initNewEditData()
      this.editData.label = 'Chapter'
      this.chapter.courseId = this.courseId
      this.editData.level = 1
      console.log(this.editData)
    },

    newSection(node) {
      console.log("add Section")
      console.log(node)
      this.initNewEditData()
      this.section = {}
      this.editData.label = 'Section'
      this.section.courseId = this.courseId
      this.section.chapterId = node.data.id
      this.editData.level = 2
      console.log(this.editData)
      console.log(this.section)
    },

    setSection() {
      this.section.title = this.editData.title
      this.section.sort = this.editData.sort
      this.section.videoLink = this.editData.videoLink
    },

    setChapter() {
      this.chapter.title = this.editData.title
      this.chapter.sort = this.editData.sort
    },
    updateSection() {
      this.setSection()
      console.log("updateSection" + this.section)
      sectionApi.updateSection(this.section).then((response) => {
        this.$message({
          type: 'success',
          message: 'Section updated'
        });
        this.getChapterSection()
      });
    },
    // get the content for the section by id
    getSectionContent(id) {
      // debugger
      return Promise.resolve(
        contentApi.getSectionContent(id)
          .then(response => {
            if (response.data.item) {
              this.editData.content = response.data.item.content
              this.content = response.data.item
              console.log("content")
              console.log(this.content)
            } else {
              this.editData.content = "<h3>No Content available, edit right now</h3>"
            }
          }))

    },
    // get the content for the chapter by id
    getChapterContent(id) {
      return Promise.resolve(
        contentApi.getChapterContent(id)
          .then(response => {
            if (response.data.item) {
              this.editData.content = response.data.item.content
              this.content = response.data.item
              console.log("content")
              console.log(this.content)
            } else {
              this.editData.content = "<h3>No Content available, edit right now</h3>"
            }
          })
      )
    },
    // get chapter section for tree display
    getChapterSection() {
      chapterApi.getChapterSection(this.courseId).then((response) => {
        this.chapterSectionList = response.data.list;
        console.log(this.chapterSectionList)
      });
    },

    // previous button
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` });
    },
    // remove chapter
    removeChapter(id) {
      this.$confirm("此操作删除章节记录，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        chapterApi.deleteChapter(id).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getChapterSection();
        });
      });
    },
    saveChapter() {
      this.setChapter()
      return Promise.resolve(
        chapterApi.addChapter(this.chapter)
          .then(response => {
            this.$message({
              type: "success",
              message: 'Chapter added'
            });
            console.log(response);
            this.editData.id = response.data.id
            this.chapter.id = response.data.id
            console.log(this.chapter);
            this.getChapterSection();

          })
      )
    },
    saveSection() {
      this.setSection()
      return new Promise((resolve, reject) =>{
        sectionApi.addSection(this.section)
        .then(response => {
          this.$message({
            type: "success",
            message: 'Section added'
          });
          this.editData.id = response.data.id;
          this.section.id = response.data.id
          this.getChapterSection();
          resolve(response.data.id)
        })})
    },
    updateChapter() {
      this.setChapter()
      chapterApi.updateChapter(this.chapter).then((response) => {
        this.$message({
          type: "success",
          message: "Chapter updated",
        });
        this.getChapterSection();
      });
    },

    saveOrUpdateContent() {
      // debugger
      this.content.content = this.editData.content
      console.log(this.editData)
      this.content.chapterSectionId = this.editData.id
      if (this.editData.level === 1) { this.content.chapterSection = 0 }
      if (this.editData.level === 2) { this.content.chapterSection = 1 }

      console.log("content")
      console.log(this.content)
      if (this.content.id) {
        // debugger
        contentApi.updateContent(this.content)
          .then(response => {
            this.$message({
              type: "success",
              message: "Content updated",
            });
          })
      } else {
        debugger
        contentApi.saveContent(this.content)
          .then(response => {
            this.$message({
              type: "success",
              message: "Content add",
            });
          })
      }

    },
    async saveOrUpdate() {
      debugger
      console.log("editData while saveorupdate")
      console.log(this.editData)
      if (this.editData.level === 1) {
        debugger
        if (this.chapter.id) {
           this.updateChapter();
        } else {
          await this.saveChapter();
        }
      } else if (this.editData.level === 2) {
        debugger
        if (this.section.id) {
          this.updateSection();
        } else {
          await this.saveSection();

        }
      }
      // debugger
      this.saveOrUpdateContent();
      this.getChapterSection()
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

.mavonEditor {
  width: 100%;
  height: 100%;
}

.el-input-sort {
  width: 100px
}
</style>
