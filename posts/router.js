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

router.post("/", async (req, res) => {
	const {title, contents} = req.body;
	if (!title || !contents) {
		res.status(400)
			.json({errorMessage: "Please, provide title and contents for post."});
	}
	try {
		// is there a better way to structure this if within the try?
		// is there another response status that I could send within an else statement?
		if (typeof title === "string" && typeof contents === "string") {
			const post = await db.insert({title, contents});
			res.status(201).json(post);
		}
	} catch (error) {
		res.status(500).json({
			message: "Error adding the post"
		});
	}
});

router.put("/:id", async (req, res) => {
	const {title, contents} = req.body;
	try {
		const postToUpdate = await db.update(req.params.id, {title, contents});
		if (postToUpdate) {
			res.status(200).json(postToUpdate);
		}
		if (!postToUpdate) {
			res.status(404).json({message: "The post could not be found."});
		}
	} catch (error) {
		res.status(500).json({
			message: "Error updating the post."
		})
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const postToDelete = await db.remove(req.params.id);
		if (postToDelete > 0) {
			res.status(200).json({message: "Post has been deleted."});
		}
		if (postToDelete <= 0) {
			res.status(404).json({message: "The post could not be found."});
		}
	} catch (error) {
		res.status(500).json({message: "Error removing the post."})
	}
});

module.exports = router;
