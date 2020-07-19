import React, {Component} from 'react';
import {InputText} from '../../components/inputtext/InputText';
import queryString from 'query-string';
import Timeline from 'react-time-line';
import {ProgressSpinner} from '../../components/progressspinner/ProgressSpinner';
import {UserService} from '../../module/UserService';
import {Card} from '../../components/card/Card';
import {Link} from 'react-router-dom';
import {Calendar} from '../../components/calendar/Calendar';
import {Dialog} from '../../components/dialog/Dialog';
import {Growl} from '../../components/growl/Growl';
import {ProgressBar} from '../../components/progressbar/ProgressBar';

import {Button} from '../../components/button/Button';

export class User extends Component {

    constructor() {
        super();
        this.state = {
            user: {},
            device: {},
            streamViewData: null,
            isLoading: true,
            visibleDialogDeleteUser: false,
            changeMade: false,
            requestPending: false,
        };
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        const user_id = values.user_id;
        this.setState({
            user_id: user_id,
        });
        this.loadUserInformations(user_id);
    }

    async loadUserInformations(user_id) {
        const user = {};
        this.setState({
            isLoading: false,
            user: user,
        });
    }

    render() {
        if(this.state.isLoading){
            return(
                <div><ProgressSpinner/></div>
            );
        }

        let user = this.state.user;
        let informationTitle = "Title";

        return (
            <div>
                {this.renderDialogDeleteUser()}
                <Growl ref={(el) => this.growl = el} />

                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>User - {informationTitle}</h1>
                        <p>Hier werden alle Informationen des Users angezeigt</p>
                    </div>
                </div>

                <div className="content-section implementation">

                    <div className="p-grid">
                        <div className="p-col">
                            <Card title={informationTitle} style={{width: '500px'}}>

                                <table style={{border:0}}>
                                    <tbody>
                                    <tr>
                                        <th>User ID</th>
                                        <td>{user.id}</td>
                                    </tr>
                                    <tr>
                                        <th>Created At</th>
                                        <td>{user.createdAt}</td>
                                    </tr>
                                    <tr>
                                        <th>Updated At</th>
                                        <td>{user.updatedAt}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <br></br>
                                {this.renderUpdateButton()}
                                {this.renderRequestPendingBar()}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
