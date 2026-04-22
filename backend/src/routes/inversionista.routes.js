const express = require("express");
const router = express.Router();

const {
  getInversionistas,
  getInversionista,
  updateInversionista,
  createInversionista
} = require("../controllers/inversionista.controller");

router.get("/", getInversionistas);
router.get("/:id", getInversionista);
router.post("/", createInversionista);
router.put("/:id", updateInversionista);

module.exports = router;