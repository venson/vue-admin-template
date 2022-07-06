import request from '@/utils/request'
const methodologyUrl = '/eduservice/edu-methodology'

export default {
    getMethodologyList(){
        return request({
            url:  `${methodologyUrl}`,
            method: 'get'
        })
    },
    getMethodologyById(id){
        return request({
            url:  `${methodologyUrl}/${id}`,
            method: 'get'
        })
    },
    updateMethodology(id, methodology){
        return request({
            url:  `${methodologyUrl}/${id}`,
            method: 'put',
            data: methodology
        })
    },
    publishRequest(id){
        return request({
            url:  `${methodologyUrl}/publish/${id}`,
            method: 'post',
        })
    },
    publish(id){
        return request({
            url: `${methodologyUrl}/publish/${id}`,
            method: 'put',
        })
    },
    getPublishList(){
        return request({
            url: `${methodologyUrl}/publish`,
            method: 'get',
        })

    },
    publishReject(id){
        return request({
            url:  `${methodologyUrl}/reject/${id}`,
            method: 'put',
        })
    },
}