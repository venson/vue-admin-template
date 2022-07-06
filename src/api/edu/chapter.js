import request from "@/utils/request";

export default {
  getChapterSection(id) {
    return request({
      url: `/eduservice/edu-chapter/getChapterSection/${id}`,
      method: "get",
    })
  },

  addChapter(chapter) {
    return request({
      url: `/eduservice/edu-chapter/addChapter`,
      method: "post",
      data: chapter
    })
  },
  getChapter(id) {
    return request({
      url: `/eduservice/edu-chapter/getChapter/${id}`,
      method: "get",
    })
  },

  updateChapter(chapter) {
    return request({
      url: `/eduservice/edu-chapter/updateChapter`,
      method: "post",
      data: chapter
    })
  },

  deleteChapter(id) {
    return request({
      url: `/eduservice/edu-chapter/${id}`,
      method: "delete",
    })
  },
}
