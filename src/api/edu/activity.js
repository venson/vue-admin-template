import request from '@/utils/request'
const activityUrl='/eduservice/admin/edu-activity'

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
            url: `${activityUrl}/review/${page}/${limit}`,
            method: 'get',
        })
    },
    requestReviewByActivityId(id, reviewVo){
        return request({
            url: `${activityUrl}/review/${id}`,
            method: 'post',
          data: reviewVo,
        })
    },
    passReviewByActivityId(id, reviewVo){
        return request({
            url: `${activityUrl}/review/${id}`,
            method: 'put',
            data: reviewVo,
        })
    },
    rejectReviewByActivityId(id, reviewVo){
        return request({
            url: `${activityUrl}/review/reject/${id}`,
          data: reviewVo,
            method: 'post',
        })
    },


}
