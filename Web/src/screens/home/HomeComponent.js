import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export class HomeComponent extends Component {

    render() {
        return (
            <div className="home">
                <div className="introduction">
                    <h1>Die App für Mensa und mehr !</h1>
                    <h2>SWOSY</h2>
                </div>
                <div className="features">
                    <h3>Warum SWOSY?</h3>
                    <p className="features-tagline">Glückwunsch! <span role="img" aria-label="celebrate">🎉</span> Die
                        Suche nach dem perfekten Tool ist vorüber.</p>

                    <p className="features-description">SWOSY ist eine Kollektion reichhaltigter Komonenten (MobileApp,
                        BackendServer, FrontendServer, AlexaApp, ...).</p>
                </div>
            </div>
        );
    }
}
