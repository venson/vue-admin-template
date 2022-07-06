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
        <!-- Markdown editor -->
        <div
          v-for="research in researchList" 
          :key="research.id"
        >
          <!-- <router-link :to="'/research/researchInfo/' + research.id"> -->
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :disabled="research.publishRequest"
            @click="editResearch(research.id)"
          >
            Edit
          </el-button>
          <!-- </router-link> -->
          <v-md-preview
            :text="research.markdown"
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

export default {
    data() {
        return {
            researchList: [],

        }
    },
    created() {
        this.getResearchList()
    },
    methods: {
        getResearchList() {
            researchApi.getResearchList()
                .then(response => {
                    this.researchList = response.data.item
                })
        },
        editResearch(id){
            this.$router.push(`/research/researchInfo/${id}`)

        }
    },
}

</script>