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
import {InputTextarea} from '../../components/inputtextarea/InputTextarea';
import {Dialog} from '../../components/dialog/Dialog';
import {RouteHelper} from "../../helper/RouteHelper";
import {InputSwitch} from "../../components/inputswitch/InputSwitch";

export class ResourceCreate extends Component {

    constructor(schemes,tableName) {
        super();
        this.state = {
            schemes: schemes,
            tableName: tableName,
            isLoading: true,
            isEdited: false,
            jsonEditorsVisible: {},
            jsonEditorsValues: {},
            requestPending: false,
            visibleDialogDeleteResource: false,
        };
    }

    componentDidMount() {
        this.loadResources();
    }

    async loadResources(){
        let scheme = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_GET,"schemes/"+this.state.tableName);
        let route = RouteHelper.getIndexRouteForResource(this.state.schemes,this.state.tableName);

        this.setState({
            isLoading: false,
            resource: {},
            route: route,
            scheme: scheme,
        });
    }

    async updateResource(){
        let payloadJSON = this.state.resource;
        let answer = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_POST,this.state.route,payloadJSON);
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
            //TODO Go To Instance Side
            this.setState({
                resource: answer,
                requestPending: false,
            });
        }
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
                    {this.renderResetButton()}
                    {this.renderRequestPendingBar()}
                </Card>
            </div>
        )
    }

    resetResource(){
        this.setState({
            resource: JSON.parse(JSON.stringify(this.state.resourceCopy)),
            isEdited: false,
            jsonEditorsVisible: {},
            jsonEditorsValues: {},
        });
    }

    renderResetButton(){
        if(this.state.isEdited && !this.state.requestPending){
            return(<Button style={{"margin-right":"1em"}} className="p-button-raised" label="Reset" icon="pi pi-undo" iconPos="right" onClick={() => {this.resetResource()}} />);
        } else {
            return(<Button style={{"margin-right":"1em"}} className="p-button-raised" label="Reset" icon="pi pi-undo" iconPos="right" disabled="disabled" />);
        }
    }

    renderUpdateButton(){
        if(this.state.isEdited && !this.state.requestPending){
            return(<Button style={{"margin-right":"1em"}} className="p-button-raised" label="Save" icon="pi pi-check" iconPos="right" onClick={() => {this.updateResource()}} />);
        } else {
            return(<Button style={{"margin-right":"1em"}} className="p-button-raised" label="Save" icon="pi pi-check" iconPos="right" disabled="disabled" />);
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
            let isEditable = SchemeHelper.isEditable(this.state.scheme, attributeKey);
            if(isEditable){
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

        let isAllowedNull = SchemeHelper.isAllowedNull(this.state.scheme, attributeKey);
        let starField = isAllowedNull ? "" : <i className="pi pi-star" style={{'fontSize': '0.7em',"margin-right":"0.5em", "vertical-align": "super","color":"red"}}></i>
        let attributeKeyRow = <th>{starField}{attributeKey}</th>

        return(
            <tr>
                {attributeKeyRow}
                <td>{valueField}</td>
            </tr>
        )
    }

    renderEditableField(attributeKey){
        let attributeType = SchemeHelper.getType(this.state.scheme,attributeKey);
        switch(attributeType){
            case "STRING": return this.renderEditableTextField(attributeKey);
            case "INTEGER": return this.renderEditableIntegerField(attributeKey);
            case "DATE": return this.renderEditableDateField(attributeKey);
            case "JSON": return this.renderEditableJSONField(attributeKey);
        }

        return <div style={{"background-color": "green"}}>{this.state.resource[attributeKey]}</div>;
    }

    renderEditableTextField(attributeKey){
        let maxLength = SchemeHelper.getTypeStringMaxLength(this.state.scheme,attributeKey);
        let resourceValue = this.state.resource[attributeKey] || "";

        return(
            <div className="p-inputgroup">
                <InputText id="float-input" maxLength={maxLength} type="text" size="30" value={resourceValue} onChange={(e) => {this.state.resource[attributeKey] = e.target.value ;this.saveResourceChange()}} />
                <Button icon="pi pi-times" className="p-button-danger" onClick={() => {this.state.resource[attributeKey] = null; this.saveResourceChange()}} />
            </div>
        );
    }

    renderEditableIntegerField(attributeKey){
        let resourceValue = this.state.resource[attributeKey] || "";

        return(
            <div className="p-inputgroup">
                <InputText id="float-input" keyfilter={"int"} type="text" size="30" value={resourceValue} onChange={(e) => {this.state.resource[attributeKey] = e.target.value ;this.saveResourceChange()}} />
                <Button icon="pi pi-times" className="p-button-danger" onClick={() => {this.state.resource[attributeKey] = null; this.saveResourceChange()}} />
            </div>
        );
    }

    renderEditableJSONField(attributeKey){
        let rawValue = this.state.resource[attributeKey];
        let resourceValue = JSON.stringify(this.state.resource[attributeKey]);
        if(!this.state.jsonEditorsValues[attributeKey]){
            this.state.jsonEditorsValues[attributeKey] = resourceValue;
        }

        const onAbort = (e) => {
            let editorState = this.state.jsonEditorsVisible;
            editorState[attributeKey] = false;
            let editorValues = this.state.jsonEditorsValues;
            editorValues[attributeKey] = resourceValue;
            this.setState({
                jsonEditorsVisible: editorState,
                jsonEditorsValues: editorValues
            });
        };

        const onShow = (e) => {
            let editorState = this.state.jsonEditorsVisible;
            editorState[attributeKey] = true;
            this.setState({
                jsonEditorsVisible: editorState
            });
        };

        const onValidate = (e) => {
            try{

                console.log("onValidate");
                console.log("this.state.jsonEditorsValues[attributeKey]:");
                console.log(this.state.jsonEditorsValues[attributeKey]);
                let json = JSON.parse(this.state.jsonEditorsValues[attributeKey]);
                let resource = this.state.resource;
                resource[attributeKey] = json;

                let editorValues = this.state.jsonEditorsValues;
                editorValues[attributeKey] = JSON.stringify(json);

                let editorState = this.state.jsonEditorsVisible;
                editorState[attributeKey] = false;

                this.setState({
                    resource: resource,
                    jsonEditorsVisible: editorState,
                    jsonEditorsValues: editorValues
                });
            } catch(err){
                console.log("JSON Validation Error");
                console.log(err);
            }
        }

        let isValid = true;
        try{
            JSON.parse(this.state.jsonEditorsValues[attributeKey]);
        } catch(err){
            isValid = false;
        }

        let finishButton = <Button label="Finish" icon="pi pi-check" onClick={onValidate} />
        if(!isValid){
            finishButton = <Button label="Invalid JSON" className="p-button-danger" />;
        }

        const footer = (
            <div>
                {finishButton}
                <Button label="Abort" icon="pi pi-times" className="p-button-danger" onClick={onAbort} />
            </div>
        );

        return(
            <div>
            <div className="p-inputgroup">
                <InputTextarea id="float-input" autoResize={true} rows={5} cols={29} onClick={onShow} value={resourceValue} />
                <Button icon="pi pi-times" className="p-button-danger" onClick={() => {this.state.resource[attributeKey] = null; this.saveResourceChange()}} />
            </div>
                <Dialog header={"JSON Editor: "+attributeKey} footer={footer} visible={this.state.jsonEditorsVisible[attributeKey]} modal={true} onHide={onAbort}>
                    <InputTextarea id="float-input" autoResize={true} rows={20} cols={80} value={this.state.jsonEditorsValues[attributeKey]} onChange={(e) => {this.state.jsonEditorsValues[attributeKey] = e.target.value ;this.saveResourceChange()}}/>
                </Dialog>
            </div>
        );
    }

    renderEditableDateField(attributeKey){
        let resourceValue = this.state.resource[attributeKey];
        let value = !!resourceValue ? new Date(resourceValue) : null;

        return(
            <div className="p-inputgroup">
                <Calendar value={value} showTime={true} showSeconds={true} monthNavigator={true} touchUI={true} yearNavigator={true} yearRange="1990:2030" showButtonBar={true} onChange={(e) => {this.state.resource[attributeKey] = e.target.value ;this.saveResourceChange()}} />
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

    renderHeader(){
        return(
            <div className="content-section introduction">
                <div className="feature-intro">
                    <h1>{this.state.tableName}</h1>
                    <p>Creation</p>
                    <table style={{width: "100%"}}>
                        <tr>
                            <td align="right">
                                <p>Advanced: </p>
                                <InputSwitch checked={this.state.advanced} onChange={(e) => this.setState({advanced: e.value})} />
                            </td>
                        </tr>
                    </table>
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
                    </div>
                </div>
            </div>
        );
    }
}
