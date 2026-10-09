const Food = require("../models/Food");

// GET all available food items
const getAllFood = async (req, res) => {
  try {
    const foodItems = await Food.find({
      isAvailable: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: foodItems.length,
      foodItems
    });
  } catch (error) {
    console.error("Get food error:", error.message);

    res.status(500).json({
      message: "Failed to fetch food items"
    });
  }
};

// GET one food item
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findOne({
      _id: req.params.id,
      isAvailable: true
    });

    if (!food) {
      return res.status(404).json({
        message: "Food item not found"
      });
    }

    res.status(200).json({ food });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid food ID"
      });
    }

    res.status(500).json({
      message: "Failed to fetch food item"
    });
  }
};

// ADMIN: Create food item
const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      price === undefined ||
      price === null ||
      price === "" ||
      typeof price === "boolean" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: "Enter valid food details and price"
      });
    }

    if (
      image !== undefined &&
      typeof image !== "string"
    ) {
      return res.status(400).json({
        message: "Image must be a URL string"
      });
    }

    const food = await Food.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      image: image || "",
      category: category.trim()
    });

    res.status(201).json({
      message: "Food item created successfully",
      food
    });
  } catch (error) {
    console.error("Create food error:", error.message);

    res.status(500).json({
      message: "Failed to create food item"
    });
  }
};

// ADMIN: Update food item
const updateFood = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "description",
      "price",
      "image",
      "category",
      "isAvailable"
    ];

    const updates = {};
    const submittedFields = Object.keys(req.body);

    if (submittedFields.length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update"
      });
    }

    for (const field of submittedFields) {
      if (!allowedFields.includes(field)) {
        return res.status(400).json({
          message: `Field '${field}' cannot be updated`
        });
      }

      updates[field] = req.body[field];
    }

    if (
      "name" in updates &&
      (typeof updates.name !== "string" ||
        !updates.name.trim())
    ) {
      return res.status(400).json({
        message: "Enter a valid food name"
      });
    }

    if (
      "description" in updates &&
      (typeof updates.description !== "string" ||
        !updates.description.trim())
    ) {
      return res.status(400).json({
        message: "Enter a valid description"
      });
    }

    if (
      "category" in updates &&
      (typeof updates.category !== "string" ||
        !updates.category.trim())
    ) {
      return res.status(400).json({
        message: "Enter a valid category"
      });
    }

    if ("price" in updates) {
      if (
        updates.price === null ||
        updates.price === "" ||
        typeof updates.price === "boolean" ||
        !Number.isFinite(Number(updates.price)) ||
        Number(updates.price) < 0
      ) {
        return res.status(400).json({
          message: "Enter a valid price"
        });
      }

      updates.price = Number(updates.price);
    }

    if (
      "image" in updates &&
      typeof updates.image !== "string"
    ) {
      return res.status(400).json({
        message: "Image must be a URL string"
      });
    }

    if (
      "isAvailable" in updates &&
      typeof updates.isAvailable !== "boolean"
    ) {
      return res.status(400).json({
        message: "isAvailable must be true or false"
      });
    }

    for (const field of ["name", "description", "category"]) {
      if (field in updates) {
        updates[field] = updates[field].trim();
      }
    }

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!food) {
      return res.status(404).json({
        message: "Food item not found"
      });
    }

    res.status(200).json({
      message: "Food item updated successfully",
      food
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid food ID"
      });
    }

    res.status(500).json({
      message: "Failed to update food item"
    });
  }
};

// ADMIN: Delete food item
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(
      req.params.id
    );

    if (!food) {
      return res.status(404).json({
        message: "Food item not found"
      });
    }

    res.status(200).json({
      message: "Food item deleted successfully"
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid food ID"
      });
    }

    res.status(500).json({
      message: "Failed to delete food item"
    });
  }
};




module.exports = {
  getAllFood,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
};