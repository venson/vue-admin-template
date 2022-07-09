<template>
  <div class="app-container">
    <h2 style="text-align: center">
      New Article
    </h2>

    <el-form label-width="150px">
      <el-form-item label="Title">
        <el-input
          v-model="scholar.title"
          type="textarea"
          :rows="2"
          placeholder="Title"
        />
      </el-form-item>
      <el-form-item label="Authors">
        <el-input
          v-model="scholar.authors"
          placeholder="Authors"
        />
      </el-form-item>
      <el-form-item label="Lab members">
        <el-button
          type="success"
          icon="el-icon-plus"
          size="mini"
          circle
          @click="dialogMemberVisible = true"
        />
        <el-checkbox-group v-model="labMemberList">
          <el-checkbox-button
            v-for="(member,index) in labMemberObjList"
            :key="index"
            :label="member.id"
          >
            {{ member.name }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Publication Date">
        <el-date-picker
          v-model="scholar.publicationDate"
          format="yyyy-MM"
          value-format="yyyy-MM"
          type="month"
          placeholder="choseDate"
        />
      </el-form-item>
      <el-form-item label="Journal">
        <el-input
          v-model="scholar.journal"
          placeholder="Journal"
        />
      </el-form-item>
      <el-form-item label="Volume">
        <el-input
          v-model="scholar.volume"
          placeholder="Volume"
        />
      </el-form-item>
      <el-form-item label="Issue">
        <el-input
          v-model="scholar.issue"
          placeholder="Issue"
        />
      </el-form-item>
      <el-form-item label="Pages">
        <el-input
          v-model="scholar.pages"
          placeholder="Pages"
        />
      </el-form-item>
      <el-form-item label="Publisher">
        <el-input
          v-model="scholar.publisher"
          placeholder="Publisher"
        />
      </el-form-item>
      <el-form-item label="Description">
        <el-input
          v-model="scholar.description"
          type="textarea"
          :rows="4"
          placeholder="Description"
        />
      </el-form-item>
      <el-form-item label="Citations">
        <el-form :inline="true">
          <el-form-item
            v-for="(citation,index) in citationList"
            :key="index"
            :label="citation.year"
            class="citation-year"
          >
            <el-input v-model="citation.citations" />
          </el-form-item>

          <div
            ref="chart"
            style="width:400px;height:200px"
          />
        </el-form>
      </el-form-item>
      <el-form-item label="Total citations">
        <el-input
          v-model="scholar.totalCitations"
          placeholder="Total citations"
        />
      </el-form-item>
      <el-form-item label="LinkText">
        <el-input
          v-model="scholar.linkText"
          placeholder="LinkText"
        />
      </el-form-item>
      <el-form-item label="LinkUrl">
        <el-input
          v-model="scholar.linkUrl"
          placeholder="LinkUrl"
        />
      </el-form-item>
      <!-- 所属分类 TODO -->
      <!-- 课程讲师 TODO -->

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="save()"
        >
          保存并下一步
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="lab members"
      :visible.sync="dialogMemberVisible"
    >
      <el-form>
        <el-form-item label="Lab Member">
          <el-checkbox-group v-model="labMemberList">
            <el-checkbox-button
              v-for="(member,index) in memberList"
              :key="index"
              :label="member.id"
            >
              {{ member.name }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>


        <el-form-item>
          <el-button
            type="success"
            style="float:right"
            @click="scholarMemberSelect()"
          >
            Confirm
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import course from "@/api/edu/course";
import scholarApi from '@/api/edu/scholar'

export default {
  data() {
    return {
      mychart: null,
        option: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              minInterval: 2
            }
          ],
          series: [
            {
              name: 'Citation',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 200, 334, 390, 330, 220]
            }
          ]
        },
      dialogMemberVisible: false,
      // the list store the member id 
      labMemberList: [],
      // the list store the member object
      labMemberObjList: ([]),
      saveBtnDisabled: false,
      scholarId: "",
      scholar: {

      },
      citationList: [
        {
          year: '',
          citations: ''
        }
      ],

      memberList: [
        {
          name: '',
          id: ''
        }
      ],
      BASE_API: process.env.VUE_APP_BASE_API,
    };
  },
  watch: {
    'scholar.publicationDate': {
      handler(newDate, oldYear) {
        console.log(newDate)
        if (newDate) {
          var beginYear = newDate.slice(0, 4)
          this.citationList = []
          var date = new Date()
          this.scholar.year= beginYear
          var endYear = date.getFullYear()
          for (var year = beginYear; year <= endYear; year++) {
            this.citationList.push({ 'year': year.toString(), 'citations': 0, 'scholarId': this.scholar.id })
          }
          console.log(this.citation)
        }

      },
      immediate: true,
    },
    citationList:{
      deep:true,
      handler(newData, oldData){
        console.log("citation update")
        console.log(newData)
        this.option.xAxis[0].data = newData.map(o=>o.year)
        this.option.series[0].data = newData.map(o=>Number(o.citations))
        this.scholar.totalCitations = newData.reduce((total, o)=>Number(o.citations) + total,0)
        console.log(this.option)
        this.refreshEchartData()
      }
    },
  },
  created() {
    // console.log("start")
    if (this.$route.params && this.$route.params.id) {
      this.scholarId = this.$route.params.id
      this.scholar.id = this.scholarId
      this.getScholar()
      console.log(this.scholarId)
    }
    this.getmemberList()
  },
  mounted(){
    this.echartsInit()

  },

  methods: {
    echartsInit(){
      this.myChart = this.$echarts.init(this.$refs.chart)
      this.myChart.setOption(this.option)
    },
    // getEchartData() {
    //   const chart = this.$refs.chart
    //   if (chart) {
    //     console.log("draw echarts")
    //     const myChart = this.$echarts.init(chart)
    //     myChart.setOption(this.option)
    //     window.addEventListener("resize", function () {
    //       myChart.resize()
    //     })
    //   }
    // },
    refreshEchartData() {
      const chart = this.$refs.chart

    this.myChart.setOption(this.option)
    },
    // add selected group member to scholar article authors
    // todo change to hash map
    scholarMemberSelect() {
      this.labMemberObjList = []
      this.dialogMemberVisible = false
      for (let i = 0; i < this.memberList.length; i++) {
        if (this.labMemberList.includes(this.memberList[i].id)) {
          this.labMemberObjList.push(this.memberList[i])
        }
      }
      // this.labMemberObjList = new Set(this.labMemberObjList)
      console.log(this.labMemberObjList)
    },

    getScholar() {
      scholarApi.getScholar(this.scholarId)
        .then(response => {
          this.scholar = response.data.item
        })
      scholarApi.getCitationByScholarId(this.scholarId)
        .then(response =>{
          console.log("get citation")
          console.log(response)
          this.citationList = response.data.item
          console.log(this.citationList)
        })

    },
    getmemberList() {
      course.getmemberList().then((response) => {
        this.memberList = response.data.items;
        console.log(this.memberList)
      });
    },
    save() {
      if (this.scholar.id) {
        this.updateScholar()
      } else {
        this.addScholar()
      }
    },
    async addScholar() {
      await scholarApi.addScholar(this.scholar)
      .then(response => {
        this.$message({
          type: "success",
          message: "add scholar success",
        });
        this.scholar.id = response.data.id
        this.citationList.map(o=>o.scholarId=this.scholarId)
        console.log(this.citationList)
      })
      scholarApi.addScholarMember(this.scholar.id, this.labMemberObjList)
        .then((response) => {
        this.$message({
          type: "success",
          message: "add member success",
        });
      });

      scholarApi.addScholarCitation(this.citationList)
      then((response) => {
        this.$message({
          type: "success",
          message: "add citation success",
        });
        // this.$router.push({
        //   path: "/scholar/list",
        // });
      });
    },
    updateScholar() {
      scholarApi.updateScholar(this.scholar.id, this.scholar).then((response) => {
        // console.log(this.courseInfo)
        this.$message({
          type: "success",
          message: "update scholar success",
        });
        // this.$router.push({
        //   path: "/scholar/list",
        // });
      });
      scholarApi.updateScholarCitation(this.scholarId, this.citationList)
      .then((response) =>{
        this.$message({
          type: "success",
          message: "update citation success",
        });
      })
    }
  },
};
</script>
<style lang="scss">
@import "@/styles/upload.scss";
</style>
<style scoped>
.tinymce-container {
  line-height: 29px;
}

#editor {
  margin: auto;
  width: 100%;
  /* height: 580px; */
}

.tui-editor .te-md-splitter {
  display: none;
  position: absolute;
  left: 50%;
  top: 0;
  height: 100%;
  /* width: 1px; */
  width: 100%;
  border-left: 1px solid #e5e5e5;
}

.citation-year {
  width: 100px
}
</style>
