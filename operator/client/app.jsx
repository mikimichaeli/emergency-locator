import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Layout from './components/layout';

// remove tap delay, essential for MaterialUI to work properly
// injectTapEventPlugin();

ReactDom.render((<Layout />), document.getElementById('app'));
