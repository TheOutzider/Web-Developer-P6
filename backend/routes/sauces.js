const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const saucesCtrl = require("../controlers/sauces");
const unique = require("../middleware/unique");

router.get("/", auth, saucesCtrl.getAll);
router.get("/:id", auth, saucesCtrl.getOne);

router.post("/", auth, multer, unique, saucesCtrl.create);
router.put("/:id", auth, multer, unique, saucesCtrl.modify);
router.delete("/:id", auth, saucesCtrl.delete);

router.post("/:id/like", auth, unique, saucesCtrl.like);
router.post("/:id/dislike", auth, saucesCtrl.dislike);

module.exports = router;
