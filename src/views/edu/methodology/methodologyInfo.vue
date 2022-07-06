<template>
  <el-container
    class="app-container"
    height="800px"
  >
    <el-header>
      <h2 style="text-align: center">
        Methodology
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
            type="primary"
            size="mini"
            icon="el-icon-collection"
            @click="publishApply"
          >
            Request
          </el-button>
          <!-- Markdown editor -->
          <v-md-editor
            v-model="methodology.markdown"
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
import methodologyApi from '@/api/edu/methodology'
import ossApi from '@/api/oss'

export default {
  data() {
    return {
      methodology: {},
      markdownBack: '',
      lefttoolbar: "undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code",

    }
  },
  created() {
    // eslint-disable-next-line no-debugger
    if (this.$route.params && this.$route.params.id) {
      console.log(this.$route.params.id)
      this.methodology.id = this.$route.params.id
      console.log(this.methodology)
      this.getMarkdown()
      console.log(this.methodology)
    }
  },
  methods: {
    getMarkdown() {
      methodologyApi.getMethodologyById(this.methodology.id)
        .then(response => {
          this.methodology = response.data.item
          this.markdownBack = this.methodology.markdown
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
      return this.markdownBack === this.methodology.markdown
    },

    saveMethodology(){
      methodologyApi.updateMethodology(this.methodology.id, this.methodology)
      .then(()=>{
        this.$message({
          type: 'success',
          message: 'Methodology updated'
        })
        this.markdownBack = this.methodology.markdown
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
      this.saveMethodology()
    },
    publishApply(){
      if(!this.markdownCheck()){
        this.saveMethodology()
      }
      methodologyApi.publishRequest(this.methodology.id)
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