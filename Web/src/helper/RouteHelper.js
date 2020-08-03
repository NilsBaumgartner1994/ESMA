import React, { Component } from "react";

export class RouteHelper extends Component {

	static getInstanceRoute(schemes, tableName){
		let getRoute = schemes[tableName]["GET"];
		getRoute = getRoute.replace("/api","");
		return getRoute;
	}

	static getInstanceRouteForResource(schemes, tableName, params){
		let getRoute = schemes[tableName]["GET"];
		getRoute = getRoute.replace("/api/","");
		let paramKeys = Object.keys(params);
		for(let i=0;i<paramKeys.length; i++){
			let paramKey = paramKeys[i];
			getRoute = getRoute.replace(":"+paramKey,params[paramKey]);
		}
		return getRoute;
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
