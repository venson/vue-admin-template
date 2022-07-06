import request from "@/utils/request";

export default {
  getMemberListPage(current, limit, memberQuerry) {
    return request({
      // url: '/eduservice/edu-member/'+ current ,
      url: `/eduservice/edu-member/pageMemberCondition/${current}/${limit}`,
      method: "post",
      data: memberQuerry,
    });
  },

  deleteMemberById(id) {
    return request({
      url: `/eduservice/edu-member/${id}`,
      method: "delete",
    });
  },

  addMember(member) {
    return request({
      url: `/eduservice/edu-member/addMember`,
      method: "post",
      data: member,
    });
  },

  getMemberInfoById(id) {
    return request({
      url: `/eduservice/edu-member/getMember/${id}`,
      method: "get"
    });
  },
  updateMember(member){
    return request({
      url: `/eduservice/edu-member/updateMember`,
      method: 'post',
      data: member
    })
  }

};
