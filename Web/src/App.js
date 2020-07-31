import React, {Component} from 'react';
import {Route, Link, Switch} from 'react-router-dom';
import {withRouter} from 'react-router';
import {AppMenu} from './AppMenu';
import classNames from 'classnames';
import 'babel-polyfill';
import './resources/style/primereact.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './sass/App.scss';
import config from './config';


import {HomeComponent} from './screens/home/HomeComponent';
import {ResourceIndex} from "./screens/dataview/ResourceIndex";
import {ResourceInstance} from "./screens/dataview/ResourceInstance";
import {SystemInformationView} from "./screens/systemInformation/SystemInformationView";
import {RequestHelper} from "./module/RequestHelper";

export class App extends Component {

    constructor() {
        super();
        this.state = {
            mobileMenuActive: false,
            themeMenuActive: false,
            themeMenuVisited: false
        };

        this.theme = 'luna-amber';
        this.changeTheme = this.changeTheme.bind(this);
        this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
        this.onMenuButtonKeyDown = this.onMenuButtonKeyDown.bind(this);
        this.onSidebarClick = this.onSidebarClick.bind(this);
        this.onThemesLinkClick = this.onThemesLinkClick.bind(this);
        this.onThemesLinkKeyDown = this.onThemesLinkKeyDown.bind(this);
        this.onThemeChangerKeyDown = this.onThemeChangerKeyDown.bind(this);
        this.onThemesMenuRouteChange = this.onThemesMenuRouteChange.bind(this);

        this.loadInformations();
    }

    async loadInformations(){
        let schemes = await RequestHelper.sendRequestNormal("GET","schemes");
        let tableNames = Object.keys(schemes);
        this.setState({
            tableNames: tableNames,
            schemes: schemes,
            loading: false,
        })
    }

    renderRoutes(){
        console.log("renderRoutes")
        if(!!this.state.schemes && !!this.state.tableNames){
            let divRoutes = this.state.tableNames.map(tableName => {
                let getRoute = this.state.schemes[tableName]["GET"];
                getRoute = getRoute.replace("/api","");
                console.log("getRoute: "+getRoute);
                return (<Route exact path={getRoute} component={withRouter(ResourceInstance.bind(this,this.state.schemes,tableName))} test={"Hallo"}/>)
            });

            console.log(divRoutes)
            return divRoutes;
        } else {
            return (<div></div>)
        }
    }

    changeTheme(event, theme, dark) {
        let themeElement = document.getElementById('theme-link');
        themeElement.setAttribute('href', themeElement.getAttribute('href').replace(this.theme, theme));
        this.theme = theme;

        if (dark) {
            if (!this.darkDemoStyle) {
                this.darkDemoStyle = document.createElement('style');
                this.darkDemoStyle.type = 'text/css';
                this.darkDemoStyle.innerHTML = '.implementation { background-color: #3f3f3f !important; color: #dedede !important} .implementation > h3, .implementation > h4{ color: #dedede !important}';
                document.body.appendChild(this.darkDemoStyle);
            }
        } else if (this.darkDemoStyle) {
            document.body.removeChild(this.darkDemoStyle);
            this.darkDemoStyle = null;
        }

        this.setState({
            themeMenuActive: false
        });
        this.unbindThemesMenuDocumentClickListener();
        event.preventDefault();
    }

    toggleMenu() {
        this.setState({
            mobileMenuActive: !this.state.mobileMenuActive
        }, () => {
            if (this.state.mobileMenuActive)
                this.bindMenuDocumentClickListener();
            else
                this.unbindMenuDocumentClickListener();
        });
    }

    onMenuButtonClick() {
        this.toggleMenu();
    }

    onMenuButtonKeyDown(event) {
        if (event.key === 'Enter') {
            this.toggleMenu();
        }
    }

    onSidebarClick(event) {
        if (event.target.nodeName === 'A') {
            this.setState({mobileMenuActive: false});
        }
    }

    onThemesLinkClick() {
        this.setState({
            themeMenuActive: !this.state.themeMenuActive,
            themeMenuVisited: true
        }, () => {
            if (this.state.themeMenuActive)
                this.bindThemesMenuDocumentClickListener();
            else
                this.unbindThemesMenuDocumentClickListener();
        });
    }

    onThemesLinkKeyDown(event) {
        if (event.key === 'Enter') {
            this.onThemesLinkClick();
        }
    }

    onThemeChangerKeyDown(event) {
        if (event.key === 'Enter') {
            event.target.click();
        }
    }

    onThemesMenuRouteChange() {
        this.setState({themeMenuActive: false}, () => {
            this.unbindThemesMenuDocumentClickListener();
        });
    }

    bindMenuDocumentClickListener() {
        if (!this.menuDocumentClickListener) {
            this.menuDocumentClickListener = (event) => {
                if (!this.isMenuButtonClicked(event) && !this.sidebar.contains(event.target)) {
                    this.setState({mobileMenuActive: false});
                    this.unbindMenuDocumentClickListener();
                }
            };

            document.addEventListener('click', this.menuDocumentClickListener);
        }
    }

    unbindMenuDocumentClickListener() {
        if (this.menuDocumentClickListener) {
            document.removeEventListener('click', this.menuDocumentClickListener);
            this.menuDocumentClickListener = null;
        }
    }

    isMenuButtonClicked(event) {
        return event.target === this.menuButton || this.menuButton.contains(event.target);
    }

    bindThemesMenuDocumentClickListener() {
        if (!this.themesMenuDocumentClickListener) {
            this.themesMenuDocumentClickListener = (event) => {
                if (this.themeMenu && event.target !== this.themeMenuLink && !this.themeMenu.contains(event.target)) {
                    this.setState({themeMenuActive: null});
                    this.unbindThemesMenuDocumentClickListener();
                }
            };

            document.addEventListener('click', this.themesMenuDocumentClickListener);
        }
    }

    unbindThemesMenuDocumentClickListener() {
        if (this.themesMenuDocumentClickListener) {
            document.removeEventListener('click', this.themesMenuDocumentClickListener);
            this.themesMenuDocumentClickListener = null;
        }
    }

    componentWillUnmount() {
        this.unbindThemesMenuDocumentClickListener();
        this.unbindMenuDocumentClickListener();
    }

    render() {
        return (
            <div className="layout-wrapper">
                <div className="layout-topbar">
                    <span ref={el => this.menuButton = el} className="menu-button" tabIndex="0"
                          onClick={this.onMenuButtonClick} onKeyDown={this.onMenuButtonKeyDown}>
                        <i className="pi pi-bars"/>
                    </span>
                    <Link to="/" className="logo">
                        <img alt="data" src="showcase/resources/images/esmaLogo.svg" style={{width: "auto" ,height: 55}}/>
                    </Link>

                    <ul className="topbar-menu p-unselectable-text">
                        <li>
                            <Link to="/support">SUPPORT</Link>
                        </li>
                    </ul>
                </div>

                <div id="layout-sidebar" ref={el => this.sidebar = el}
                     className={classNames({'active': this.state.mobileMenuActive})} onClick={this.onSidebarClick}>
                    <AppMenu/>
                </div>

                <div className={classNames({'layout-mask': this.state.mobileMenuActive})}/>

                <div id="layout-content">
                    <Switch>
                        <Route exact path="/" component={HomeComponent}/>
                        <Route exact path={"/models/:tableName"} component={withRouter(ResourceIndex)}/>
                        {this.renderRoutes()}
                    </Switch>
                    <div className="content-section layout-footer clearfix">
                        <span>{config.title} {config.version}</span>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
