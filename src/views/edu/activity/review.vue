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
            v-permission="['activity.review.pass']"
            type="primary"
            size="mini"
            icon="el-icon-finished"
            :disabled="activity.status!=='APPLIED'"
            @click="passReviewDialog()"
          >
            Pass
          </el-button>
          <el-button
            v-permission="['activity.review.reject']"
            type="danger"
            size="mini"
            icon="el-icon-refresh-left"
            :disabled="activity.status!=='APPLIED'"
            @click="rejectReviewDialog()"
          >
            Reject
          </el-button>
        </div>
        <!-- </el-main> -->
        <!-- </el-container> -->
      </el-main>
    </el-container>

    <el-dialog
      :title="dialogWindowTitle"
      :visible.sync="dialogReviewVisible"
    >
      <span>{{ dialogTitle }}</span>
      <el-form :model="reviewVo">
        <el-form-item
          label="Message"
          label-width="200"
        >
          <el-input
            v-model="reviewVo.msg"
            type="textarea"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="reviewCancel">Cancel</el-button>
        <el-button
          v-permission="['activity.review.reject', 'activity.review.pass']"
          type="success"
          @click="dialogConfirm"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import activityApi from '@/api/edu/activity'
import {mapGetters} from "vuex";
import permission from '@/directive/permission/permission'

export default {
  directives: {permission},
  data() {
    return {
      dialogWindowTitle: '',
      dialogOpt: '',
      dialogType: '',
      dialogTitle: '',
      activity: {
      },
      dialogReviewVisible: false,
      reviewVo: {
        id: '',
        name: '',
        msg: '',
      },
    }
  },
  computed: {
    ...mapGetters([
      'id',
      'name',
      'buttons'
    ])
  },

  created() {
    if (this.$route.params && this.$route.params.id) {
      this.activity.id = this.$route.params.id
      console.log(this.activity.id)
      this.getActivity(this.activity.id)
    }
    this.reviewVo.id = this.id
    this.reviewVo.name = this.name
  },
  methods: {
    passReviewDialog(){
      if(this.activity.status!=='APPLIED'){
        this.$message({
          type: 'error',
          message: 'not applied yet'
        })
        return
      }else{
        this.dialogWindowTitle = 'Pass review'
        this.dialogTitle = 'Pass review about ' + this.activity.title
        this.dialogOpt = 'pass'
        this.dialogReviewVisible = true;
      }
    },
    rejectReviewDialog(){
      if(this.activity.status!=='APPLIED'){
        this.$message({
          type: 'error',
          message: 'not applied yet'
        })
        return
      }else{
        this.dialogWindowTitle = 'Pass review'
        this.dialogTitle = 'Pass review about ' + this.activity.title
        this.dialogOpt = 'pass'
        this.dialogReviewVisible = true;
      }
    },
    dialogConfirm() {
      this.$confirm('Confirm?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        switch (this.dialogOpt) {
          case "pass":
            this.passReview()
            break
          case "reject":
            this.rejectReview()
            break
        }
      }).then(() => {
        this.dialogReviewVisible = false
      })
    },
    passReview() {
      console.log("pass review")
      activityApi.passReviewByActivityId(this.activity.id, this.reviewVo)
        .then(() => {
          this.$message.success('Review passed')
        })
    },

    rejectReview() {
      console.log("reject review")
      activityApi.rejectReviewByActivityId(this.activity.id, this.reviewVo)
        .then(() => {
          this.$message.success('Review rejected success')
        })
    },

    reviewCancel() {
      this.dialogReviewVisible = false;
    },
    getActivity() {
      activityApi.getActivity(this.activity.id)
        .then(response => {
          this.activity = response.data.activity
          this.activity.markdown = response.data.markdown.markdown

          console.log(this.activity)

        })
    },
  }
}

</script>
<style lang="css" scoped>
.author, .date {
  padding: 10px 20px 10px 20px;
}

.operateButton {
  float: right;
  padding-right: 30px;
}
</style>
