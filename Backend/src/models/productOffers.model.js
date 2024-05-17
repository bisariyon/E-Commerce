import mongoose, { Schema } from "mongoose";

const productOffersSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    minimumOrderValue: {
      type: Number,
    },
    validFrom: {
      type: Date,
      // required: true,
    },
    validTill: {
      type: Date,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
  },
  { timestamps: true }
);

// Index to expire documents after the 'validTill' date
productOffersSchema.index({ validTill: 1 }, { expireAfterSeconds: 0 });

export const ProductOffers = mongoose.model(
  "ProductOffers",
  productOffersSchema
);
