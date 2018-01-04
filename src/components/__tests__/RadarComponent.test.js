import React from 'react';
import {shallow} from 'enzyme';
import RadarComponent from '../RadarComponent.react';

describe('RadarComponent', () => {

    it('renders', () => {
        const component = shallow(<RadarComponent label="Test label"/>);
        expect(component).to.be.ok;
    });
});
