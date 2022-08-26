<template>
  <div class="app-container">
    <el-tree
      ref="tree2"
      :data="memberList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import subject from '@/api/edu/subject.js'
export default {

  data() {
    return {
      filterText: '',
      memberList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created(){
    this.getAllSubjectList()
  },

  methods: {
    getAllSubjectList(){
      subject.getSubjectList()
      .then(response =>{
          this.memberList = response.data.tree
        })

    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value) !== -1
    }
  }
}
</script>

