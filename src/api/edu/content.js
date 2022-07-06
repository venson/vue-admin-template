import request from '@/utils/request'

export default {
    getChapterContent(id){
        return request({
            url: `/eduservice/edu-content/chapter/${id}`,
            method: 'get'
        })
    },
    getSectionContent(id){
        return request({
            url: `/eduservice/edu-content/section/${id}`,
            method: 'get'
        })
    },
    updateContent(content){
        return request({
            url: `/eduservice/edu-content/${content.id}`,
            method: 'put',
            data: content
        })
    },
    saveContent(content){
        return request({
            url: `/eduservice/edu-content`,
            method: 'post',
            data: content
        })
    }
}