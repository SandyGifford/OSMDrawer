var path = require("path");

module.exports = {
	mode: "development",
	entry: {
		index: "./src/index.tsx",
	},
	output: {
		path: path.resolve(__dirname, "public/build"),
		filename: "[name].js"
	},
	devtool: "source-map",
	externals: {
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".scss"]
	},
	module: {
		rules: [
			{ test: /\.(ts|tsx)$/, loader: "ts-loader" },
			{ test: /\.(scss)$/, loader: ["style-loader", "css-loader", "sass-loader"] },
		]
	},
};