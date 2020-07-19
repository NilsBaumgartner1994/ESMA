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

export class Users extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: true,
            advanced: false,
        };
    }

    componentDidMount() {
        this.loadUsers();
    }

    async loadUsers() {
        const users = [];
        console.log("Users: "+users.length);

        this.setState({
            isLoading: false,
            users: users,
	    resources: users,
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

    renderDataTable(){
        let emptyMessage = "No records found";
        if (this.state.isLoading) {
            emptyMessage = <ProgressSpinner/>
        }


        const header = this.renderHeader();

        if(this.state.advanced){

        } {
            return (
                <DataTable ref={(el) => this.dt = el} responsive={true} value={this.state.users} paginator={true} rows={10}
                           header={header}
                           globalFilter={this.state.globalFilter} emptyMessage={emptyMessage}>
                    <Column field="id" header="ID" filter={true} sortable={true}/>
                    <Column field="pseudonym" header="Pseudonym" filter={true} sortable={true}/>
		            <Column field="avatar" header="Avatar" filter={true} sortable={true}/>
                    <Column field="online_time" header="Zuletzt online" filter={true} sortable={true}/>
                </DataTable>
            );
        }
    }

    render() {
        let dataTable = this.renderDataTable();

	let amountOfResources = "?";
	if(this.state.resources!==undefined){
	    amountOfResources = this.state.resources.length;
	}

        return (
            <div>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>Alle User ({amountOfResources})</h1>
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
