const express = require("express");

const db = require("../data/db.js");

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const posts = await db.find();
		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({
			error: "Error retrieving the posts."
		})
	}
})

router.get("/:id", async (req, res) => {
	try {
		const post = await db.findById(req.params.id);
		if (post) {
			res.status(200).json(post);
		}
		if (!post) {
			res.status(404).json({message: "The post with the specified ID does not exist"})
		}
	} catch (error) {
		res.status(500).json({error: "The post information could not be retrieved."});
	}
});

router.post("/", async (req, res) => {
	const {title, contents} = req.body;
	if (!title || !contents) {
		res.status(400)
			.json({errorMessage: "Please, provide title and contents for the post."});
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
			error: "There was an error while saving the post to the database."
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
