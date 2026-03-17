const router = require("express").Router();
const contactController = require("../controllers/contacts");

// #swagger.tags = ["Contacts"]
router.get("/", contactController.getAll);
router.get("/:id", contactController.getById);
router.post("/", contactController.create);
router.put("/:id", contactController.update);
router.delete("/:id", contactController.deleteContact);

module.exports = router;
