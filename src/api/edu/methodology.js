import request from '@/utils/request'
const url = '/eduservice/admin/edu-methodology'

export default {
    getMethodologyList(){
        return request({
            url:  `${url}`,
            method: 'get'
        })
    },
    getMethodologyById(id){
        return request({
            url:  `${url}/${id}`,
            method: 'get'
        })
    },
    updateMethodology(id, methodology){
        return request({
            url:  `${url}/${id}`,
            method: 'put',
            data: methodology
        })
    },
  requestReviewById(id, applyVo){
    return request({
      url:  `${url}/review/${id}`,
      method: 'post',
      data: applyVo,
    })
  },
  passReviewById(id, reviewVo){
    return request({
      url: `${url}/review/${id}`,
      method: 'put',
      data: reviewVo,
    })
  },
  rejectReviewById(id,reviewVo){
    return request({
      url:  `${url}/review/reject/${id}`,
      method: 'post',
      data: reviewVo
    })
  },
  getResearchReviewList(){
    return request({
      url: `${url}/review`,
      method: 'get'
    })
  }
}
