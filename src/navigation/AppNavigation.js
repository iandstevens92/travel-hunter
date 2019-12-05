import React from "react";
import { Switch, Route } from "react-router-dom";
import Routes from "./Routes";
import NoMatchPage from "../pages/NoMatchPage";

const AppNavigation = () => (
	<Switch>
		{Routes.map((route, i) => (
			<Route key={i} {...route} />
		))}
		<Route component={NoMatchPage} />
	</Switch>
);

export default AppNavigation;
