const mongoose = require("mongoose");
const location = require("../utils/location");

const pizzaShopSchema = mongoose.Schema({
  shopId: {
    type: String,
    required: [true, "Please enter a shop id"],
    unique: true,
    trim: true
  },
  address: {
    type: String,
    required: [true, "Please enter an address"]
  },
  location: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number],
      index: "2dsphere"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

pizzaShopSchema.pre("save", async function(next) {
  const { lat, lng } = await location(this.address);
  this.location = {
    type: "Point",
    coordinates: [Number(lng), Number(lat)]
  };
  next();
});

module.exports = mongoose.model("PizzaShop", pizzaShopSchema);
