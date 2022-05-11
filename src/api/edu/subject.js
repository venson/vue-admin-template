import request from "@/utils/request";

export default {
  getSubjectList(current, limit, teacherQuerry) {
    return request({
      url: `/eduservice/edu-subject/getAllSubject`,
      method: "get",
    })
  }

}
