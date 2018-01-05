import React from 'react';
import {shallow} from 'enzyme';
import RadarComponent from '../RadarComponent.react';

describe('RadarComponent', () => {

    it('renders', () => {
        const component = shallow(<RadarComponent id="test-comp"/>);
        expect(component).to.be.ok;
    });
});
