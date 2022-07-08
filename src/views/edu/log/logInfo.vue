<template>
  <el-container
    class="app-container"
  >
    <el-container height="700px">
      <el-main>
        <!-- Markdown editor -->
      <el-form>
        <el-form-item label="Title">
          <el-input v-model="activity.title"></el-input>
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker
          v-model="activity.activityDate"
          type="date"
          placeholder="Pick Activity Date"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
        <div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-folder-checked"
            @click="saveActivity"
          >
            save
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-collection"
            @click="requestPublish"
          >
            Request
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
  </el-container>
</template>

<script>
import activityApi from '@/api/edu/activity'
import ossApi from '@/api/oss'
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      activity: {},
      activityBack: '',
      lefttoolbar: "undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code",

    }
  },
  computed: {
    ...mapGetters([
      'name',
      'id'
    ])
  },
  created() {
    // eslint-disable-next-line no-debugger
    if (this.$route.params && this.$route.params.id) {
      console.log(this.$route.params.id)
      this.activity.id = this.$route.params.id
      this.getActivity()
    }else{
      this.activity.authorMemberName = this.name
      this.activity.authorMemberId = this.id
      this.activity.lastModifiedMemberId = this.id
      this.activity.lastModifiedMemberName = this.name
    }
  },
  methods: {
        getActivity(){
            activityApi.getActivity(this.activity.id)
            .then(response =>{
                this.activity = response.data.activity
                this.activity.markdown = response.data.markdown
                this.activityBack = this.activity
                this.activity.lastModified
                this.activity.lastModifiedMemberId = this.id
                this.activity.lastModifiedMemberName = this.name
                console.log(this.activity)
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

    modifiedCheck(){
      return this.activity === this.activityBack
    },

        saveActivity(){
            if(this.modifiedCheck()){
                this.$message({
                    type: 'info',
                    message: 'No modification'
                })
                return 
            }
            if(this.activity.id ==null){
            activityApi.addActivity(this.activity)
            .then((response) =>{
                this.$message({
                    type: 'success',
                    message: 'Add Activity successed'
                })
                this.activity.id = response.data.item

                this.activityBack = this.activity
            })
            }else{
            activityApi.updateActivity(this.activity.id, this.activity)
            .then(() =>{
                this.$message({
                    type: 'success',
                    message: 'Add Activity successed'
                })
                this.activityBack = this.activity
            })
            }
        },

        requestPublish(){
            if(this.activity.publishRequest){
                this.$message({
                    type: 'info',
                    message: 'Request already applied'
                })
                return 
            }
            activityApi.requestPublish(this.activity.id)
            .then(()=> {
                this.$message({
                    type: 'success',
                    message: 'Request applied'
                })
            })
        }
  }
}

</script>