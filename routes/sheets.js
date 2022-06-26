const { Router } = require("express");
const router = Router();

const { getSheet } = require("../controllers/sheets");
const { getSheetNames } = require("../controllers/sheets");
const { postSheets } = require("../controllers/sheets");

router.get("/", getSheet);
router.get("/names", getSheetNames);
router.post("/", postSheets);

module.exports = router;
