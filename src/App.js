import React from "react";
import "antd/dist/antd.css";
import { Route } from "react-router-dom";
import AppNavigation from "./navigation/AppNavigation";

const App = () => <Route component={AppNavigation} />;

export default App;
