import React, {Component} from 'react';
import {DataTable} from '../../components/datatable/DataTable';
import {Paginator} from '../../components/paginator/Paginator';
import {Column} from '../../components/column/Column';
import {InputText} from '../../components/inputtext/InputText';
import {Dropdown} from '../../components/dropdown/Dropdown';
import {ProgressSpinner} from '../../components/progressspinner/ProgressSpinner';
import {MultiSelect} from '../../components/multiselect/MultiSelect';
import {Calendar} from '../../components/calendar/Calendar';
import {Link} from 'react-router-dom';
import {Checkbox} from '../../components/checkbox/Checkbox';

import {Button} from '../../components/button/Button';

import {InputSwitch} from "../../components/inputswitch/InputSwitch";
import {RequestHelper} from "../../module/RequestHelper";
import {SchemeHelper} from "../../helper/SchemeHelper";
import {RouteHelper} from "../../helper/RouteHelper";
import {ResourceIndex} from "./ResourceIndex";

export class AssociationIndexOverlay extends Component {
    static searchLoopIcon = "\ud83d\udd0d";
    static defaultDivStyle = {"textAlign":"center","wordBreak": "break-word"};

    constructor(props) {
        super(props);


        this.state = {
            tableName: props.tableName,
            scheme: props.scheme,
            callbackFunction: props.callbackFunction,
            functionLabel: props.functionLabel,
            associatedResources: props.associatedResources,
            associatedResourcesMap: {},
            showOnlyAssociated: props.showOnlyAssociated || false,
            selectedResourcesMap: {},
            isLoading: true,
            advanced: false,
            limit : ResourceIndex.DEFAULT_ITEMS_PER_PAGE,
            offset : 0,
            page: 0,
            count: 0,
            multiSortMeta: {}
        };
    }

    getAssociatedResourceMap(associatedResources,routes,tableName,scheme){
        let associatedResourcesMap = {};
        for(let i=0; i<associatedResources.length; i++){
            let resource = associatedResources[i];
            let route = this.getInstanceRouteWithParams(resource,routes,tableName,scheme)
            associatedResourcesMap[route] = resource;
        }
        return associatedResourcesMap;
    }

    componentDidMount() {
        this.loadConfigs(this.state.tableName,this.state.scheme);
    }

    async loadConfigs(tableName,scheme) {
        let routes = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_GET,"schemes/"+tableName+"/routes");
        let countAnswer = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_GET,"models/"+"count/"+tableName);

        let count = countAnswer.count || 0;

        await this.setState({
            isLoading: false,
            scheme: scheme,
            count: count,
            routes: routes,
            tableName: tableName,
            associatedResourcesMap: this.getAssociatedResourceMap(this.state.associatedResources,routes,tableName,scheme)
        });

        await this.loadResourcesFromServer();
    }

    async loadResourcesFromServer(){
        if(this.state.showOnlyAssociated){
            await this.setState({
                resources: this.state.associatedResources
            });
        } else {
            let tableName = this.state.tableName;
            let offset = this.state.offset;
            let limit = this.state.limit;

            let orderParam = "";
            let multiSortMeta = this.state.multiSortMeta;
            if(!!multiSortMeta && multiSortMeta.length>0){
                orderParam = orderParam+"&order=[";
                console.log(multiSortMeta);
                for(let i=0; i<multiSortMeta.length; i++){
                    if(i>0){
                        orderParam+=",";
                    }
                    let field = multiSortMeta[i].field;
                    let ascending = multiSortMeta[i].order === 1;
                    let ASCDESC = ascending ? "ASC" : "DESC";
                    orderParam = orderParam+'["'+field+'","'+ASCDESC+'"]';
                }
                orderParam = orderParam+"]";
            }
            console.log("orderParam: "+orderParam);
            console.log("URL: "+"models/"+tableName+"?limit="+limit+"&offset="+offset+orderParam);

            let resourcesAnswer = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_GET,"models/"+tableName+"?limit="+limit+"&offset="+offset+orderParam);
            let resources = resourcesAnswer || [];

            await this.setState({
                resources: resources
            });
        }
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

        let isSelected = !!this.state.selectedResourcesMap[route];
        let isAssociated = !!this.state.associatedResourcesMap[route];

        let isDisabled = false;
        if(this.state.showOnlyAssociated){ //TODO if this is sufficent, then collaple the function to inline
            isDisabled = !isAssociated;
        } else {
            isDisabled = isAssociated;
            isSelected = isAssociated ? true : isSelected;
        }

        return <div>
            <Checkbox disabled={isDisabled} onChange={e => {
                let selectedResourcesMap = this.state.selectedResourcesMap;
                if(e.checked){
                    selectedResourcesMap[route] = rowData;
                } else {
                    delete selectedResourcesMap[route];
                }
                this.setState({selectedResourcesMap: selectedResourcesMap});
            }} checked={isSelected}></Checkbox>
        </div>;
    }

    getInstanceRoute(rowData){
        return this.getInstanceRouteWithParams(rowData,this.state.routes,this.state.tableName,this.state.scheme);
    }

    getInstanceRouteWithParams(rowData,routes,tableName,scheme){
        let schemeRouteGET = routes["GET"];
        schemeRouteGET = schemeRouteGET.replace("/api","");

        let primaryAttributeKeys = SchemeHelper.getPrimaryAttributeKeys(scheme);
        for(let i=0;i<primaryAttributeKeys.length; i++){
            let key = primaryAttributeKeys[i];
            let value = rowData[key];
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
        let scheme = this.state.scheme;

        if(SchemeHelper.isTypeJSON(scheme,field)){
            body = this.bodyTemplateJSON.bind(this,field);
        }

        let filterType = "text";
        if(SchemeHelper.isTypeInteger(scheme, field)){
            filterType = "number";
        }
        //TODO implement Type specific filter
        // https://www.primefaces.org/primereact/showcase/#/datatable/filter
        //const dateFilter = <Calendar value={this.state.selectedDate} onChange={(e) => this.setState({ selectedDate: e.value })} dateFormat="yy-mm-dd" className="p-column-filter" placeholder="Registration Date"/>;

        //TODO implement differend filterMatchMode
        // Add a button to choose the filterMatchMode
        // https://www.primefaces.org/primereact/showcase/#/datatable

        return (<Column key={field} filterType={filterType} field={field} header={header} body={body} sortable filterMatchMode="contains" filter filterPlaceholder={ResourceIndex.searchLoopIcon+" search"}/>);
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

    async handleOnSort(event){
        await this.setState({multiSortMeta: event.multiSortMeta});
        await this.loadResourcesFromServer();
    }

    async handleOnFilter(event){
        console.log(event);
        //TODO implement good filtering on backend
        // https://sequelize.org/master/manual/model-querying-basics.html OPERATORS
        this.setState({filters: event.filters});
    }

    renderDataTable(){
        let emptyMessage = "No records found";
        if (this.state.isLoading) {
            emptyMessage = <ProgressSpinner/>
        }

        let columns = this.renderColumns();

        const header = this.renderHeader();

            return (
                <DataTable key={"Datatable:"+this.state.limit+JSON.stringify(this.state.multiSortMeta)}
                    ref={(el) => this.dt = el}
                   filters={this.state.filters}
                   onFilter={(e) => this.handleOnFilter(e)}
                    sortMode="multiple"
                   multiSortMeta={this.state.multiSortMeta} onSort={(e) => this.handleOnSort(e)}
                   responsive={true}
                   value={this.state.resources}
                   rows={this.state.limit}
                   header={header}
                   globalFilter={this.state.globalFilter} emptyMessage={emptyMessage}>
                    {columns}
                </DataTable>
            );
    }

    renderSubmitButton(){
        if(!!this.state.callbackFunction) {
            return (
                    <Button type="button" className="p-button-success" label={this.state.functionLabel} iconPos="right"
                            icon="pi pi-check" onClick={() => {
                                let selectedResourcesMap = this.state.selectedResourcesMap;
                                let selectedResources = [];
                                let keys = Object.keys(selectedResourcesMap);
                                for(let i=0; i<keys.length; i++){
                                    selectedResources.push(selectedResourcesMap[keys[i]]);
                                }
                                this.state.callbackFunction(selectedResources);
                            }} ></Button >
            );
        } else {
            return null;
        }
    }

    async handlePaginationChanged(event){
        await this.setState({page: event.page, offset: event.first, limit: event.rows});
        await this.loadResourcesFromServer();
    }

    render() {
        let dataTable = this.renderDataTable();

        let amountOfResources = "?";
        if(!!this.state.selectedResourcesMap){
            amountOfResources = Object.keys(this.state.selectedResourcesMap).length;
        }
	    let tableName = this.state.tableName || "";

        return (
            <div>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>Selected {tableName} ({amountOfResources})</h1>
                        <p></p>
                        <table style={{width: "100%"}}>
                            <tr>
                                <td align={"left"}>
                                    {this.renderSubmitButton()}
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
                    <Paginator first={this.state.offset} rows={this.state.limit} totalRecords={this.state.count} rowsPerPageOptions={[ResourceIndex.DEFAULT_ITEMS_PER_PAGE,25,50]} onPageChange={(e) => this.handlePaginationChanged(e)}></Paginator>
                </div>
            </div>
        );
    }
}
