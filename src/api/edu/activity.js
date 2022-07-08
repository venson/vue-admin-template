import request from '@/utils/request'
const activityUrl='/eduservice/edu-activity'

export default {
    getPageActivity(page, limit, filter){
        return request({
            url: `${activityUrl}/${page}/${limit}`,
            method: 'post',
            data: filter
        })
    },
    getActivity(id){
        return request({
            url: `${activityUrl}/${id}`,
            method: 'get'
        })
    },
    addActivity(activity){
        return request({
            url: `${activityUrl}`,
            method: 'post',
            data: activity
        })
    },
    updateActivity(id,activity){
        return request({
            url: `${activityUrl}/${id}`,
            method: 'put',
            data: activity
        })
    },
    deleteActivity(id){
        return request({
            url: `${activityUrl}/${id}`,
            method: 'delete',
        })
    },

    getPageRequestList(page,limit){
        return request({
            url: `${activityUrl}/publish/${page}/${limit}`,
            method: 'get',
        })
    },
    requestPublish(id){
        return request({
            url: `${activityUrl}/publish/${id}`,
            method: 'post',
        })
    },
    publish(id){
        return request({
            url: `${activityUrl}/publish/${id}`,
            method: 'put',
        })
    },
    reject(id){
        return request({
            url: `${activityUrl}/publish/${id}`,
            method: 'delete',
        })
    },


}