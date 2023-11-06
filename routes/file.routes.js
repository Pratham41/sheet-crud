const router = require("express").Router();
const {
  getAllFiles,
  getSheet,
  updateSheetData,
  addSheetData
} = require("../controllers/file.controller");

router.route("/").get(getAllFiles);
router.route("/read/sheet/:sheetID").get(getSheet).put(updateSheetData).post(addSheetData);

module.exports = router;
