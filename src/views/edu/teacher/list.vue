<template>
  <div class="app-container">
    教师列表
  </div>
    :
</template>

<script>
import teacher from '@/api/edu/teacher.js'
export default{
  // data:{

  // },
  data() {
    return {
      list:null,
      page:1,
      limit: 10,
      total: 0,
      teacherQuery:{}
    }
  },
  created() {
    this.getList()

  },
  methods:{
    getList(){
      teacher.getTeacherListPage(this.page,this.limit, this.teacherQuery)
      .then(response => {
        // console.log(response)
          console.log("=======")
          this.list = response.data.row
          this.total = response.data.total
          console.log(this.list)
          console.log(this.total)


      })
      .catch(error => {console.log(error)})
    }
  }

}
</script>
