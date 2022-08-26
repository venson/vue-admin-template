<template>
  <el-container
    class="app-container"
  >
    <el-container height="700px">
      <el-main>
        <!-- Markdown editor -->
        <el-form>
          <el-form-item label="Title">
            <el-input v-model="activity.title" />
          </el-form-item>
          <el-form-item label="Date">
            <el-date-picker
              v-model="activity.activityDate"
              type="date"
              placeholder="Pick Activity Date"
            />
          </el-form-item>
        </el-form>
        <div>
          <el-button
            v-permission="['activity.edit']"
            type="primary"
            size="mini"
            icon="el-icon-folder-checked"
            @click="saveActivity"
          >
            save
          </el-button>
          <el-button
            v-permission="['activity.review.request']"
            type="primary"
            size="mini"
            icon="el-icon-collection"
            @click="requestReviewDialog"
          >
            Request Review
          </el-button>
          <!-- Markdown editor -->
          <v-md-editor
            v-model="activity.markdown"
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

    <el-dialog
      title="Request Review"
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
          type="primary"
          @click="reviewConfirm"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import activityApi from '@/api/edu/activity'
import ossApi from '@/api/oss'
import {mapGetters} from 'vuex'
import permission from '@/directive/permission/index'

export default {
  directives: {permission},
  data() {
    return {
      reviewVo: {},
      dialogReviewVisible: false,
      dialogTitle:'',
      activity: {},
      activityBack: '',
      lefttoolbar: "undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code",

    }
  },
  computed: {
    ...mapGetters([
      'name',
      'id',
      'buttons'
    ])
  },
  created() {
    // eslint-disable-next-line no-debugger
    if (this.$route.params && this.$route.params.id) {
      console.log(this.$route.params.id)
      this.activity.id = this.$route.params.id
      this.getActivity()
    } else {
      this.activity.authorMemberName = this.name
      this.activity.authorMemberId = this.id
      this.activity.lastModifiedMemberId = this.id
      this.activity.lastModifiedMemberName = this.name
    }
    this.reviewVo.id = this.id;
    this.reviewVo.name = this.name;
  },
  methods: {
    requestReviewDialog() {
      this.dialogTitle = this.activity.title
      this.dialogReviewVisible = true
    },
    reviewConfirm() {
      console.log("request activity review")
      activityApi.requestReviewByActivityId(this.activity.id, this.reviewVo)
        .then(() => {
          this.$message({
            type: 'success',
            message: 'Request success'
          })
        })
      this.dialogReviewVisible = false
    },
    reviewCancel() {
      this.dialogReviewVisible = false
    },
    getActivity() {
      activityApi.getActivity(this.activity.id)
        .then(response => {
          this.activity = response.data.activity
          this.activity.markdown = response.data.markdown.markdown
          this.activityBack = Object.assign({}, this.activity)
          this.activity.lastModifiedMemberId = this.id
          this.activity.lastModifiedMemberName = this.name
          console.log(this.activity)
        })
    },
    handleUploadImage(event, insertImage, files) {
      let formData = new FormData();
      formData.append('file', files[0])
      let url = '';
      let desc = files[0].name;
      ossApi.uploadImage(formData)
        .then(response => {
          url = response.data.url
          insertImage({
            url: url,
            desc: desc
          });
        })

    },

    modifiedCheck() {
      return this.activity === this.activityBack
    },
    saveActivity() {
      console.log(this.activity)
      console.log(this.activityBack)
      if (this.modifiedCheck()) {
        this.$message({
          type: 'info',
          message: 'No modification'
        })
        return
      }
      if (this.activity.id == null) {
        activityApi.addActivity(this.activity)
          .then((response) => {
            console.log(response)
            this.$message({
              type: 'success',
              message: 'Add Activity successed'
            })
            this.activity.id = response.data.id
            console.log(this.activity)


            this.activityBack = Object.assign({}, this.activity)
          })
      } else {
        activityApi.updateActivity(this.activity.id, this.activity)
          .then(() => {
            this.$message({
              type: 'success',
              message: 'Add Activity successed'
            })
            this.activityBack = this.activity
          })
      }
    },

  }
}

</script>
