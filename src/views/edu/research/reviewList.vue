<template>
  <el-container
    class="app-container"
    height="800px"
  >
    <el-header>
      <h2 style="text-align: center">
        Research Review
      </h2>
    </el-header>
    <el-container height="700px">
      <el-main>
        <!-- Markdown editor -->
        <div
          v-for="research in researchList"
          :key="research.id"
        >
          <h2
            v-if="research.language==='zh'"
            style="text-align: center"
          >
            中文
          </h2>
          <h2
            v-if="research.language==='en'"
            style="text-align: center"
          >
            English
          </h2>
          <el-tooltip
            content="Modified since review"
            placement="top"
            class="m_5"
          >
            <el-tag
              v-if="research.isModified"
              type="info"
              size="medium"
              effect="dark"
            >
              Modified
            </el-tag>
          </el-tooltip>
          <!--          tag review rejected-->
          <el-tooltip
            content="Review Rejected"
            placement="top"
            class="m2"
          >
            <el-tag
              v-if="research.status ==='REJECTED'"
              type="danger"
              size="medium"
              effect="dark"
            >
              Applied
            </el-tag>
          </el-tooltip>
          <!--          tag review applied-->
          <el-tooltip
            content="Review Applied"
            placement="top"
            class="m2"
          >
            <el-tag
              v-if="research.status ==='APPLIED'"
              type=""
              size="medium"
              effect="dark"
            >
              Applied
            </el-tag>
          </el-tooltip>
          <!--          tag review finished-->
          <el-tooltip
            content="Review Applied"
            placement="top"
            class="m2"
          >
            <el-tag
              v-if="research.status ==='FINISHED'"
              type="success"
              size="medium"
              effect="dark"
            >
              Applied
            </el-tag>
          </el-tooltip>
          <div class="m_5 f_r">
            <el-button
              v-permission="['research.review.pass']"
              type="primary"
              size="mini"
              icon="el-icon-finished"
              :disabled="research.status!=='APPLIED'"
              @click="passReviewDialog(research)"
            >
              Pass
            </el-button>
            <el-button
              v-permission="['research.review.reject']"
              type="danger"
              size="mini"
              icon="el-icon-refresh-left"
              :disabled="research.status!=='APPLIED'"
              @click="rejectReviewDialog(research)"
            >
              Reject
            </el-button>
          </div>
          <!-- </router-link> -->
          <v-md-preview
            :text="research.markdown"
          />
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
          v-permission="['research.review.reject', 'research.review.pass']"
          type="success"
          @click="dialogConfirm"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import researchApi from '@/api/edu/research'
import {mapGetters} from "vuex";
import permission from "@/directive/permission/permission";

export default {
  directives: { permission },
    data() {
        return {
          dialogWindowTitle: '',
          dialogOpt: '',
          dialogType: '',
          dialogReviewVisible: false,
          dialogTitle: '',
            researchList: [{
            status:'',
            }],
            page: 1,
            limit: 10,
          reviewVo: {
            id: '',
            name: '',
            msg: '',
          },
        }
    },
  computed:{
    ...mapGetters([
      'id',
      'buttons'
    ])
  },
    created() {
      this.getResearchList()
      console.log(this.researchList)
      this.reviewVo.id = this.id
      this.reviewVo.name = this.name
    },
    methods: {

      passReviewDialog(research){
        if(research.status!=='APPLIED'){
          this.$message({
            type: 'error',
            message: 'not applied yet'
          })
          return
        }else{
          this.research = research
          this.dialogWindowTitle = 'Pass review'
          this.dialogTitle = 'Pass review about ' + (this.research.language==='zh'? '中文版':'English version')
          this.dialogOpt = 'pass'
          this.dialogReviewVisible = true;
        }
      },
      rejectReviewDialog(research){
        if(research.status!=='APPLIED'){
          this.$message({
            type: 'error',
            message: 'not applied yet'
          })
          return
        }else{
          this.research = research
          this.dialogWindowTitle = 'Pass review'
          this.dialogTitle = 'Pass review about ' + (this.research.language==='zh'? '中文版':'English version')
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
        researchApi.passReviewById(this.research.id, this.reviewVo)
          .then(() => {
            this.$message.success('Review passed')
          })
      },

      rejectReview() {
        console.log("reject review")
        researchApi.rejectReviewById(this.research.id, this.reviewVo)
          .then(() => {
            this.$message.success('Review rejected success')
          })
      },

      reviewCancel() {
        this.dialogReviewVisible = false;
      },
      getResearchList() {
        researchApi.getResearchReviewList()
          .then(response => {
            this.researchList = response.data.item
            console.log(this.researchList)
            console.log(response)
          })
      },
    },
}

</script>
<style>
.m_5{
  margin: 5px;
}
.f_r{
  float: right;
}
</style>
