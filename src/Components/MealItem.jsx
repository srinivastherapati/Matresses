import { useContext, useState } from "react";
import Buttons from "./UI/Buttons";
import CartContext from "./Store/CartContext";

import ClearIcon from "@mui/icons-material/Clear";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { deleteProduct } from "./ServerRequests";

export default function MealItem({
  product,
  isAdmin,
  onEdit,
  isLoggedIn,
  setCurrentPage,
}) {
  const cartContxt = useContext(CartContext);
  const [quantity, setQuantity] = useState(product.stock);

  function handleAddMeal() {
    if (!isLoggedIn) {
      alert("Please login to continue");
      setCurrentPage("product");
      return;
    }
    cartContxt.addItems({ ...product, quantity });
    alert("Product Added to Cart");
  }

  function handleDelete() {
    try {
      let val = confirm("Are you sure you want to delete?");
      if (val === false) return;
      console.log("Delete meal:", product);
      deleteProduct(product.id);
      alert("Deleted Product Successfully !");
      window.location.reload();
    } catch (error) {
      alert("Error : " + error);
    }
    // Logic for deleting the meal
  }

  function incrementQuantity() {
    try {
      updateQuantity(quantity, "increment");
      alert("Sucessfully updated quantity");
    } catch (error) {
      alert("There was an error : " + error);
    }
    setQuantity((prevQuantity) => prevQuantity + 1);
  }

  function decrementQuantity() {
    try {
      updateQuantity(quantity, "decrement");
      alert("Sucessfully updated quantity");
    } catch (error) {
      alert("There was an error : " + error);
    }
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  }

  return (
    <li
      className="meal-item"
      style={{ disabled: !isAdmin && product.stock == 0 }}
    >
      <article>
        <img src={`${product.imageUrl}`} alt={product.name} />
        <div>
          <h3>{product.name} </h3>
          <p className="meal-item-description">{product.description}</p>
          <p>
            <StarHalfIcon style={{ fontSize: "18px", color: "#ff7058" }} />{" "}
            {product.rating}
          </p>{" "}
          <p className="meal-item-price">${product.price} </p>
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
                onClick={() => onEdit(product)} // Call onEdit when Edit button is clicked
                aria-label="Edit"
              />
              <div className="quantity-controls">
                {/* <RemoveIcon
                  sx={{ color: "#ffc404" }}
                  onClick={decrementQuantity}
                  aria-label="Decrease Quantity"
                /> */}
                <p>{product.stock}</p>
                {/* <AddIcon
                  sx={{ color: "#ffc404" }}
                  onClick={incrementQuantity}
                  aria-label="Increase Quantity"
                /> */}
              </div>
              <ClearIcon sx={{ color: "#ffc404" }} onClick={handleDelete} />
            </div>
          )}
        </p>
      </article>
    </li>
  );
}
