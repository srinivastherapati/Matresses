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
            <p>
              <StarHalfIcon style={{ fontSize: "18px", color: "#ff7058" }} />{" "}
              {product.rating}
            </p>
            <div className="price-and-options">
              <p className="meal-item-price">${product.price}</p>
              {!isAdmin && (
                <>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="dropdown"
                  >
                    <option value="">Select Size</option>
                    <option value="Twin">Twin</option>
                    <option value="Full">Full</option>
                    <option value="Queen">Queen</option>
                    <option value="King">King</option>
                  </select>
                  <select
                    value={selectedDimension}
                    onChange={(e) => setSelectedDimension(e.target.value)}
                    className="dropdown"
                  >
                    <option value="">Select Dimension</option>
                    <option value="8inch">8inch</option>
                    <option value="10inch">10inch</option>
                    <option value="12inch">12inch</option>
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
