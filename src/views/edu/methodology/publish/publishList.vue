<template>
  <el-container
    class="app-container"
  >
    <el-header>
      <h2 style="text-align: center">
        Methodology
      </h2>
    </el-header>
    <el-container>
      <el-main>
        <!-- Markdown editor -->
        <div 
          v-if="requestList!== null"
        >
          <div
            v-for="methodology in requestList" 
            :key="methodology.id"
          >
            <!-- <router-link :to="'/methodology/methodologyInfo/' + research.id"> -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              :disabled="!methodology.publishRequest"
              @click="publishMethodology(methodology.id,methodology.markdown)"
            >
              Publish
            </el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              :disabled="!methodology.publishRequest"
              @click="reject(methodology.id)"
            >
              Reject
            </el-button>
            <!-- </router-link> -->
            <v-md-preview
              :text="methodology.markdown"
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
import methodologyApi from '@/api/edu/methodology'
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
            methodologyApi.getPublishList()
                .then(response => {
                    this.requestList = response.data.item
                    console.log(response)
                })
        },
        editMethodology(id){
            this.$router.push(`/methodology/methodologyInfo/${id}`)

        },
        publishMethodology(id){
            methodologyApi.publish(id)
            .then(()=>{
                this.$message({
                    message: 'Methodology Published',
                    type: 'success'
                })
                    this.getRequestList()
            })

        },
        reject(id){
            methodologyApi.publishReject(id).then(
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