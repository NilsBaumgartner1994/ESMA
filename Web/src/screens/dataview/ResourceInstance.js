import React, {Component} from 'react';
import queryString from 'query-string';
import {ProgressSpinner} from '../../components/progressspinner/ProgressSpinner';
import {Card} from '../../components/card/Card';
import {Growl} from '../../components/growl/Growl';
import {ProgressBar} from '../../components/progressbar/ProgressBar';
import {RequestHelper} from "../../module/RequestHelper";
import {SchemeHelper} from "../../helper/SchemeHelper";
import {Button} from '../../components/button/Button';
import {Calendar} from '../../components/calendar/Calendar';
import {InputText} from '../../components/inputtext/InputText';

export class ResourceInstance extends Component {

    constructor(schemes,tableName) {
        super();
        this.state = {
            schemes: schemes,
            tableName: tableName,
            isLoading: true,
            isEdited: false,
            requestPending: false
        };
    }

    componentDidMount() {
		const { match: { params } } = this.props;
		console.log(params);
        this.loadResources(params);
    }

    async loadResources(params){
        let route = this.getInstanceRouteForResource(params);
        let resource = await RequestHelper.sendRequestNormal("GET",route);
        let scheme = await RequestHelper.sendRequestNormal("GET","schemes/"+this.state.tableName);

        console.log(resource);

        this.setState({
            isLoading: false,
            resource: resource,
            route: route,
            scheme: scheme,
            params: params,
        });
    }

    async updateResource(){
        let resource = this.state.resource;
        let payloadJSON = resource;
        let answer = await RequestHelper.sendRequestNormal("POST",this.state.route,payloadJSON);
        if(answer === undefined) {
            this.setState({
                requestPending: false,
            });
            this.growl.show({severity: 'error', summary: 'Error', detail: 'Unkown error!'});
        } else if(answer.error !== undefined){
            this.setState({
                requestPending: false,
            });
            this.growl.show({severity: 'error', summary: 'Error', detail: answer.error});
        } else {
            this.growl.show({severity: 'success', summary: 'Success', detail: 'Changes saved'});
            this.setState({
                resource: answer,
                isEdited: false,
                requestPending: false,
            });
        }
    }

    getInstanceRouteForResource(params){
        let getRoute = this.state.schemes[this.state.tableName]["GET"];
        getRoute = getRoute.replace("/api/","");
        let paramKeys = Object.keys(params);
        for(let i=0;i<paramKeys.length; i++){
            let paramKey = paramKeys[i];
            getRoute = getRoute.replace(":"+paramKey,params[paramKey]);
        }
        return getRoute;
    }

    renderDataCard(){
        return(
            <div className="p-col">
                <Card title={"Data"} style={{width: '500px'}}>
                    <div>{}</div>
                    <table style={{border:0}}>
                        <tbody>
                        {this.renderDataFields()}
                        </tbody>
                    </table>
                    <br></br>
                    {this.renderUpdateButton()}
                    {this.renderRequestPendingBar()}
                </Card>
            </div>
        )
    }

    renderUpdateButton(){
        if(this.state.isEdited && !this.state.requestPending){
            return(<Button className="p-button-raised" label="Save" icon="pi pi-check" iconPos="right" onClick={() => {this.updateResource()}} />);
        } else {
            return(<Button className="p-button-raised" label="Save" icon="pi pi-check" iconPos="right" disabled="disabled" />);
        }
    }

    renderRequestPendingBar(){
        if(this.state.requestPending){
            return(<ProgressBar mode="indeterminate" style={{height: '6px'}}></ProgressBar>);
        }
        return (null);
    }

    renderDataFields(){
        let output = [];
        let attributeKeys = SchemeHelper.getAttributeKeys(this.state.scheme);
        for(let i=0; i<attributeKeys.length; i++){
            let attributeKey = attributeKeys[i];
            if(!SchemeHelper.isReferenceField(this.state.scheme, attributeKey)){
                let isEditable = SchemeHelper.isEditable(this.state.scheme, attributeKey);
                output.push(this.renderDataField(attributeKey,isEditable));
            }
        }
        return output;
    }

    renderDataField(attributeKey,isEditable){
        let valueField = this.state.resource[attributeKey];
        if(isEditable){
            valueField = this.renderEditableField(attributeKey);
        }

        return(
            <tr>
                <th>{attributeKey}</th>
                <td>{valueField}</td>
            </tr>
        )
    }

    renderEditableField(attributeKey){
        let attributeType = SchemeHelper.getType(this.state.scheme,attributeKey);
        switch(attributeType){
            case "STRING": return this.renderEditableTextField(attributeKey);
            case "DATE": return this.renderEditableDateField(attributeKey);
        }

        return <div style={{"background-color": "green"}}>{this.state.resource[attributeKey]}</div>;
    }

    renderEditableTextField(attributeKey){
        let maxLength = SchemeHelper.getTypeStringMaxLength(this.state.scheme,attributeKey);

        return(
            <div className="p-inputgroup">
                <InputText id="float-input" type="text" size="30" value={this.state.resource[attributeKey] || ""} onChange={(e) => {this.state.resource[attributeKey] = e.target.value ;this.saveResourceChange()}} />
                <Button icon="pi pi-times" className="p-button-danger" onClick={() => {this.state.resource[attributeKey] = null; this.saveResourceChange()}} />
            </div>
        );
    }

    renderEditableDateField(attributeKey){
        let resourceValue = this.state.resource[attributeKey];
        let value = !!resourceValue ? new Date(resourceValue) : null;

        return(
            <div className="p-inputgroup">
                <Calendar size="30" value={value} showTime={true} showSeconds={true} monthNavigator={true} touchUI={true} yearNavigator={true} yearRange="1990:2030" showButtonBar={true} onChange={(e) => {this.state.resource[attributeKey] = e.target.value ;this.saveResourceChange()}} />
                <Button icon="pi pi-times" className="p-button-danger" onClick={() => {this.state.resource[attributeKey] = null; this.saveResourceChange()}} />
            </div>
        );
    }

    saveResourceChange(){
        this.setState({
            resource: this.state.resource,
            isEdited: true
        });
    }


    renderAssociationCard(){
        return <div></div>;
    }

    renderHeader(){
        return(
            <div className="content-section introduction">
                <div className="feature-intro">
                    <h1>{this.state.tableName}</h1>
                    <p>All informations</p>
                </div>
            </div>
        )
    }

    render() {
        if(this.state.isLoading){
            return(
                <div><ProgressSpinner/></div>
            );
        }

        return (
            <div>
                <Growl ref={(el) => this.growl = el} />

                {this.renderHeader()}

                <div className="content-section implementation">

                    <div className="p-grid">
                        {this.renderDataCard()}
                        {this.renderAssociationCard()}
                    </div>
                </div>
            </div>
        );
    }
}
