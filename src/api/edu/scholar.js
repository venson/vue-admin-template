import request from '@/utils/request'

const scholarUrl='/eduservice/admin/edu-scholar'
const memberUrl='/eduservice/admin/edu-member-scholar'
const citationUrl='/eduservice/admin/edu-scholar-citation'
export default {
    // method for scholar
    getPageScholar(page, limit){
        return request({
            url: `${scholarUrl}/${page}/${limit}`,
            method: 'get'
        })
    },
    addScholar(scholar){
        return request({
            url: `${scholarUrl}`,
            method: 'post',
            data: scholar
        })
    },
    updateScholar(id, scholar){
        return request({
            url: `${scholarUrl}/${id}`,
            method: 'put',
            data: scholar
        })
    },

    getScholar(id){
        return request({
            url: `${scholarUrl}/${id}`,
            method: 'get'
        })
    },
    deleteScholar(id){
        return request({
            url: `${scholarUrl}/${id}`,
            method: 'delete'
        })
    },

    // method for member

    getMemberList(scholarId){
        return request({
            url: `${memberUrl}/${scholarId}`,
            method: 'get'
        })
    },
    addScholarMember(scholarId, memberList){
        return request({
            url: `${memberUrl}/${scholarId}`,
            method: 'post',
            data: memberList
        })
    },
    updateScholarMember(scholarId, memberList){
        return request({
            url: `${memberUrl}/${scholarId}`,
            method: 'put',
            data: memberList
        })
    },

    deleteMemberByScholarId(scholarId){
        return request({
            url: `${memberUrl}/${scholarId}`,
            method: 'delete',
        })
    },
    deleteMemberByMemberId(memberIdList){
        return request({
            url: `${memberUrl}/${memberIdList}`,
            method: 'delete'

        })
    },

    // method for citation

    getCitationByScholarId(scholarId){
        return request({
            url: `${citationUrl}/${scholarId}`,
            method: 'get'
        })
    },
    addScholarCitation(citationList){
        return request({
            url: `${citationUrl}`,
            method: 'post',
            data: citationList
        })
    },
    updateScholarCitation(scholarId, citationList){
        return request({
            url: `${citationUrl}/${scholarId}`,
            method: 'put',
            data: citationList
        })
    },


}
