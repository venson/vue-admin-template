<template>
  <el-container
    class="app-container"
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
            class="m2"
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
          <el-button
            v-permission="['research.edit']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :disabled="research.publishRequest"
            style="float:right"
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
import {mapGetters} from "vuex";
import permission from '@/directive/permission'

export default {
  directives: { permission },
    data() {
        return {
            researchList: [],

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
<style>
.m2{
  margin: 2px;
}

</style>
