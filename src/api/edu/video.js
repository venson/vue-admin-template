import request from '@/utils/request'

export default {
  addVideo(video) {
    return request({
      url: `/eduservice/edu-video/addVideo`,
      method: "post",
      data: video,
    });
  },

  deleteVideo(id) {
    return request({
      url: `/eduservice/edu-video/${id}`,
      method: "delete",
    });
  },

  updateVideo(video) {
    return request({
      url: `/eduservice/edu-video/${video.id}`,
      method: "put",
      data: video
    });
  },

  getVideo(id) {
    return request({
      url: `/eduservice/edu-video/${id}`,
      method: "get",
    });
  },
}
