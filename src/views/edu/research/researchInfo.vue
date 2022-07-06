<template>
  <el-container
    class="app-container"
    height="800px"
  >
    <el-header>
      <h2 style="text-align: center">
        Research
      </h2>
    </el-header>
    <el-container height="700px">
      <el-main>
        <!-- Markdown editor -->
        <div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-folder-checked"
            @click="saveEdit"
          >
            save
          </el-button>
          <el-button
            v-permission="research.request"
            type="primary"
            size="mini"
            icon="el-icon-collection"
            @click="publishApply"
          >
            Request
          </el-button>
          <!-- Markdown editor -->
          <v-md-editor
            v-model="research.markdown"
            :left-toolbar="lefttoolbar"
            :disabled-menus="[]"
            highlight-current
            height="800px"
            @upload-image="handleUploadImage"
          />
        </div>
        <!-- </el-main> -->
        <!-- </el-container> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import researchApi from '@/api/edu/research'
import ossApi from '@/api/oss'

export default {
  data() {
    return {
      research: {},
      markdownBack: '',
      lefttoolbar: "undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code",

    }
  },
  created() {
    // eslint-disable-next-line no-debugger
    if (this.$route.params && this.$route.params.id) {
      console.log(this.$route.params.id)
      this.research.id = this.$route.params.id
      console.log(this.research)
      this.getMarkdown()
      console.log(this.research)
    }
  },
  methods: {
    getMarkdown() {
      researchApi.getResearchById(this.research.id)
        .then(response => {
          this.research = response.data.item
          this.markdownBack = this.research.markdown
        })
    },
    handleUploadImage(event, insertImage, files) {

      var formdata = new FormData()
      formdata.append('file', files[0])
      let url = '';
      let desc = files[0].name;
      ossApi.uploadImage(formdata)
        .then(response => {
          url = response.data.url
          insertImage({
            url: url,
            desc: desc
          });
        })

    },

    markdownCheck(){
      return this.markdownBack === this.research.markdown
    },

    saveResearch(){
      researchApi.updateResearch(this.research.id, this.research)
      .then(()=>{
        this.$message({
          type: 'success',
          message: 'Research updated'
        })
        this.markdownBack = this.research.markdown
      })
    },
    saveEdit(){
      if(this.markdownCheck()){
        this.$message({
          type: 'failed',
          message: 'content not changed'
        })
        return
      }
      this.saveResearch()
    },
    publishApply(){
      if(!this.markdownCheck()){
        this.saveResearch()
      }
      researchApi.publishRequest(this.research.id)
      .then(()=>{
        this.$message({
          type: 'success',
          message: 'Request applyed'
        })
      })
    }
  }
}

</script>