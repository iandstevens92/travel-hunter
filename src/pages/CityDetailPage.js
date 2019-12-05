import React, { useEffect, useReducer } from "react";
import { lambda } from "../config/aws";
import { Table, Button, Input } from "antd";
import { getCityComments, putDownVote, putUpVote, postComment } from "../config/functionNames";

const initialState = {
	cityDescription: "",
	comments: [],
	loading: true,
	error: null,
};

const reducer = (state, action) => {
	switch (action.type) {
		case "COMMENTS_LOADING":
			return { ...state, loading: true, error: null };
		case "FETCH_INIT_COMMENTS_SUCCESS":
			return {
				...state,
				loading: false,
				cityDescription: action.cityDescription,
				comments: action.comments,
				error: null,
			};
		case "COMMENTS_SUCCESS":
			return {
				...state,
				loading: false,
				comments: action.comments,
				error: null,
			};
		case "COMMENTS_VOTE_SUCCESS":
			return {
				...state,
				loading: false,
				comments: action.comments,
				error: null,
			};
		case "COMMENTS_ERROR":
			return { ...state, loading: false, error: action.error };
		default:
			throw new Error("Unexpected action");
	}
};

const CityDetailPage = props => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const columns = [
		{
			title: "Comment",
			dataIndex: "text_information",
		},
		{
			title: "Total votes",
			dataIndex: "score",
		},
		{
			title: "Up vote",
			dataIndex: "sort_key",
			key: "up_vote",
			render: commentID => <Button onClick={() => vote(commentID, putUpVote)}>Up vote</Button>,
		},
		{
			title: "Down vote",
			dataIndex: "sort_key",
			key: "down_vote",
			render: commentID => <Button onClick={() => vote(commentID, putDownVote)}>Down vote</Button>,
		},
	];

	const handleKeyPress = e => {
		if (e.key === "Enter") {
			const invokeParams = {
				FunctionName: postComment,
				Payload: JSON.stringify({
					newComment: e.target.value,
					city: props.match.params.city,
				}),
			};

			lambda.invoke(invokeParams, (err, res) => {
				if (err) {
					dispatch({ type: "COMMENTS_ERROR", error: err });
				}
				if (res) {
					// dispatch({ type: "COMMENTS_SUCCESS", comments: newComments });
				}
			});
		}
	};

	const vote = (commentID, functionName) => {
		const invokeParams = {
			FunctionName: functionName,
			Payload: JSON.stringify({
				commentID,
				cityName: props.match.params.city,
			}),
		};

		dispatch({ type: "COMMENTS_LOADING" });

		lambda.invoke(invokeParams, (err, res) => {
			if (err) {
				dispatch({ type: "COMMENTS_ERROR", error: err });
			}
			if (res) {
				const newComments = state.comments.map(x => {
					if (x.sort_key === commentID) {
						x.score = JSON.parse(res.Payload).data.score;
					}
					return x;
				});
				dispatch({ type: "COMMENTS_SUCCESS", comments: newComments });
			}
		});
	};

	useEffect(() => {
		const invokeParams = {
			FunctionName: getCityComments,
			Payload: JSON.stringify({
				city: props.match.params.city,
				limit: 5,
			}),
		};

		dispatch({ type: "COMMENTS_LOADING" });

		lambda.invoke(invokeParams, (err, res) => {
			if (err) {
				dispatch({ type: "COMMENTS_ERROR", error: err });
			}
			if (res) {
				const { data } = JSON.parse(res.Payload);
				dispatch({
					type: "FETCH_INIT_COMMENTS_SUCCESS",
					cityDescription: data[0].text_information,
					comments: data.slice(1),
				});
			}
		});
	}, [props.match.params.city]);

	return (
		<>
			<div>{state.cityDescription}</div>
			<Table dataSource={state.comments} columns={columns} rowKey={row => row.sort_key} />
			<Input placeholder="Basic usage" onKeyPress={event => handleKeyPress(event)} />
		</>
	);
};

export default CityDetailPage;
