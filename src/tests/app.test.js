// import React from 'react';
import App from "../app/layout/App";
import '@testing-library/jest-dom/extend-expect'
//
// import Enzyme, { shallow, render, mount } from 'enzyme';
//
// import Adapter from 'enzyme-adapter-react-16';
 import { BrowserRouter } from 'react-router-dom';
 import {Provider} from "react-redux";
// import ReduxToastr from 'react-redux-toastr';
// import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
//
import ScrollToTop from '../app/common/util/ScrollToTop';
import {configureStore} from "../app/store/configureStore";
// Enzyme.configure({ adapter: new Adapter() })
//
// // incorrect function assignment in the onClick method
// // will still pass the tests.
// const store = configureStore();
// test('the increment method increments count', () => {
//     const wrapper = mount(   <Provider store={store}>
//         <BrowserRouter>
//             <ScrollToTop>
//                 <ReduxToastr
//                     position='bottom-right'
//                     transitionIn='fadeIn'
//                     transitionOut='fadeOut'
//                 />
//                 <App />
//             </ScrollToTop>
//         </BrowserRouter>
//     </Provider>);
// })

import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom';
import ReduxToastr from "react-redux-toastr";
import React from "react";
test('uses jest-dom', () => {
    document.body.innerHTML = `
    <span data-testid="not-empty"><span data-testid="empty"></span></span>
    <div data-testid="visible">Visible Example</div>
  `

    expect(screen.getByText('Visible Example')).toBeVisible()
})



test('full app rendering/navigating', async () => {
      const store = configureStore();
        const appContainer = <Provider store={store}>
        <BrowserRouter>
            <ScrollToTop>
                <ReduxToastr
                    position='bottom-right'
                    transitionIn='fadeIn'
                    transitionOut='fadeOut'
                />
                <App />
            </ScrollToTop>
        </BrowserRouter>
    </Provider>
    // normally I'd use a data-testid, but just wanted to show this is also possible
    expect(appContainer.innerHTML).toMatch('EasyPlan')
})
