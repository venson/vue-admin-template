import request from "@/utils/request";

export default {
  addCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/edu-course/addCourseInfo`,
      method: "post",
      data: courseInfo
    })
  },
  getTeacherList(){
    return request({
      url: `/eduservice/edu-teacher/findAll`,
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
  }


}
