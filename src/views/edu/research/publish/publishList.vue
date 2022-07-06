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
        <div 
          v-if="requestList!== null"
        >
          <div
            v-for="research in requestList" 
            :key="research.id"
          >
            <!-- <router-link :to="'/research/researchInfo/' + research.id"> -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              :disabled="!research.publishRequest"
              @click="publishResearch(research.id,research.markdown)"
            >
              Publish
            </el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              :disabled="!research.publishRequest"
              @click="reject(research.id)"
            >
              Reject
            </el-button>
            <!-- </router-link> -->
            <v-md-preview
              :text="research.markdown"
            />
          </div>
        </div>
        <!-- </el-main> -->
        <!-- </el-container> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import researchApi from '@/api/edu/research'
// import {xss} from '@kangc/v-md-editor'
// import VueMarkdownEditor, {xss} from '@kangc/v-md-editor'
// import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';
// import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn';
// import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';
// import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
// import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';

// import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
// import '@kangc/v-md-editor/lib/theme/style/github.css';
// import hljs from 'highlight.js';
// VueMarkdownEditor.use(githubTheme, {Hljs: hljs,})
// VueMarkdownEditor.use(createMermaidPlugin())
// VueMarkdownEditor.use(createKatexPlugin())
// VueMarkdownEditor.use(createTodoListPlugin())
export default {
    data() {
        return {
            requestList: [],

        }
    },
    created() {
        this.getRequestList()
    },
    methods: {
        getRequestList() {
            researchApi.getPublishList()
                .then(response => {
                    this.requestList = response.data.item
                    console.log(response)
                })
        },
        editResearch(id){
            this.$router.push(`/research/researchInfo/${id}`)

        },
        publishResearch(id){
            researchApi.publish(id)
            .then(()=>{
                this.$message({
                    message: 'Research Published',
                    type: 'success'
                })
                    this.getRequestList()
            })
            // this.html = xss.process(VueMarkdownEditor.themeConfig.markdownParser.render(markdown))
            // console.log(this.html)

        },
        reject(id){
            researchApi.publishReject(id).then(
                ()=> {
                    this.$message({
                        type: 'info',
                        message: 'Request rejected'
                    })
                    this.getRequestList()
                }
            )
        }
    },
}

</script>