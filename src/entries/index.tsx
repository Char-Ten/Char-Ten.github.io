import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from 'src/apps/index/main';
import 'src/styles/reset.less';

if(!module.IS_RENDER){
    ReactDOM.render(<App/>,document.getElementById("app"))
}