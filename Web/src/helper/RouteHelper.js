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

	static getInstanceRouteForResource(schemes,modelscheme,tableName,resource){
		let primaryKeyFields = SchemeHelper.getPrimaryAttributeKeys(modelscheme);
		let getRoute = schemes[tableName]["GET"];
		getRoute = getRoute.replace("/api/","");
		for(let i=0; i<primaryKeyFields.length; i++){
			let primaryKeyField = primaryKeyFields[i];
			let value = resource[primaryKeyField];
			getRoute = getRoute.replace(":"+tableName+"_"+primaryKeyField,value)
		}
		return getRoute;
	}

	static getInstanceRouteForAssociatedResource(schemes,resourceModelScheme,resourceTablename, resource, associationModelScheme, associationName, associationResource){
		let resourceInstanceRoute = RouteHelper.getInstanceRouteForResource(schemes, resourceModelScheme,resourceTablename,resource);
		let associationRoute = resourceInstanceRoute+"/associations/";
		return associationRoute;
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
