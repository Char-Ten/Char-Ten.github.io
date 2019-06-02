import * as React from "react";
import Header from './components/header';
import Author from './components/author';
import Proj from './components/proj';
import Articles from './components/articles'
import Collections from './components/collection';
export default function(): React.ReactElement{
	return (
		<div id="HomePage">
			<Header/>
			<Author />
			<Proj />
			<Articles />
            <Collections/>
			<div id="HomePageFriends" />
			<footer id="HomePageFooter" />
		</div>
	);
};
