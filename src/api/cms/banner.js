import request from '@/utils/request'

const api_name = '/educms/bannerAdmin'

export default {

  getPageList(page, limit) {
    return request({
      url: `${api_name}/banner/${page}/${limit}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${api_name}/banner/${id}`,
      method: 'get'
    })
  },

  save(role) {
    return request({
      url: `${api_name}/banner`,
      method: 'post',
      data: role
    })
  },

  updateBanner(role) {
    return request({
      url: `${api_name}/banner`,
      method: 'put',
      data: role
    })
  },
  updateBatch(batchList) {
    return request({
      url: `${api_name}/bannerBactch`,
      method: 'put',
      data: batchList
    })
  },
  removeBanner(id) {
    return request({
      url: `${api_name}/banner/${id}`,
      method: 'delete'
    })
  },
  removeBannerBatch(idList) {
    return request({
      url: `${api_name}/banner`,
      method: 'delete',
      data: idList
    })
  }

}