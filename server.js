const express = require("express");
const server = express();
const postsRouter = require("./posts/router.js");

server.use(express.json());
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
	res.send("Root");
})

module.exports = server;
