import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { addProduct,updateProduct } from "./ServerRequests";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AddMealModal({
  open,
  onClose,
  currentProduct,
  isAdd,
}) {
  const [name, setName] = useState(currentProduct?.name || "");
  const [imageUrl, setImageUrl] = useState(currentProduct?.imageUrl || "");
  const [description, setDescription] = useState(currentProduct?.description || "");
  const [stock, setStock] = useState(currentProduct?.stock || 1);
  const [price, setPrice] = useState(currentProduct?.price || 0);
  const [productVariants, setVariants] = useState({
    size: currentProduct?.productVariants?.size || "",
    color: currentProduct?.productVariants?.color || "",
    dimensions: currentProduct?.productVariants?.dimensions || "",
    type: currentProduct?.productVariants?.type || "",
  });

  const handleVariantChange = (key, value) => {
    setVariants((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const variantsArray = [
      {
        size: productVariants.size,
        color: productVariants.color,
        type: productVariants.type,
        dimension: productVariants.dimensions, // Map dimensions to dimension
      },
    ];
    const productData = {
      name,
      imageUrl,
      description,
      price,
      stock,
      productVariants: variantsArray,
    };
    

    try {
      if (!isAdd) {
        const response = await updateProduct(currentProduct.id, productData);
        if (response) {
          alert("Updated Product Successfully!");
          window.location.reload();
        }

        alert("Product updated successfully!");
      } else {
        const response = await addProduct(productData);
        if (response) {
          alert("Added Product Successfully!");
          window.location.reload();
        }
      }
      onClose();
    } catch (err) {
      alert("Failed to submit product: " + err.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-product-modal-title"
      aria-describedby="add-product-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="add-product-modal-title" variant="h6" component="h2">
          {!isAdd ? "Edit Product" : "Add New Product"}
        </Typography>
        <form>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            label="Price"
            fullWidth
            margin="normal"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <TextField
            label="Stock"
            fullWidth
            margin="normal"
            type="number"
            value={stock}
            onChange={(e) => setStock(Math.max(1, e.target.value))}
            required
          />

          <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
            Product Variants
          </Typography>
          <TextField
            label="Size"
            fullWidth
            margin="normal"
            value={productVariants.size}
            onChange={(e) => handleVariantChange("size", e.target.value)}
          />
          <TextField
            label="Color"
            fullWidth
            margin="normal"
            value={productVariants.color}
            onChange={(e) => handleVariantChange("color", e.target.value)}
          />
          <TextField
            label="Dimensions"
            fullWidth
            margin="normal"
            value={productVariants.dimensions}
            onChange={(e) => handleVariantChange("dimensions", e.target.value)}
          />
          <TextField
            label="Type"
            fullWidth
            margin="normal"
            value={productVariants.type}
            onChange={(e) => handleVariantChange("type", e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: "20px" }}
            onClick={handleSubmit}
          >
            {!isAdd ? "Update Product" : "Add Product"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

