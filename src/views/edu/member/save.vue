<template>
  <div class="app-container">
    member添加

    <el-form label-width="120px">
      <el-form-item label="member name">
        <el-input v-model="member.name" />
      </el-form-item>
      <el-form-item label="Member Sort">
        <el-input
          v-model="member.sort"
          controls-position="right"
          min="0"
        />
      </el-form-item>
      <el-form-item label="Member Title">
        <el-select
          v-model="member.level"
          clearable
          placeholder="请选择"
        >
          <el-option
            :value="1"
            label="高级member"
          />
          <el-option
            :value="2"
            label="首席member"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Member Career">
        <el-input v-model="member.career" />
      </el-form-item>
      <el-form-item label="Member Intro">
        <el-input
          v-model="member.intro"
          :rows="10"
          type="textarea"
        />
      </el-form-item>
      <!--avatar of members-->
      <el-form-item label="member Avatar">
        <pan-thumb :image="member.avatar" />
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow=true"
        />
        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :width="300"
          :height="300"
          :url="BASE_API + 'eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
        >
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import memberApi from '@/api/edu/member'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  components: {ImageCropper, PanThumb},
  data() {
    return {
      member: {
        avatar: '',
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      saveBtnDisabled: false,
      BASE_API: process.env.VUE_APP_BASE_API
    }
  },
  created() {
    console.log(this.BASE_API)

    // get the id of the member if the url have id
    if(this.$route.params && this.$route.params.id){
      const id = this.$route.params.id
      this.getMemberInfoById(id)
      console.log(id)
    }
  },
  methods: {
    close(){
      this.imagecropperShow = false

    },
    cropSuccess(data){
      this.close(),
      this.member.avatar = data.url

    },
    // get the member infomation by id
    getMemberInfoById(id){
      memberApi.getMemberInfoById(id)
      .then(response =>{
          this.member = response.data.member
        })
    },

    // save or update member infomation
    saveOrUpdate() {
      if (!this.member.id ){
      this.saveMember();
      }else{
        this.updateMemberInfo()
      }
    },
    updateMemberInfo(){
      memberApi.updateMember(this.member)
      .then(() =>{
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.$router.push({path: '/member/list'})
        })
    },

  // save member infomation
    saveMember() {
      memberApi.addMember(this.member).then(() => {
        this.$message({
          type: "success",
          message: "添加成功",
        });
        this.$router.push({ path: "/member/list" })
      })
    }
  }
}
</script>
