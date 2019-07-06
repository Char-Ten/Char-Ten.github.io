import * as React from "react";
import "./index.less";

class HomePageProj extends React.Component {
	render() {
		return (
			<div id="HomePageProj">
                <h2 className="c-part-title">应用</h2>
				<div>
					<ul>
						{new Array(9).fill(1).map((item, i) => {
							return (
								<li key={i} className="item">
									<div className="item-content">
										<h3>测试</h3>
										<p>测试文字</p>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		);
	}
}

export default HomePageProj;
