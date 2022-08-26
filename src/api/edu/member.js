import request from "@/utils/request";
const url='/eduservice/admin/edu-member'

export default {
  getMemberListPage(current, limit, memberQuerry) {
    return request({
      url: `${url}/${current}/${limit}`,
      method: "post",
      data: memberQuerry,
    });
  },

  deleteMemberById(id) {
    return request({
      url: `${url}${id}`,
      method: "delete",
    });
  },

  addMember(member) {
    return request({
      url: `${url}`,
      method: "post",
      data: member,
    });
  },

  getMemberInfoById(id) {
    return request({
      url: `${url}/${id}`,
      method: "get"
    });
  },
  updateMember(member){
    return request({
      url: `${url}`,
      method: 'put',
      data: member
    })
  }

};
