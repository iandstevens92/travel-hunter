import aws from "aws-sdk";

aws.config.update({
	apiVersion: "2015-03-31",
	endpoint: "http://localhost:3000",
	accessKeyId: "AKIATX4D5TFUTXMI4WOF",
	secretAccessKey: "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",
	region: "eu-west-1"
});

const lambda = new aws.Lambda({ region: "eu-west-1" });

export { lambda };
