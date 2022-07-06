import request from '@/utils/request';

export default {
    uploadImage(file){
        return request({
            url: '/eduoss/fileoss',
            method: 'post',
            data: file
        })
    }

}