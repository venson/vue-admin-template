import request from "@/utils/request";

export default {
  addCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/edu-course/addCourseInfo`,
      method: "post",
      data: courseInfo
    })
  },
  getMemberList(){
    return request({
      url: `/eduservice/edu-member/findAll`,
      method: "get"
    })
  },
  updateCourseInfo(courseInfo){
    return request({
      url: `/eduservice/edu-course/updateCourseInfo`,
      method: "post",
      data: courseInfo
    })
  },
  getCourseInfo(id){
    return request({
      url: `/eduservice/edu-course/getCourseInfo/${id}`,
      method: "get"
    })
  },

  getPublishCourseInfo(id){
    return request({
      url: `/eduservice/edu-course/publishCourseInfo/${id}`,
      method: "get",
    })
  },

  publishCourse(id){
    return request({
      url: `/eduservice/edu-course/publishCourse/${id}`,
      method: "post",
    })
  },

  getCourseList(page,limit,condition){
    return request({
      url: `/eduservice/edu-course/${page}/${limit}`,
      method: "post",
      data: condition
    })
  },

  deleteCourse(id){
    return request({
      url: `/eduservice/edu-course/${id}`,
      method: "delete",
    })
  },
}
