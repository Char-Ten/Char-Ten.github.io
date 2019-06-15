import * as React from "react";
import "./index.less"
class HomePageBanner extends React.Component {
	render() {
		return (
			<div id="HomePageBanner" className="c-flex-v">
				<div className="user">
					<img />
					<h1 className="name">挺问原</h1>
					<nav>
                        <a>微博</a>
                        <a>github</a>
                        <a>简书</a>
                        <a>掘金</a>
                    </nav>
				</div>
				<nav className="nav">
					<a className="c-state-atv">应用</a>
                    <a>文章</a>
                    <a>收藏</a>
                    <a>友链</a>
				</nav>
			</div>
		);
	}
}

export default HomePageBanner;
