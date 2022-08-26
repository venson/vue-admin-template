import request from "@/utils/request";
const url="/eduservice/admin/edu-subject"

export default {
  getSubjectList() {
    return request({
      url: `${url}`,
      method: "get",
    })
  }

}
