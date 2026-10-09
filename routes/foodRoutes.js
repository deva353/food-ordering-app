const express = require("express");
const router = express.Router();

const {
  getAllFood,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
} = require("../controllers/foodController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public routes
router.get("/", getAllFood);
router.get("/:id", getFoodById);

// Admin-only routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin"),
  createFood
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  updateFood
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteFood
);




module.exports = router;