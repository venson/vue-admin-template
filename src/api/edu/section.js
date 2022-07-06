import request from '@/utils/request'

export default {
  addSection(section) {
    return request({
      url: `/eduservice/edu-section`,
      method: "post",
      data: section,
    });
  },

  deleteSection(id) {
    return request({
      url: `/eduservice/edu-section/${id}`,
      method: "delete",
    });
  },

  updateSection(section) {
    return request({
      url: `/eduservice/edu-section/${section.id}`,
      method: "put",
      data: section
    });
  },

  getSection(id) {
    return request({
      url: `/eduservice/edu-section/${id}`,
      method: "get",
    });
  },
}
