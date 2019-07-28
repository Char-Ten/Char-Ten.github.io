import * as React from 'react';
import * as TReactDOM from 'react-dom';
import * as TReactDOMServer from 'react-dom/server/';
import App from 'src/apps/demo/main'
export default (function(){
	case$_IS_RUNTIME:{
        require("src/styles/reset.less")
		const ReactDOM:typeof TReactDOM=require('react-dom');
		ReactDOM.render(<App/>,document.getElementById("app"));
	}
	
	case$_IS_RENDER:{
		const ReactDOMServer:typeof TReactDOMServer=require('react-dom/server/');
		const str = ReactDOMServer.renderToString(<App/>);
		return str
	}
})();