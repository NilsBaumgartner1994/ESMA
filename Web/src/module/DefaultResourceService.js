import {RequestHelper} from "./RequestHelper";

// Eine Klasse für erleiterte Zugriffe auf Resourcen des Server
export class DefaultResourceService {

    /**
     * Alle Einträge einer Resource
     * @param resourceName Resourcenname z.B. meals
     * @returns {Promise<Array|*>} Liste aller Einträge
     */
    static async handleIndex(resourceName) {
        console.log("[DefaultResourceService]: "+resourceName+" Index request");
        let answer = await RequestHelper.sendRequestNormal("GET",resourceName);
        if(answer==undefined){ // bei einem Problem
            return []; // gebe leere Liste aus
        }
        return answer;
    }

    /**
     * Eine Resource erstellen
     * @param resourceName Resourcenname z.B. meals
     * @param payloadJSON Nutzlatz z.B. {name: "Pommes"}
     * @returns {Promise<*>} Erstellte Resource
     */
    static async handleCreate(resourceName, payloadJSON) {
        console.log("[DefaultResourceService]: "+resourceName+" Create Request");
        let answer = await RequestHelper.sendRequestNormal("POST",resourceName,payloadJSON);
        return answer;
    }

    /**
     * Eine Resource anfordern
     * @param resourceName Resourcenname z.B. meals
     * @param resource_id Die ID der Resource z.B. 123
     * @returns {Promise<*>} Gefundene Resource
     */
    static async handleGet(resourceName, resource_id) {
        console.log("[DefaultResourceService]: "+resourceName+" Get Request: "+resource_id);
        let answer = await RequestHelper.sendRequestNormal("GET",resourceName+'/'+resource_id);
        return answer;
    }

    /**
     * Die Assoziationen einer Resource anfordern
     * @param resourceName Resourcenname z.B. meals
     * @param resource_id Die ID der Resource z.B. 123
     * @param routeAfterResource eine Assozierte Resource z.B. building
     * @returns {Promise<*>} Eine oder mehrere assozierte Resourcen
     */
    static async handleGetAssociation(resourceName, resource_id, routeAfterResource) {
        console.log("[DefaultResourceService]: "+resourceName+" Get Association Request: "+resource_id);
        let answer = await RequestHelper.sendRequestNormal("GET",resourceName+'/'+resource_id+"/"+routeAfterResource);
        return answer;
    }

    /**
     * Eine Resource aktualisieren
     * @param resourceName Resourcenname z.B. meals
     * @param resource_id Die ID der Resource z.B. 123
     * @param payloadJSON Nutzlatz z.B. {name: "Pommes"}
     * @returns {Promise<*>} Aktualisierte Resource
     */
    static async handleUpdate(resourceName, resource_id, payloadJSON) {
        console.log("[DefaultResourceService]: "+resourceName+" Update Request: "+resource_id);
        let answer = await RequestHelper.sendRequestNormal("POST",resourceName+'/'+resource_id,payloadJSON);
        return answer;
    }

    /**
     * Eine Resource löschen
     * @param resourceName Resourcenname z.B. meals
     * @param resource_id Die ID der Resource z.B. 123
     * @returns {Promise<*>} boolean
     */
    static async handleDelete(resourceName, resource_id) {
        console.log("[DefaultResourceService]: "+resourceName+" Delete Request: "+resource_id);
        let answer = await RequestHelper.sendRequestNormal("DELETE",resourceName+'/'+resource_id);
        return answer;
    }

}