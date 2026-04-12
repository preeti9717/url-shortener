const express = require("express");
const URL = require("../models/url"); 
const { handleGenerateNewShortURL , handleGetAnalytics } = require("../controllers/url");
const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get('/analytics/:shortId', handleGetAnalytics);
 

//edited
router.delete("/delete/:id", async (req, res) => {
    try {
        const result = await URL.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).json({ message: "Not found" });
        }

        return res.status(200).json({ message: "Deleted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

//till here

module.exports = router;
