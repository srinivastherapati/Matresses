import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import useHttp from "../hooks/useHttp";
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
  onAddSuccess,
  currentProduct,
  isAdd,
}) {
  const [name, setName] = useState(currentProduct.name);
  const [imageUrl, setImageUrl] = useState(currentProduct.imageUrl);
  const [description, setDescription] = useState(currentProduct.description);
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState(currentProduct.price);
  const [category, setCategory] = useState("queen");
  const [type, setType] = useState("Mattresses");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { sendRequest } = useHttp();

  useEffect(() => {
    if (currentProduct) {
      setName(currentProduct.name);
      setImageUrl(currentProduct.imageUrl);
      setDescription(currentProduct.description);
      setPrice(currentProduct.price);
      setStock(currentProduct.stock || 1);
      setCategory(currentProduct.category || "queen");
      setType(currentProduct.type || "Mattresses");
    }
  }, [currentProduct]);

  const handleSubmit = async () => {
    const productData = {
      name,
      imageUrl,
      description,
      stock,
      price,
      category: category.toUpperCase(),
      type:type.toUpperCase(),
    };

    try {
      setIsLoading(true);
      setError(null);

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
      setError(err.message);
      alert("Failed to submit product: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-meal-modal-title"
      aria-describedby="add-meal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="add-meal-modal-title" variant="h6" component="h2">
          {!isAdd ? "Edit Item" : "Add New Item"}
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
          <TextField
            select
            label="Category"
            fullWidth
            margin="normal"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="queen">QUEEN</MenuItem>
            <MenuItem value="king">KING</MenuItem>
            <MenuItem value="full">FULL</MenuItem>
            <MenuItem value="twin">TWIN</MenuItem>
          </TextField>
          <TextField
            select
            label="Type"
            fullWidth
            margin="normal"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="Mattresses">MATRESSES</MenuItem>
            <MenuItem value="Bedroom utilities">ACCESSORIES</MenuItem>
            <MenuItem value="Furniture">FURNITURE</MenuItem>
            <MenuItem value="Other">OTHER</MenuItem>
          </TextField>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ marginTop: "20px" }}
            onClick={handleSubmit}
          >
            {isLoading ? "Processing..." : !isAdd ? "Update Item" : "Add Item"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
