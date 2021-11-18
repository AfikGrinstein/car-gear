import React from 'react';
import {render} from 'react-dom';
import {act} from "react-dom/test-utils";
import Gear from './Gear.jsx';

let container = null;
it('Render with initial state', () => {
    act(() => {
        render(<Gear/>, container)
    })
});
