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

export class ResourceIndex extends Component {

    constructor() {
        super();
        this.state = {
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
        let scheme = await RequestHelper.sendRequestNormal("GET","schemes/"+tableName);
        let resourcesAnswer = await RequestHelper.sendRequestNormal("GET","models/"+tableName);

        let resources = resourcesAnswer || [];

        this.setState({
            isLoading: false,
	        resources: resources,
            scheme: scheme,
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

    renderColumns(){
        let columns = [];

        let scheme = this.state.scheme;
        if(!!scheme){
            let attributeKeys = Object.keys(scheme);
            columns = attributeKeys.map(attributeKey => (
                <Column field={attributeKey} header={attributeKey} filter={true} sortable={true}/>
            ));
            return columns;
        } else {
            return (<div></div>);
        }
    }

    renderColumn(field,header){
        return (<Column field={field} header={header} filter={true} sortable={true}/>);
    }


    renderDataTable(){
        let emptyMessage = "No records found";
        if (this.state.isLoading) {
            emptyMessage = <ProgressSpinner/>
        }

        let columns = this.renderColumns();

        const header = this.renderHeader();

        if(this.state.advanced){

        } {
            return (
                <DataTable ref={(el) => this.dt = el} responsive={true} value={this.state.resources} paginator={true} rows={10}
                           header={header}
                           globalFilter={this.state.globalFilter} emptyMessage={emptyMessage}>
                    {columns}
                </DataTable>
            );
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
