import * as React from "react";
import "./index.less";

class HomePageProj extends React.Component {
	render() {
		return (
			<div id="HomePageProj">
				<div className="c-center">
					<ul>
						{new Array(9).fill(1).map((item, i) => {
							return (
								<li key={i}>
									<div>
										<h2>测试</h2>
										<p />
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
