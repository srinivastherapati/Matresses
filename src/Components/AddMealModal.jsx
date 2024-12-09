import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { addProduct, updateProduct } from "./ServerRequests";

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
            select
            label="Dimensions"
            fullWidth
            margin="normal"
            value={productVariants.size.toLowerCase()}
            onChange={(e) => handleVariantChange("size", e.target.value)}
            required
          >
            <MenuItem value="twin">Twin</MenuItem>
            <MenuItem value="queen">Queen</MenuItem>
            <MenuItem value="full">Full</MenuItem>
            <MenuItem value="king">King</MenuItem>
          </TextField>
          <TextField
            select
            label="Size"
            fullWidth
            margin="normal"
            value={productVariants.dimensions.toLowerCase()}
            onChange={(e) => handleVariantChange("dimensions", e.target.value)}
            required
          >
            <MenuItem value="8inch">8 Inch</MenuItem>
            <MenuItem value="10inch">10 Inch</MenuItem>
            <MenuItem value="12inch">12 Inch</MenuItem>
          </TextField>
          <TextField
            select
            label="Type"
            fullWidth
            margin="normal"
            value={productVariants.type}
            onChange={(e) => handleVariantChange("type", e.target.value)}
            required
          >
            <MenuItem value="mattresses">Mattresses</MenuItem>
            <MenuItem value="furniture">Furniture</MenuItem>
            <MenuItem value="accessories">Accessories</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

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