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
        <el-table
          :data="requestList.records"
          stripe
          style="width: 100%"
        >
          <el-table-column
            prop="title"
            label="Title"
            min-width="280"
          />
          <el-table-column
            label="Date"
            min-width="100"
            prop="activityDate"
          />
          <el-table-column
            prop="isPublished"
            label="Publish status"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.isPublished=== true ? "已发布" : "未发布" }}
            </template>
          </el-table-column>
          <el-table-column
            label="Operations"
            min-width="400"
            align="center"
          >
            <template slot-scope="scope">
              <router-link 
                v-permission="['activity.edit']"
                :to="'/activity/activityInfo/' + scope.row.id"
              >
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                >
                  Edit
                </el-button>
              </router-link>
              <el-button
                v-permission="['activity.delete']"

                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteActivity(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div 
          v-if="requestList!== null"
        >
          <div
            v-for="research in requestList" 
            :key="research.id"
          >
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
            <v-md-preview
              :text="research.markdown"
            />
          </div>
        </div> -->
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
            page: 1,
            limit: 10,

        }
    },
    created() {
        this.getRequestList()
    },
    methods: {
        getRequestList(page=1) {
            researchApi.getPageRequestList(page, this.limit)
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