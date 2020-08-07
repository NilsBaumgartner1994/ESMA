import React, { Component } from "react";
import {SchemeHelper} from "./SchemeHelper";

export class RouteHelper extends Component {

	static getInstanceRoute(schemes, tableName){
		let getRoute = schemes[tableName]["GET"];
		getRoute = getRoute.replace("/api","");
		return getRoute;
	}

	static getInstanceRouteForParams(schemes, tableName, params){
		let getRoute = schemes[tableName]["GET"];
		getRoute = getRoute.replace("/api/","");
		let paramKeys = Object.keys(params);
		for(let i=0;i<paramKeys.length; i++){
			let paramKey = paramKeys[i];
			getRoute = getRoute.replace(":"+paramKey,params[paramKey]);
		}
		return getRoute;
	}

	static getInstanceResourceRoute(schemeRouteGET,scheme,tableName,resource){
			schemeRouteGET = schemeRouteGET.replace("/api","");

			let primaryAttributeKeys = SchemeHelper.getPrimaryAttributeKeys(scheme);
			for(let i=0;i<primaryAttributeKeys.length; i++){
				let key = primaryAttributeKeys[i];
				let value = resource[key];
				if(!!value){
					let routeParamKey = ":"+tableName+"_"+key;
					schemeRouteGET = schemeRouteGET.replace(routeParamKey,value);
				}
			}

			if(schemeRouteGET.includes(":")){ //if there are still unresolved params, we have no complete route
				return undefined;
			}

			let route = schemeRouteGET;
			return route;
	}

	static getIndexRouteForResource(schemes, tableName){
		let getRoute = schemes[tableName]["INDEX"];
		getRoute = getRoute.replace("/api/","");
		return getRoute;
	}

	static getCreateRouteForResource(schemes, tableName){
		let getRoute = RouteHelper.getIndexRouteForResource(schemes,tableName);
		getRoute = "/create/"+getRoute;
		return getRoute;
	}

}
