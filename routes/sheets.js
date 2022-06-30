const { Router } = require("express");
var multer = require("multer");
const router = Router();

const { getSheet } = require("../controllers/sheets");
const { getSheetNames } = require("../controllers/sheets");
const { postSheets } = require("../controllers/sheets");

router.get("/", getSheet);
router.get("/names", getSheetNames);
router.post("/", multer().any(), postSheets);

module.exports = router;
