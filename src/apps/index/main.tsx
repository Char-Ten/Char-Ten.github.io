import * as React from "react";
import Header from './components/header';
import Author from './components/author';
import Proj from './components/proj';
import Articles from './components/articles'
export default function(): React.ReactElement{
	return (
		<div id="HomePage">
			<Header/>
			<Author />
			<Proj />
			<Articles />
			<div id="HomePageFriends" />
			<footer id="HomePageFooter" />
		</div>
	);
};
