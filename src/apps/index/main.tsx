import * as React from "react";
import Banner from "./components/banner";
import Proj from "./components/proj"
import "./styles/main.less";
export default function(): React.ReactElement {
	return (
		<div id="HomePage">
			<Banner />

            <div id="HomePageContent">
            <Proj/>
                <div id="HomePageFriends" />
                <footer id="HomePageFooter" />
            </div>
			
		</div>
	);
}
