import {RequestHelper} from "./RequestHelper";

export class DefaultResourcePhotoService {

    static async handleDelete(resourceName, resource_id) {
        let answer = await RequestHelper.sendRequestNormal("DELETE",resourceName+'/'+resource_id+"/photos");
        return answer;
    }

    static handleGetUrl(resourceName, resource_id){
        return RequestHelper.getAPIURL()+resourceName+"/"+resource_id+"/photos";
    }

}
