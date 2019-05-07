const express = require("express");

const db = require("../data/db.js");

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const posts = await db.find();
		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({
			message: "Error retrieving the posts."
		})
	}
})

module.exports = router;
