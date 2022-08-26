import request from '@/utils/request'
const url='/eduservice/admin/edu-content'

export default {
    getTreeNode(courseId){
        return request({
            url: `${url}/${courseId}`,
            method: 'get'
        })
    },
    getChapter(chapterId){
        return request({
            url: `${url}/chapter/${chapterId}`,
            method: 'get'
        })
    },
    getSection(sectionId){
        return request({
            url: `${url}/section/${sectionId}`,
            method: 'get'
        })
    },
    getChapterMarkdown(chapterId){
        return request({
            url: `${url}/chaptermd/${chapterId}`,
            method: 'get'
        })
    },
    getSectionMarkdown(id){
        return request({
            url: `/eduservice/edu-content/section/${id}`,
            method: 'get'
        })
    },
}
