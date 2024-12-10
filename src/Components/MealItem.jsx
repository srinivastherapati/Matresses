import { useContext, useState } from "react";
import Buttons from "./UI/Buttons";
import CartContext from "./Store/CartContext";
import AddVariantModal from "./AddVariantModal";

import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { deleteProduct } from "./ServerRequests";


export default function MealItem({
  product,
  isAdmin,
  onEdit,
  isLoggedIn,
  setCurrentPage,
  onAddVariant,
}) {
  const cartContxt = useContext(CartContext);
  const [quantity, setQuantity] = useState(product.stock);
  const [selectedSize, setSelectedSize] = useState(""); // Manage selected size
  const [selectedDimension, setSelectedDimension] = useState(""); // Manage selected dimension
  const [showModal, setShowModal] = useState(false); // Manage modal visibility

  function handleAddMeal() {
    if (!isLoggedIn) {
      alert("Please login to continue");
      setCurrentPage("product");
      return;
    }
    cartContxt.addItems({
      ...product,
      quantity,
      size: selectedSize,
      dimension: selectedDimension,
    });
    alert("Product Added to Cart");
  }

  function handleDelete() {
    try {
      let val = confirm("Are you sure you want to delete?");
      if (val === false) return;
      deleteProduct(product.id);
      alert("Deleted Product Successfully!");
      window.location.reload();
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  const toggleModal = () => setShowModal((prev) => !prev);


  return (
    <>
      <li className="meal-item">
        <article>
          <img src={`${product.imageUrl}`} alt={product.name} />
          <div>
            <h3>{product.name}</h3>
            <p className="meal-item-description">{product.description}</p>
            {isAdmin && product.productVariants && (
  <>
    <ul
      className="product-variants-list"
      style={{
        marginTop: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      {product.productVariants.map((variant, index) => (
        <li
          key={index}
          className="variant-item"
          style={{
            marginBottom: "10px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <strong>Variant {index + 1}:</strong>{" "}
          <span style={{ color: "#007BFF" }}>Size: {variant.size}</span>,{" "}
          <span style={{ color: "#28A745" }}>Type: {variant.type}</span>,{" "}
          <span style={{ color: "red" }}>Dimension: {variant.dimension}</span>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>
            Stock: {variant.stock}
          </p>
          <p
            className="meal-item-price"
            style={{ margin: "0", color: "#FF7058", fontWeight: "bold" }}
          >
            ${variant.price}
          </p>
        </li>
      ))}
    </ul>
    <p
      style={{
        marginTop: "10px",
        fontWeight: "bold",
        color: "#333",
        fontSize: "16px",
      }}
    >
      Total Stock:{" "}
      {product.productVariants.reduce((total, variant) => total + variant.stock, 0)}
    </p>
  </>
)}

            {/* <p>
              <StarHalfIcon style={{ fontSize: "18px", color: "#ff7058" }} />{" "}
              {product.rating}
            </p> */}
            <div className="price-and-options">
            {!isAdmin && product.productVariants && (
  <>
    <select
      value={selectedSize}
      onChange={(e) => setSelectedSize(e.target.value)}
      className="dropdown"
    >
      <option value="">Select Size</option>
      {[...new Set(product.productVariants.map((variant) => variant.size))].map(
        (type) => (
          <option key={type} value={type}>
            {type}
          </option>
        )
      )}
    </select>
    <select
      value={selectedDimension}
      onChange={(e) => setSelectedDimension(e.target.value)}
      className="dropdown"
    >
      <option value="">Select dimensions</option>
      {[...new Set(product.productVariants.map((variant) => variant.dimension))].map(
        (dimension) => (
          <option key={dimension} value={dimension}>
            {dimension}
          </option>
        )
      )}
    </select>
  </>
)}
            </div>
          </div>
          <p className="meal-item-actions">
            {!isAdmin && (
              <Buttons
                onClick={product.stock > 0 ? handleAddMeal : null}
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? "Out of Stock" : "+ Add to Cart"}
              </Buttons>
            )}
            {isAdmin && (
              <div className="admin-actions">
                <EditIcon
                  sx={{ color: "#ffc404" }}
                  onClick={() => onEdit(product)}
                  aria-label="Edit"
                />
                <button onClick={toggleModal} className="add-variant-button">
                  Add Variant
                </button>
              </div>
            )}
          </p>
        </article>
      </li>
      {showModal && (
        <AddVariantModal
          product={product}
          onClose={toggleModal}
          onAddVariant={onAddVariant}
        />
      )}
    </>
  );
}
  