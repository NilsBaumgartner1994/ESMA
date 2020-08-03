import React, {Component} from 'react';
import {DataTable} from '../../components/datatable/DataTable';
import {Column} from '../../components/column/Column';
import {InputText} from '../../components/inputtext/InputText';
import {Dropdown} from '../../components/dropdown/Dropdown';
import {ProgressSpinner} from '../../components/progressspinner/ProgressSpinner';
import {MultiSelect} from '../../components/multiselect/MultiSelect';
import {Link} from 'react-router-dom';

import {Button} from '../../components/button/Button';

import {InputSwitch} from "../../components/inputswitch/InputSwitch";
import {RequestHelper} from "../../module/RequestHelper";
import {SchemeHelper} from "../../helper/SchemeHelper";
import {RouteHelper} from "../../helper/RouteHelper";

export class ResourceIndex extends Component {

    static searchLoopIcon = "\ud83d\udd0d";
    static defaultDivStyle = {"textAlign":"center","wordBreak": "break-word"};

    constructor(schemes) {
        super();
        this.state = {
            schemes: schemes,
            isLoading: true,
            advanced: false,
        };
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        let tableName = params.tableName;

        this.loadResources(tableName);
    }

    async loadResources(tableName) {
        let createRoute = RouteHelper.getCreateRouteForResource(this.state.schemes,tableName);
        let scheme = await RequestHelper.sendRequestNormal("GET","schemes/"+tableName);
        let routes = await RequestHelper.sendRequestNormal("GET","schemes/"+tableName+"/routes");
        let resourcesAnswer = await RequestHelper.sendRequestNormal("GET","models/"+tableName);

        let resources = resourcesAnswer || [];

        this.setState({
            isLoading: false,
	        resources: resources,
            scheme: scheme,
            routes: routes,
            createRoute: createRoute,
            tableName: tableName
        });
    }

    renderHeader() {
        return (
            <div style={{'textAlign': 'left'}}>
                <i className="pi pi-search" style={{margin: '4px 4px 0 0'}}/>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})}
                           placeholder="Global Search" size="50"/>
            </div>
        );
    }

    filterUnimportantAttributeKeys(attributeKeys){
        let unimportantKeys = ["createdAt","updatedAt"];
        let filtered = attributeKeys.filter(function(value, index, arr){
            return !unimportantKeys.includes(value);
        });
        return filtered;
    }

    getAttributeKeysToDisplay(){
        let attributeKeys = SchemeHelper.getSortedAttributeKeys(this.state.scheme);
        if(!this.state.advanced){
            attributeKeys = this.filterUnimportantAttributeKeys(attributeKeys);
        }
        return attributeKeys;
    }

    renderColumns(){
        let scheme = this.state.scheme;
        if(!!scheme){
            let attributeKeys = this.getAttributeKeysToDisplay();

            let columns = [];
            let attributeColumns = attributeKeys.map(attributeKey => (
                this.renderColumn(attributeKey,attributeKey)
            ));

            columns.push(this.renderActionColumn());
            columns.push(attributeColumns);
            return columns;
        } else {
            return (<div></div>);
        }
    }

    renderActionColumn(){
        let body = this.actionTemplate.bind(this);
        return (<Column key={"actionColumn"} body={body} style={{textAlign:'center', width: '4em'}}/>);
    }

    actionTemplate(rowData, column) {
        let route = this.getInstanceRoute(rowData);
        if(!route){
           return (<div></div>);
        }

        return <div>
            <Link to={route}>
            <Button type="button" icon="pi pi-search" className="p-button-success"></Button>
            </Link>
        </div>;
    }

    getInstanceRoute(rowData){
        let schemeRouteGET = this.state.routes["GET"];
        schemeRouteGET = schemeRouteGET.replace("/api","");

        let tableName = this.state.tableName;
        let attributeKeys = SchemeHelper.getAttributeKeys(this.state.scheme);
        for(let i=0;i<attributeKeys.length; i++){
            let key = attributeKeys[i];
            if(SchemeHelper.isPrimaryKey(this.state.scheme, key)){
                let value = rowData[key];
                if(!!value){
                    let routeParamKey = ":"+tableName+"_"+key;
                    schemeRouteGET = schemeRouteGET.replace(routeParamKey,value);
                }
            }
        }

        if(schemeRouteGET.includes(":")){ //if there are still unresolved params, we have no complete route
            return undefined;
        }

        let route = schemeRouteGET;
        return route;
    }

    renderColumn(field,headerText){
        let customStyles = ResourceIndex.defaultDivStyle;
        let keyIcon = "";

        if(SchemeHelper.isPrimaryKey(this.state.scheme, field)){
            keyIcon = (<div style={{"color": "#FBE64A"}}> <i className="pi pi-key"></i></div>);
        }
        let header = (<div style={customStyles}>{headerText}{keyIcon}</div>);

        let body = null;
        if(SchemeHelper.isReferenceField(this.state.scheme,field)){
            body = this.getReferenceFieldBody(field);
        }

        return this.renderDefaultColumn(field,header,body);
    }

    renderDefaultColumn(field,header,body){
        if(!body){
            body = this.defaultBodyTemplate.bind(this, field);
        }

        if(SchemeHelper.isTypeJSON(this.state.scheme,field)){
            body = this.bodyTemplateJSON.bind(this,field);
        }

        return (<Column key={field} field={field} header={header} body={body} sortable filterMatchMode="contains" filter filterPlaceholder={ResourceIndex.searchLoopIcon+" search"}/>);
    }

    bodyTemplateJSON(field, rowData, column){
        return <div style={ResourceIndex.defaultDivStyle}>{JSON.stringify(rowData[field])}</div>;
    }

    defaultBodyTemplate(field, rowData, column){
        return <div style={ResourceIndex.defaultDivStyle}>{rowData[field]}</div>;
    }

    getReferenceFieldBody(field){
        return this.referenceFieldBodyTemplate.bind(this, field);
    }

    referenceFieldBodyTemplate(field, rowData, column) {
        let referenceId = rowData[field];
        if(!referenceId){
            return (<div></div>);
        }

        let referenceTableName = this.state.scheme[field].references.model;
        let route = '/models/'+referenceTableName+"/"+referenceId;

        return <div style={ResourceIndex.defaultDivStyle}>
            <Link to={route}>
                <Button type="button" className="p-button-success" label={""+referenceId} iconPos="right" icon="pi pi-search" style={{"width":"100%"}} ></Button>
            </Link>
        </div>;
    }


    renderDataTable(){
        let emptyMessage = "No records found";
        if (this.state.isLoading) {
            emptyMessage = <ProgressSpinner/>
        }

        let columns = this.renderColumns();

        const header = this.renderHeader();

            return (
                <DataTable ref={(el) => this.dt = el} responsive={true} value={this.state.resources} paginator={true} rows={10}
                           header={header}
                           globalFilter={this.state.globalFilter} emptyMessage={emptyMessage}>
                    {columns}
                </DataTable>
            );
    }

    renderCreateButton(){
        let route = this.state.createRoute;

        if(!!route) {
            return (
                <Link to={route} style={{"background-color":"transparent"}}>
                    <Button type="button" className="p-button-success" label={"Create"} iconPos="right"
                            icon="pi pi-plus" ></Button >
                </Link >
            );
        } else {
            return null;
        }
    }

    render() {
        let dataTable = this.renderDataTable();

        let amountOfResources = "?";
        if(!!this.state.resources){
            console.log("Resources Found: "+this.state.resources.length);
            amountOfResources = this.state.resources.length;
        }
	    let tableName = this.state.tableName || "";

        return (
            <div>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>All {tableName} ({amountOfResources})</h1>
                        <p></p>
                        <table style={{width: "100%"}}>
                            <tr>
                                <td align={"left"}>
                                    {this.renderCreateButton()}
                                </td>
                                <td align="right">
                                    <p>Advanced: </p>
                                    <InputSwitch checked={this.state.advanced} onChange={(e) => this.setState({advanced: e.value})} />
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div className="content-section implementation">
                    {dataTable}
                </div>
            </div>
        );
    }
}
