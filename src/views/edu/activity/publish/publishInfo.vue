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
        <!-- 表格列表 -->
        <div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :disabled="!activity.publishRequest"
            @click="publish()"
          >
            Publish
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :disabled="!activity.publishRequest"
            @click="reject()"
          >
            Reject
          </el-button>
          <v-md-preview
            :text="activity.markdown"
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
            activity: [],
        }
    },
    created() {
        if(this.$route.params && this.$route.params.id){
            this.activity.id = this.$route.params.id
            console.log(this.activity.id)
            this.getActivity(this.activity.id)

        }
    },
    methods: {
        getActivity() {
            researchApi.getActivity(this.activity.id)
                .then(response => {
                    this.activity= response.data.item
                    console.log(response)
                })
        },
        publish(){
            researchApi.publish(this.activity.id)
            .then(()=>{
                this.$message({
                    message: 'Research Published',
                    type: 'success'
                })
            })

        },
        reject(){
            researchApi.reject(this.activity.id).then(
                ()=> {
                    this.$message({
                        type: 'info',
                        message: 'Request rejected'
                    })
                }
            )
        }
    },
}

</script>