const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const saucesCtrl = require("../controlers/sauces");
const unique = require("../middleware/unique");

router.get("/", auth, saucesCtrl.getAll);
router.post("/", auth, multer, unique, saucesCtrl.create);
router.get("/:_id", auth, saucesCtrl.getOne);
router.post("/:_id/like", auth, unique, saucesCtrl.like);
router.delete("/:_id", auth, saucesCtrl.delete);
router.put("/:_id", auth, multer, unique, saucesCtrl.modify);

module.exports = router;
