import request from '@/utils/request'
const url = '/eduservice/admin/edu-chapter'

export default{
    getChapterById(id){
        return request({
            url: `${url}/${id}`,
            method: 'get'
        })
    },
    addChapter(chapterVo){
        return request({
            url: `${url}`,
            method: 'post',
            data: chapterVo
        })
    },
    updateChapterById(id,chapterVo){
        return request({
            url: `${url}/${id}`,
            method: 'put',
            data: chapterVo
        })
    },
    deleteChapterById(id){
        return request({
            url: `${url}/${id}`,
            method: 'delete',
        })
    },

}
