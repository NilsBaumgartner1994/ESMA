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
import { OverlayPanel } from '../../components/overlaypanel/OverlayPanel';
import {AssociationIndexOverlay} from "./AssociationIndexOverlay";
import {Link} from "react-router-dom";

export class ResourceInstance extends Component {

    constructor(schemes,tableName) {
        super();
        this.state = {
            schemes: schemes,
            tableName: tableName,
            isLoading: true,
            isEdited: false,
            jsonEditorsVisible: {},
            jsonEditorsValues: {},
            dialogs: {},
            requestPending: false,
            visibleDialogDeleteResource: false,
        };
    }

    componentDidMount() {
		const { match: { params } } = this.props;
		console.log("Params");
		console.log(params);
        this.loadResources(params);
    }

    reloadPage(){
        window.location.reload();
    }

    async loadResources(params){
        let route = RouteHelper.getInstanceRouteForParams(this.state.schemes,this.state.tableName,params);
        let resource = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_GET,route);
        let scheme = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_GET,"schemes/"+this.state.tableName);
        let associations = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_GET,"schemes/"+this.state.tableName+"/associations");
        let associationResources = await this.loadAssociationResources(route,associations);
        let associationSchemes = await this.loadAssociationSchemes(associations);

        //console.log(resource);

        this.setState({
            isLoading: false,
            resource: resource,
            resourceCopy: JSON.parse(JSON.stringify(resource)),
            associations: associations,
            associationResources: associationResources,
            associationSchemes: associationSchemes,
            route: route,
            scheme: scheme,
            params: params,
        });
    }

    async loadAssociationSchemes(associations){
        let associationSchemes = {};

        let associationTableNames = Object.keys(associations);
        for(let i=0; i<associationTableNames.length; i++){
            let associationTableName = associationTableNames[i];
            let scheme = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_GET,"schemes/"+associationTableName);
            associationSchemes[associationTableName] = scheme;
        }
        return associationSchemes;
    }

    async loadAssociationResources(route,associations){
        let associationResources = {};

        let associationTableNames = Object.keys(associations);
        for(let i=0; i<associationTableNames.length; i++){
            let associationTableName = associationTableNames[i];
            let associationName = associations[associationTableName]["associationName"];
            let answer = await this.loadAssociation(route,associationName);
            if(!!answer && !answer.error){
                associationResources[associationName] = answer;
                console.log(associationResources[associationName]);
            } else {
                associationResources[associationName] = null;
            }
        }
        return associationResources;
    }

    async loadAssociation(route,associationName){
        route = route+"/associations/"+associationName;
        console.log("loadAssociation: "+route);
        let resource = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_GET,route);
        return resource;
    }

    async updateResource(){
        let resource = this.state.resource;
        let payloadJSON = resource;
        let answer = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_PUT,this.state.route,payloadJSON);
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
                resourceCopy: answer,
                isEdited: false,
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
            return(<Button style={{"margin-right":"1em"}} className="p-button-raised" label="Reset" icon="pi pi-undo" onClick={() => {this.resetResource()}} />);
        } else {
            return(<Button style={{"margin-right":"1em"}} className="p-button-raised" label="Reset" icon="pi pi-undo" disabled="disabled" />);
        }
    }

    renderUpdateButton(){
        if(this.state.isEdited && !this.state.requestPending){
            return(<Button style={{"margin-right":"1em"}} className="p-button-raised" label="Save" icon="pi pi-check" onClick={() => {this.updateResource()}} />);
        } else {
            return(<Button style={{"margin-right":"1em"}} className="p-button-raised" label="Save" icon="pi pi-check" disabled="disabled" />);
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

        let isAllowedNull = SchemeHelper.isAllowedNull(this.state.scheme, attributeKey);
        let starField = isAllowedNull ? "" : <i className="pi pi-star" style={{'fontSize': '0.7em',"margin-right":"0.5em", "vertical-align": "super","color":"red"}}></i>
        let attributeKeyRow = <th>{starField}{attributeKey}</th>

        return(
            <tr>
                <th>{attributeKeyRow}</th>
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


    renderAssociationCards(){
        let associationTableNames = Object.keys(this.state.associations);
        let output = [];
        for(let i=0; i<associationTableNames.length; i++){
            let associationTableName = associationTableNames[i];
            let associationName = this.state.associations[associationTableName]["associationName"];
            output.push(this.renderAssociationCard(associationTableName,associationName));
        }

        return output;
    }

    renderAssociationCard(associationTableName,associationName){
        let isPlural = associationTableName === associationName;
        return isPlural ? this.renderAssociationCardPlural(associationTableName,associationName) : this.renderAssociationCardSingle(associationTableName,associationName);
    }

    renderAssociationCardPlural(associationTableName,associationName){
        let resources = this.state.associationResources[associationName];
        let modelscheme = this.state.associationSchemes[associationTableName];
        let amountText = "";

        if(!!resources){
            let amount = resources.length;
            amountText = "("+amount+")";
        }

        let overlaypanelID = "overlayPanel-"+associationName;
        let overlaypanelIDAddNew = overlaypanelID+"AddNew";
        let overlaypanelIDRemove = overlaypanelID+"Remove";

        let addCallbackFunction = this.handleAddAssociationsMultiple.bind(this,overlaypanelIDAddNew,associationTableName,associationName);
        let removeCallbackFunction = this.handleRemoveAssociationsMultiple.bind(this,overlaypanelIDRemove,associationTableName,associationName);

        return(
            <div className="p-col">
                <Card title={associationName+" "+amountText} style={{width: '500px'}}>
                    <OverlayPanel ref={(el) => this[overlaypanelIDAddNew] = el}>
                        <AssociationIndexOverlay showOnlyAssociated={false} callbackFunction={addCallbackFunction} tableName={associationTableName} scheme={modelscheme} associatedResources={resources} functionLabel={"Add"}></AssociationIndexOverlay>
                    </OverlayPanel>
                    <OverlayPanel ref={(el) => this[overlaypanelIDRemove] = el}>
                        <AssociationIndexOverlay showOnlyAssociated={true} callbackFunction={removeCallbackFunction} tableName={associationTableName} scheme={modelscheme} associatedResources={resources} functionLabel={"Remove"}></AssociationIndexOverlay>
                    </OverlayPanel>

                    <Button style={{"margin-right":"1em"}} type="button" icon="pi pi-search" label="TODO: View" onClick={(e) => console.log("Implement me!")} />
                    <Button style={{"margin-right":"1em"}} type="button" icon="pi pi-plus" label="Add" onClick={(e) => this[overlaypanelIDAddNew].toggle(e)} />
                    <Button style={{"margin-right":"1em"}} type="button" icon="pi pi-minus" label="Remove" onClick={(e) => this[overlaypanelIDRemove].toggle(e)} />

                </Card>
            </div>
        )
    }

    async handleAddAssociationsMultiple(overlaypanelID,associationTableName,associationName,associationResources){
        this[overlaypanelID].hide();
        let amountSuccess = 0;
        for(let i=0; i<associationResources.length; i++){
            let associationResource = associationResources[i];
            let success = await this.handleRequestTypeOnMultipleAssociation(associationTableName,associationName,associationResource,RequestHelper.REQUEST_TYPE_POST);
            if(success){
                amountSuccess++;
            }
        }
        this.reloadPage(); //TODO remove reload page, instead reload partially. Problem if dependencies delete also, CASCADE ?
    }

    async handleRemoveAssociationsMultiple(overlaypanelID,associationTableName,associationName,associationResources){
        this[overlaypanelID].hide();
        let amountSuccess = 0;
        for(let i=0; i<associationResources.length; i++){
            let associationResource = associationResources[i];
            let success = await this.handleRequestTypeOnMultipleAssociation(associationTableName,associationName,associationResource,RequestHelper.REQUEST_TYPE_DELETE);
            if(success){
                amountSuccess++;
            }
        }
        this.reloadPage(); //TODO remove reload page, instead reload partially. Problem if dependencies delete also, CASCADE ?
    }

    async handleRequestTypeOnMultipleAssociation(associationTableName,associationName,associationResource,requestType){
        let associationModelscheme = this.state.associationSchemes[associationTableName];
        let route = RouteHelper.getInstanceRouteForAssociatedResource(this.state.schemes,this.state.scheme,this.state.tableName,this.state.resource,associationModelscheme,associationTableName,associationName,associationResource);
        let answer = await RequestHelper.sendRequestNormal(requestType,route);
        let success = !!answer && !answer.error;
        return success;
    }

    renderAssociationDisassociateMultiple(associationTableName,associationName,associationResource){
        let closeFunction = this.setDialogVisibility.bind(this,associationTableName,false);

        const footer = (
            <div>
                <Button label="Yes" icon="pi pi-check" className="p-button-danger p-button-raised" onClick={() => {this.handleDisassociateMultipleAssociation(associationTableName,associationName,associationResource,closeFunction) }} />
                <Button label="No" icon="pi pi-times" className="p-button-info p-button-raised" onClick={closeFunction} className="p-button-secondary" />
            </div>
        );

        let visible = this.state.dialogs[associationTableName];

        return (
            <div>
                <Button label="TODO: Disassociate" icon="pi pi-minus" className="p-button-danger p-button-raised" onClick={() => {this.setDialogVisibility(associationTableName,true)}} />
                <Dialog header={"Disassociate "+associationName} visible={visible} style={{width: '50vw'}} footer={footer} modal={true} onHide={closeFunction}>
                    <div>Are you sure you want to disassociate this {associationName} ? This cannot be undone.</div>
                </Dialog>
            </div>
        )
    }

    renderAssociationCardSingle(associationTableName,associationName){
        let resource = this.state.associationResources[associationName];
        let modelscheme = this.state.associationSchemes[associationTableName];
        let amountText = "";

        let isAssociated = !!resource;
        let associatedResources = [];
        if(isAssociated){
            associatedResources = [resource];
        }

        let overlaypanelID = "overlayPanel-"+associationName;
        let overlaypanelIDAddNew = overlaypanelID+"AddNew";

        let addCallbackFunction = this.handleSetAssociationsSingle.bind(this,overlaypanelIDAddNew,associationTableName,associationName);
        let removeCallbackFunction = this.handleRemoveAssociationsSingle.bind(this,associationTableName,associationName);

        return(
            <div className="p-col">
                <Card title={associationName} style={{width: '500px'}}>
                    <OverlayPanel ref={(el) => this[overlaypanelIDAddNew] = el}>
                        <AssociationIndexOverlay maxSelectedResources={1} maxAssociatedResources={0} showOnlyAssociated={false} callbackFunction={addCallbackFunction} tableName={associationTableName} scheme={modelscheme} associatedResources={associatedResources} functionLabel={"Add"}></AssociationIndexOverlay>
                    </OverlayPanel>

                    <Button style={{"margin-right":"1em"}} type="button" icon="pi pi-search" label="TODO: View" onClick={(e) => console.log("Implement me!")} />
                    <Button style={{"margin-right":"1em"}} disabled={isAssociated} type="button" icon="pi pi-plus" label="Set" onClick={(e) => this[overlaypanelIDAddNew].toggle(e)} />
                    <Button style={{"margin-right":"1em"}} disabled={!isAssociated} type="button" icon="pi pi-minus" label="Remove" onClick={(e) => removeCallbackFunction()} />

                </Card>
            </div>
        )
    }

    async handleSetAssociationsSingle(overlaypanelID,associationTableName,associationName,associationResources){
        let associationModelscheme = this.state.associationSchemes[associationTableName];
        if(!!associationResources && associationResources.length===1){
            let associationResource = associationResources[0];
            let route = RouteHelper.getInstanceRouteForAssociatedResource(this.state.schemes,this.state.scheme,this.state.tableName,this.state.resource,associationModelscheme,associationTableName,associationName,associationResource);
            console.log("handleSetAssociationsSingle");
            console.log(route);
            let answer = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_POST,route);
            let success = !!answer && !answer.error;
            if(success){
                //TODO Toast, success
                this.reloadPage(); //TODO remove reload page, instead reload partially. Problem if dependencies delete also, CASCADE ?
            }
        } else {

        }
    }

    async handleRemoveAssociationsSingle(associationTableName,associationName){
        let route = RouteHelper.getIndexRouteForAssociation(this.state.schemes,this.state.scheme,this.state.tableName,this.state.resource,associationName);
        console.log("handleRemoveAssociationsSingle");
        console.log(route);
        let answer = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_DELETE,route);
        let success = !!answer && !answer.error;
        if(success){
            //TODO Toast, success
            this.reloadPage(); //TODO remove reload page, instead reload partially. Problem if dependencies delete also, CASCADE ?
        }
    }


    setDialogVisibility(associationTableName,visible){
        let dialogs = this.state.dialogs;
        dialogs[associationTableName] = visible;
        this.setState({dialogs: dialogs});
    }

    openDialogDeleteResource(){
        this.setState({visibleDialogDeleteResource: true});
    }

    async deleteResource(){
        let route = this.state.route;
        let answer = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_DELETE,route);
        console.log(answer);
        if(answer!=false){
            this.props.history.push('/models/'+ this.state.tableName);
        }
    }

    renderDialogDeleteResource(){
        const footer = (
            <div>
                <Button label="Yes" icon="pi pi-check" className="p-button-danger p-button-raised" onClick={() => {this.setState({visibleDialogDeleteUser: false}); this.deleteResource(); }} />
                <Button label="No" icon="pi pi-times" className="p-button-info p-button-raised" onClick={() => {this.setState({visibleDialogDeleteUser: false}); }} className="p-button-secondary" />
            </div>
        );

        let tableNameSingle = this.state.tableName.slice(0,-1);

        return(
            <Dialog header={"Delete "+tableNameSingle} visible={this.state.visibleDialogDeleteResource} style={{width: '50vw'}} footer={footer} modal={true} onHide={() => this.setState({visibleDialogDeleteResource: false})}>
                <div>Are you sure you want to delete this {tableNameSingle} ? This cannot be undone.</div>
            </Dialog>
        );
    }

    renderDangerZone(){
        let tableNameSingle = this.state.tableName.slice(0,-1);

        return(
            <div className="p-col">
                <Card title={"Danger Zone"} style={{width: '500px'}}>
                    <Button label={"Delete "+tableNameSingle} icon="pi pi-times" className="p-button-danger p-button-raised" onClick={() => this.openDialogDeleteResource()} />
                </Card>
                {this.renderDialogDeleteResource()}
            </div>
        )
    }

    renderHeader(){
        let tableNameSingle = this.state.tableName.slice(0,-1);
        return(
            <div className="content-section introduction">
                <div className="feature-intro">
                    <h1>{tableNameSingle}</h1>
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
                        {this.renderAssociationCards()}
                        {this.renderDangerZone()}
                    </div>
                </div>
            </div>
        );
    }
}
