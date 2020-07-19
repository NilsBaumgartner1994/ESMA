import config from "./../config";

export class RequestHelper {

    static getAPIURL(){
        if(!!config.specificAPIURL){
            return config.specificAPIURL;
        }
        let base_url = window.location.origin;
        console.log("base_url");
        console.log(base_url);
        return base_url+"/api/";
    }

    /**
     * Privater
     * @param requestType
     * @param resource_url
     * @param payload_json
     * @param headers
     * @returns {Promise<undefined|any>}
     */
    static async private_sendRequest(requestType, resource_url, payload_json, headers){
        payload_json = payload_json || {};
        //console.warn("SendRequest to: "+url);
        let payload = JSON.stringify(payload_json);

        resource_url = RequestHelper.getAPIURL()+resource_url;
        console.log("resource_url:");
        console.log(resource_url);

        let response = undefined;
        console.log("private_sendRequest: payload: ");
        console.log(payload_json);

        if(requestType==="GET"){
            response = await fetch(resource_url, {
                method: requestType,
                credentials: 'include',
                headers: headers,
            });
        } else {
            response = await fetch(resource_url, {
                method: requestType,
                headers: headers,
                credentials: 'include',
                body: payload,
            });
        }
        try {

            console.log(response);
            let answer = await response.json();
            console.log(answer);
            return answer;
        } catch(e){
            console.log("Error at: ");
            console.log(e);
            console.log("requestType: "+requestType);
            console.log("resource_url: "+resource_url);
            console.log("payload_json: "+payload_json);
            return undefined;
        }
    }

    static async sendRequestNormal(requestType, resource_url, payload_json){
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        //headers = headers.set('Authorization', 'Basic ' + Buffer.from(":").toString('base64'));
        
        return await RequestHelper.private_sendRequest(requestType, resource_url, payload_json,headers);
    }
}
