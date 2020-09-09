import React, {Component} from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';
import {RequestHelper} from "./module/RequestHelper";

export class AppMenu extends Component {

    constructor() {
        super();
        this.state = {activeMenu: -1, loading: true};
        this.loadInformations();
    }

    toggleMenu(val) {
        let active = this.state.activeMenu === val;

        this.setState({activeMenu: active ? -1 : val});
    }

    async loadInformations(){
        let schemes = await RequestHelper.sendRequestNormal(RequestHelper.REQUEST_TYPE_GET,"schemes");
        let tableNames = Object.keys(schemes);
        this.setState({
            tableNames: tableNames,
            loading: false,
        })
    }

    renderSchemes(){
        let tableNames = this.state.tableNames || [];

        const LinkList = ({ tableNames }) => (
                <div>
                    {tableNames.map(tableName => (
                            <Link to={'/models/'+tableName}>&#9679; {tableName}</Link>
                    ))}
                </div>
        );

        return <LinkList tableNames={tableNames} />;
    }

    render() {
        return (
            <div className="layout-menu">

                <button id="data_menutitle" onClick={() => this.toggleMenu(0)}
                        className={classNames({'active-menuitem': this.state.activeMenu === 0})}>
                    <img alt="data" className="layout-menu-icon-inactive"
                         src="/showcase/resources/images/mono/data.svg"/>
                    <img alt="data" className="layout-menu-icon-active"
                         src="/showcase/resources/images/mono/data-active.svg"/>
                    <span>Tabellen</span>
                </button>
                <CSSTransition classNames="layout-submenu" timeout={{enter: 400, exit: 400}}
                               in={this.state.activeMenu === 0}>
                    <div className="layout-submenu">
                        {this.renderSchemes()}
                    </div>
                </CSSTransition>

                <button id="data_menutitle" onClick={() => this.toggleMenu(1)}
                        className={classNames({'active-menuitem': this.state.activeMenu === 1})}>
                    <img alt="data" className="layout-menu-icon-inactive"
                         src="/showcase/resources/images/mono/charts.svg"/>
                    <img alt="data" className="layout-menu-icon-active"
                         src="/showcase/resources/images/mono/charts-active.svg"/>
                    <span>Statistiken</span>
                </button>
                <CSSTransition classNames="layout-submenu" timeout={{enter: 400, exit: 400}}
                               in={this.state.activeMenu === 1}>
                    <div className="layout-submenu">
                        <div>

                        </div>
                    </div>
                </CSSTransition>

                <button id="data_menutitle" onClick={() => this.toggleMenu(3)}
                        className={classNames({'active-menuitem': this.state.activeMenu === 3})}>
                    <img alt="data" className="layout-menu-icon-inactive"
                         src="/showcase/resources/images/mono/file.svg"/>
                    <img alt="data" className="layout-menu-icon-active"
                         src="/showcase/resources/images/mono/file-active.svg"/>
                    <span>Backups</span>
                </button>
                <CSSTransition classNames="layout-submenu" timeout={{enter: 400, exit: 400}}
                               in={this.state.activeMenu === 3}>
                    <div className="layout-submenu">
                        <div>
                            <Link to="/functions/backups">&#9679; Database Backups</Link>
                        </div>
                    </div>
                </CSSTransition>


                <button id="data_menutitle" onClick={() => this.toggleMenu(4)}
                        className={classNames({'active-menuitem': this.state.activeMenu === 4})}>
                    <img alt="data" className="layout-menu-icon-inactive"
                         src="/showcase/resources/images/mono/data.svg"/>
                    <img alt="data" className="layout-menu-icon-active"
                         src="/howcase/resources/images/mono/data-active.svg"/>
                    <span>Server Information</span>
                </button>
                <CSSTransition classNames="layout-submenu" timeout={{enter: 400, exit: 400}}
                               in={this.state.activeMenu === 4}>
                    <div className="layout-submenu">
                        <div>
                            <Link to="/systeminformationview">&#9679; Overview</Link>
                        </div>
                    </div>
                </CSSTransition>
            </div>
        );
    }
}
