import request from '@/utils/request'
const researchUrl = '/eduservice/edu-research'

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
    publishRequest(id){
        return request({
            url:  `${researchUrl}/publish/${id}`,
            method: 'post',
        })
    },
    publish(id){
        return request({
            url: `${researchUrl}/publish/${id}`,
            method: 'put',
        })
    },
    getPublishList(){
        return request({
            url: `${researchUrl}/publish`,
            method: 'get',
        })

    },
    publishReject(id){
        return request({
            url:  `${researchUrl}/reject/${id}`,
            method: 'put',
        })
    },
}