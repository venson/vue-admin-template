import request from '@/utils/request'
const url='/eduservice/admin/edu-review'
export default {
  rejectReviewByCourseId(courseId, applyVo){
    return request({
      url: `${url}/reject/${courseId}`,
      method: 'post',
      data: applyVo,
    })
  },
  passReviewByCourseId(courseId, applyVo){
    return request({
      url: `${url}/${courseId}`,
      method: 'put',
      data: applyVo
    })
  },

  requestReviewByChapterId(chapterId, applyVo){
    return request({
      url: `${url}/chapter/${chapterId}`,
      method: 'post',
      data: applyVo
    })
  },
  rejectReviewByChapterId(chapterId, applyVo){
    return request({
      url: `${url}/chapter/reject/${chapterId}`,
      method: 'post',
      data: applyVo
    })
  },
  requestReviewByCourseId(courseId, applyVo){
    return request({
      url: `${url}/${courseId}`,
      method: 'post',
      data: applyVo
    })
  },
  passReviewByChapterId(chapterId, applyVo){
    return request({
      url: `${url}/chapter/${chapterId}`,
      method: 'put',
      data: applyVo
    })
  },
  requestReviewBySectionId(sectionId, applyVo){
    return request({
      url: `${url}/section/${sectionId}`,
      method: 'post',
      data: applyVo
    })
  },
  rejectReviewBySectionId(sectionId, applyVo){
    return request({
      url: `${url}/section/reject/${sectionId}`,
      method: 'post',
      data: applyVo
    })
  },
  passReviewBySectionId(sectionId, applyVo){
    return request({
      url: `${url}/section/${sectionId}`,
      method: 'put',
      data: applyVo
    })
  },

  getReviewListByChapterId(chapterId){
    return request({
      url: `${url}/chapter/${chapterId}`,
      method: 'get'
    })
  },
  getReviewListBySectionId(sectionId){
    return request({
      url: `${url}/section/${sectionId}`,
      method: 'get'
    })
  },
  getPageCourseReviewList(page,limit){
    return request({
      url: `${url}/${page}/${limit}`,
      method: 'get'
    })
  },

}
