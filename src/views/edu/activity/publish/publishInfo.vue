<template>
  <el-container
    class="app-container"
    height="800px"
  >
    <el-container height="700px">
      <el-main>
        <h2 style="text-align: center">
          activity
        </h2>
        <!-- 表格列表 -->
        <div>
          <div class="author">
            <span class="author">{{ activity.authorMemberName }}</span> 
            <span class="date">{{ activity.activityDate }}</span>
          </div>
          <v-md-preview
            :text="activity.markdown"
          />
        </div>
        <div class="operateButton">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-finished"
            :disabled="activity.publishRequest!=1"
            @click="publish()"
          >
            Publish
          </el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-refresh-left"
            :disabled="activity.publishRequest!=1"
            @click="reject()"
          >
            Reject
          </el-button>
        </div>
        <!-- </el-main> -->
        <!-- </el-container> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import activityApi from '@/api/edu/activity'
export default {
    data() {
        return {
            activity: {
              publishRequest: false,

            },
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
            activityApi.getActivity(this.activity.id)
                .then(response => {
                    this.activity= response.data.activity
                    this.activity.markdown = response.data.markdown.markdown
                    
                    console.log(this.activity)
                    
                })
        },
        publish(){
            activityApi.publish(this.activity.id)
            .then(()=>{
                this.$message({
                    type: 'success',
                    message: 'activity Published',
                })
            })

        },
        reject(){
            activityApi.reject(this.activity.id).then(
                ()=> {
                    this.$message({
                        type: 'success',
                        message: 'Request rejected'
                    })
                }
            )
        }
    },
}

</script>
<style lang="css" scoped>
.author,.date{
  padding: 10px 20px 10px 20px;
}
.operateButton{
  float: right;
  padding-right: 30px;
}
</style>