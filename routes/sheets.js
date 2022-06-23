const { Router } = require("express");
const router = Router();

const { getSheets } = require("../controllers/sheets");
const { postSheets } = require("../controllers/sheets");

router.get("/", getSheets);
router.post("/", postSheets);

module.exports = router;
