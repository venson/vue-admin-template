import request from "@/utils/request";

export default {
  getChapterVideo(id) {
    return request({
      url: `/eduservice/edu-chapter/getChapterVideo/${id}`,
      method: "get",
    })
  }

}
