import React, { useState } from "react";
import { addProduct, updateProduct } from "./ServerRequests";

export default function AddVariantModal({ product, onClose, onAddVariant }) {
  const [size, setSize] = useState("");
  const [dimension, setDimension] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const productName=product.name;

  const handleAddVariant = async () => {
    if (!size || !dimension || !price || !stock) {
      alert("Please fill in all fields!");
      return;
    }

    // Call the API with the variant details
    const np = {
      name: product.name,
      description: product.description,
      productId: product.id,
      imageUrl : product.imageUrl,
      productVariants: [
        {
          size,
          dimension,
          productName,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          type: "matresses",
        },
      ],
    };

    try {
      const response = await addProduct(np);
      if (response) {
        alert("Added Product Successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Variant for {product.name}</h2>
        <label>
          Size:
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Select Size</option>
            <option value="Twin"    disabled={product.productVariants.some((variant) => variant.size === "Twin")}>Twin</option>
            <option value="Full"  disabled={product.productVariants.some((variant) => variant.size === "Full")}>Full</option>
            <option value="Queen"  disabled={product.productVariants.some((variant) => variant.size === "Queen")}>Queen</option>
            <option value="King"  disabled={product.productVariants.some((variant) => variant.size === "King")}>King</option>
          </select>
          
        </label>
        <label>
          Dimension:
          <select
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
          >
            <option value="">Select Dimension</option>
            <option value="8inch">8inch</option>
            <option value="10inch">10inch</option>
            <option value="12inch">12inch</option>
          </select>
        </label>
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
        </label>
        <label>
          Stock:
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter stock quantity"
          />
        </label>
        <div className="modal-actions">
          <button onClick={handleAddVariant}>Add Variant</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
