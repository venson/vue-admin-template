import request from '@/utils/request'
const url = '/eduservice/admin/edu-section'

export default {

    getSectionById(id){
        return request({
            url: `${url}/${id}`,
            method: 'get'
        })
    },
    addSection(sectionVo){
        return request({
            url: `${url}`,
            method: 'post',
            data: sectionVo
        })
    },
    updateSectionById(id,sectionVo){
        return request({
            url: `${url}/${id}`,
            method: 'put',
            data: sectionVo
        })
    },
    deleteSectionById(id){
        return request({
            url: `${url}/${id}`,
            method: 'delete',
        })
    },

}
