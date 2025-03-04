import React, { useState } from "react";
import useHttp from "../hooks/useHttp.jsx";
import ErrorPage from "./ErrorPage.jsx";
import MealItem from "./MealItem.jsx";
import AddMealModal from "./AddMealModal.jsx";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { API_BASE_URL } from "./ServerRequests.jsx";

const requestConfig = {};

export default function Meals({ isAdmin, isLoggedIn, setCurrentPage }) {
  const {
    response: loadProducts,
    isLoading,
    error,
  } = useHttp(`${API_BASE_URL}/products/get`, requestConfig, []);
  const [isAdd, setIsAdd] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const products = loadProducts || [];

  // Filter and Sort Logic
  const handleSearch = (query) => {
    setSearchQuery(query);
    updateFilteredProducts(
      query,
      sortOption,
      selectedCategories,
      selectedTypes
    );
  };

  const handleSort = (option) => {
    setSortOption(option);
    updateFilteredProducts(
      searchQuery,
      option,
      selectedCategories,
      selectedTypes
    );
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(
      category.toLowerCase()
    )
      ? selectedCategories.filter((cat) => cat !== category.toLowerCase())
      : [...selectedCategories, category.toLowerCase()];
    setSelectedCategories(updatedCategories);
    updateFilteredProducts(
      searchQuery,
      sortOption,
      updatedCategories,
      selectedTypes
    );
  };

  const handleTypeChange = (type) => {
    const updatedTypes = selectedTypes.includes(type.toLowerCase())
      ? selectedTypes.filter((t) => t !== type.toLowerCase())
      : [...selectedTypes, type.toLowerCase()];
    setSelectedTypes(updatedTypes);
    updateFilteredProducts(
      searchQuery,
      sortOption,
      selectedCategories,
      updatedTypes
    );
  };

  const updateFilteredProducts = (query, sortOption, categories, types) => {
    let filtered = [...products];

    // Apply search filter
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Apply category filter
    console.log(filtered);
    console.log(categories);
    if (categories.length) {
      filtered = filtered.filter(
        (product) =>
          product.productVariants[0] &&
          product.productVariants[0].size &&
          categories.includes(product.productVariants[0].size.toLowerCase())
      );
    }

    // Apply type filter
    if (types.length) {
      filtered = filtered.filter(
        (product) =>
          product.productVariants[0] &&
          product.productVariants[0].type &&
          types.includes(product.productVariants[0].type.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOption) {
      if (sortOption === "A-Z") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === "Z-A") {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortOption === "price: low to high") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortOption === "price: high to low") {
        filtered.sort((a, b) => b.price - a.price);
      }
    }

    setFilteredProducts(filtered);
  };

  const sidebarStyles = {
    position: "fixed",
    top: "85px",
    left: "0",
    width: "250px",
    height: "calc(100% - 60px)",
    padding: "20px",
    boxSizing: "border-box",
    zIndex: "1000",
  };

  const handleAddProduct = () => {
    setCurrentProduct({
      name: "",
      imageUrl: "",
      description: "",
      productVariants: {
        size: "queen",
        color: "",
        dimensions: "",
        type: "Mattresses",
        price:1,
        stock:1
      },
    });
    setIsAdd(true);
    setShowAddModal(true);
  };

  const handleAddProductSuccess = () => {
    setIsAdd(false);
    setShowAddModal(false);
    window.location.reload();
  };

  const handleEditProduct = (product) => {
    console.log(product);
    setCurrentProduct(product);
    setIsAdd(false);
    setShowAddModal(true); // Open modal for editing
  };

  const displayedProducts =
    searchQuery ||
    sortOption ||
    selectedCategories.length ||
    selectedTypes.length
      ? filteredProducts
      : products;

  // Error and Loading States
  if (isLoading) {
    return <p className="center">Fetching Items....</p>;
  }
  if (error) {
    return <ErrorPage title="Failed to Fetch Items" message={error.message} />;
  }

  // Sidebar Content
  const categories = ["QUEEN", "KING", "FULL", "TWIN"];
  const types = ["MATRESSES", "FURNITURE", "ACCESSORIES", "OTHER"];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Box sx={sidebarStyles}>
        <h3>Filters</h3>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <h4>Sort By</h4>
        <Select
          value={sortOption}
          onChange={(e) => handleSort(e.target.value)}
          fullWidth
        >
          <MenuItem value="A-Z">A-Z</MenuItem>
          <MenuItem value="Z-A">Z-A</MenuItem>
          <MenuItem value="price: low to high">Price: Low to High</MenuItem>
          <MenuItem value="price: high to low">Price: High to Low</MenuItem>
        </Select>
        <h4>Category</h4>
        <FormGroup>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.toLowerCase())}
                  onChange={() => handleCategoryChange(category)}
                />
              }
              label={category}
            />
          ))}
        </FormGroup>
        <h4>Type</h4>
        <FormGroup>
          {types.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedTypes.includes(type.toLowerCase())}
                  onChange={() => handleTypeChange(type)}
                />
              }
              label={type}
            />
          ))}
        </FormGroup>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          marginLeft: "260px",
          width: "calc(100% - 260px)",
          padding: "20px",
        }}
      >
        {isAdmin && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ff7058",
              "&:hover": {
                backgroundColor: "#e65b4a", // Optional: Customize hover color
              },
            }}
            onClick={() => handleAddProduct()}
          >
            Add New Item
          </Button>
        )}

        <AddMealModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddSuccess={() => {
            handleAddProductSuccess;
          }}
          currentProduct={currentProduct}
          isAdd={isAdd}
        />

        <ul id="meals">
          {displayedProducts.map((product) => (
            <MealItem
              setCurrentPage={setCurrentPage}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
            />
          ))}
        </ul>
      </Box>
    </Box>
  );
}
