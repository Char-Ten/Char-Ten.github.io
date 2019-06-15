import * as React from "react";
import CScrollView from 'src/components/ScrollView'
import Banner from "./components/banner";
import Proj from "./components/proj";
import Articles from "./components/articles";
import "./styles/main.less";
export default function(): React.ReactElement {
	return (
		<div id="HomePage">
			<Banner />

			<CScrollView id="HomePageContent">
				<Proj />
                <Articles/>
				<div id="HomePageFriends" />
				<footer id="HomePageFooter" />
			</CScrollView>
		</div>
	);
}
