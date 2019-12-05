import aws from "aws-sdk";

aws.config.update({
	apiVersion: "2015-03-31",
	endpoint: "http://localhost:3000",
	accessKeyId: "",
	secretAccessKey: "",
	region: "eu-west-1",
});

const lambda = new aws.Lambda({ region: "eu-west-1" });

export { lambda };
