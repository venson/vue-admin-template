<template>
  <el-container
    class="app-container"
    height="800px"
  >
    <el-header>
      <h2 style="text-align: center">
        Methodology
      </h2>
    </el-header>
    <el-container height="700px">
      <el-main>
        <!-- Markdown editor -->
        <div
          v-for="methodology in methodologyList" 
          :key="methodology.id"
        >
          <!-- <router-link :to="'/methodology/methodologyInfo/' + research.id"> -->
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :disabled="methodology.publishRequest"
            @click="editMethodology(methodology.id)"
          >
            Edit
          </el-button>
          <!-- </router-link> -->
          <v-md-preview
            :text="methodology.markdown"
          />
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
            methodologyList: [],

        }
    },
    created() {
        this.getMethodologyList()
    },
    methods: {
        getMethodologyList() {
            methodologyApi.getMethodologyList()
                .then(response => {
                    this.methodologyList = response.data.item
                })
        },
        editMethodology(id){
            this.$router.push(`/methodology/methodologyInfo/${id}`)

        }
    },
}

</script>