import request from "@/utils/request";
const url='/eduservice/admin/edu-course'
export default {
  addCourseInfo(courseInfo) {
    return request({
      url: `${url}`,
      method: "post",
      data: courseInfo
    })
  },
  getMemberList(){
    return request({
      url: `${url}`,
      method: "get"
    })
  },
  updateCourseInfo(id,courseInfo){
    return request({
      url: `${url}/${id}`,
      method: "put",
      data: courseInfo
    })
  },
  getCourseInfo(id){
    return request({
      url: `${url}/${id}`,
      method: "get"
    })
  },

  getCoursePreviewInfo(id){
    return request({
      url: `${url}/preview/${id}`,
      method: "get"
    })
  },

  getCourseList(page,limit,condition){
    return request({
      url: `${url}/${page}/${limit}`,
      method: "post",
      data: condition
    })
  },

  deleteCourse(id){
    return request({
      url: `${url}/${id}`,
      method: "delete",
    })
  },
}
