import request from '@/utils/request'
const researchUrl = '/eduservice/admin/edu-research'

export default {
    getResearchList(){
        return request({
            url:  `${researchUrl}`,
            method: 'get'
        })
    },
    getResearchById(id){
        return request({
            url:  `${researchUrl}/${id}`,
            method: 'get'
        })
    },
    updateResearch(id, research){
        return request({
            url:  `${researchUrl}/${id}`,
            method: 'put',
            data: research
        })
    },
    requestReviewById(id, applyVo){
        return request({
            url:  `${researchUrl}/review/${id}`,
            method: 'post',
            data: applyVo,
        })
    },
    passReviewById(id, reviewVo){
        return request({
            url: `${researchUrl}/review/${id}`,
            method: 'put',
            data: reviewVo,
        })
    },
    rejectReviewById(id,reviewVo){
        return request({
            url:  `${researchUrl}/review/reject/${id}`,
            method: 'post',
            data: reviewVo
        })
    },
    getResearchReviewList(){
      return request({
        url: `${researchUrl}/review`,
        method: 'get'
      })
    }

}
