import request from '@/utils/request'

export default {
  getTeacherListPage(current, limit, teacherQuerry){
    return request({
      // url: '/eduservice/edu-teacher/'+ current ,
      url: `/eduservice/edu-teacher/pageTeacherCondition/${current}/${limit}` ,
      method: 'post',
      data: teacherQuerry
    })
  },

  deleteTeacherById(id){
    return request({
      url: `/eduservice/edu-teacher/${id}` ,
      method: 'delete'
    })
  }
}
