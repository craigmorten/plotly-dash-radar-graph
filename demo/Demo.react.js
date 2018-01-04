import React, {Component} from 'react';
import {RadarComponent} from '../src';

class Demo extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="container">
                <h1>Radar Graph Example</h1>

                <RadarComponent
                    id="radar-graph"
                />
            </div>
        );
    }
}

export default Demo;
