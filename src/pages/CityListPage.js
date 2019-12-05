import React, { useEffect, useReducer } from "react";
import { Table } from "antd";
import "antd/dist/antd.css";
import { lambda } from "../config/aws";
import { Link } from "react-router-dom";
import { getCities } from "../config/functionNames";

const columns = [
	{
		title: "City",
		dataIndex: "sort_key",
		render: text => <Link to={`/CityDetails/${text}`}>{text}</Link>,
	},
	{
		title: "Cost",
		dataIndex: "average_price",
	},
	{
		title: "Best Time",
		dataIndex: "best_time",
	},
	{
		title: "Average age of tourists",
		dataIndex: "average_age",
	},
];

const initialState = {
	cities: [],
	loading: true,
	error: null,
};

const reducer = (state, action) => {
	switch (action.type) {
		case "FETCH_CITIES":
			return { ...state, loading: true, error: null };
		case "FETCH_CITIES_SUCCESS":
			return {
				...state,
				loading: false,
				cities: action.cities,
				error: null,
			};
		case "FETCH_CITIES_ERROR":
			return { ...state, loading: false, error: action.error };
		default:
			throw new Error("Unexpected action");
	}
};

const CityListPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const invokeParams = {
			FunctionName: getCities,
		};
		lambda.invoke(invokeParams, (err, res) => {
			if (err) {
				dispatch({ type: "FETCH_CITIES_ERROR", error: err });
			}
			if (res) {
				dispatch({
					type: "FETCH_CITIES_SUCCESS",
					cities: JSON.parse(res.Payload).data,
				});
			}
		});
	}, []);

	return <Table dataSource={state.cities} columns={columns} rowKey={row => row.sort_key} />;
};

export default CityListPage;
