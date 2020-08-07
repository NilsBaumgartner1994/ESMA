import React, { Component } from "react";

export class SchemeHelper extends Component {

	static getAttributeKeys(scheme){
		return Object.keys(scheme);
	}

	static getSortedAttributeKeys(scheme){
		let attributeKeys = SchemeHelper.getAttributeKeys(scheme);
		attributeKeys.sort(function(a, b){
			let valueA = SchemeHelper.isPrimaryKey(scheme, a) ? 1 : 0;
			let valueB = SchemeHelper.isPrimaryKey(scheme, b) ? 1 : 0;
			return valueB-valueA;
		});
		return attributeKeys;
	}

	static getPrimaryAttributeKeys(scheme){
		let attributeKeys = SchemeHelper.getAttributeKeys(scheme);
		let primaryAttributeKeys = [];
		for(let i=0;i<attributeKeys.length; i++){
			let key = attributeKeys[i];
			if(SchemeHelper.isPrimaryKey(scheme, key)){
				primaryAttributeKeys.push(key);
			}
		}
		return primaryAttributeKeys;
	}

	static getType(scheme, field){
		return scheme[field].type.key;
	}

	static getTypeStringMaxLength(scheme, field){
		return scheme[field].type._length;
	}

	static isTypeJSON(scheme, field){
		return SchemeHelper.getType(scheme,field) === "JSON";
	}

	static isAllowedNull(scheme,field){
		return scheme[field].allowNull!==false;
	}

	static isPrimaryKey(scheme, field){
		return scheme[field].primaryKey;
	}

	static isReferenceField(scheme, field){
		return !!scheme[field].references;
	}

	static isAutoGenerated(scheme, field) {
		return !!scheme[field]._autoGenerated;
	}

	static isEditable(scheme, field){
		let isPrimary = SchemeHelper.isPrimaryKey(scheme, field);
		let isAutoGenerated = SchemeHelper.isAutoGenerated(scheme, field);
		return !isPrimary && !isAutoGenerated;
	}

}
