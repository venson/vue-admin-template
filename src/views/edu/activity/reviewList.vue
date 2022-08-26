<template>
  <el-container
    class="app-container"
    height="800px"
  >
    <el-header>
      <h2 style="text-align: center">
        Activity
      </h2>
    </el-header>
    <el-container height="700px">
      <el-main>
        <el-table
          :data="activityList.records"
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
            min-width="70"
            prop="activityDate"
          />
          <el-table-column
            prop="isPublished"
            label="Status"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.isPublished=== true ? "Published" : "Unpublished" }}
            </template>
          </el-table-column>
          <el-table-column
            label="Operations"
            min-width="120"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-permission="['activity.review']"
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="preview(scope.row.id)"
              >
                Preview
              </el-button>
              <el-button
                v-permission="['activity.review.reject']"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="reject(scope.row.id)"
              >
                Reject
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import activityApi from '@/api/edu/activity'
import permission from '@/directive/permission'
export default {
    directives: { permission},
    data() {
        return {
            activityList: {
              records: [],

            },
            page: 1,
            limit: 10,

        }
    },
    created() {
        this.getPageActivityReviewList()
    },
    methods: {
        getPageActivityReviewList(page=1) {
            activityApi.getPageRequestList(page, this.limit)
                .then(response => {
                    this.activityList = response.data
                    console.log(response)
                    console.log(this.activityList)
                })
        },
        editactivity(id){
            this.$router.push(`/activity/activityInfo/${id}`)

        },
        publishactivity(id){
            activityApi.publish(id)
            .then(()=>{
                this.$message({
                    message: 'activity Published',
                    type: 'success'
                })
                    this.getRequestList()
            })

        },
        preview(id){
          this.$router.push(`review/${id}`)
        },
        reject(id){
            this.$confirm('Confirm Deletation?', 'Warning',{
              confirmButtonText: 'Delete',
              cancelButtonText: 'Cancel'
            }).then(()=>{
            activityApi.reject(id).then(
                ()=> {
                    this.$message({
                        type: 'success',
                        message: 'Request rejected'
                    })
                    this.getRequestList()
                }
            )
            })
        }
    },
}

</script>
