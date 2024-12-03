import { useContext, useState } from "react";
import axios from "axios";
import Modal from "./UI/Modal";
import CartContext from "./Store/CartContext";
import Buttons from "./UI/Buttons";
import Input from "./UI/Input";
import UserProgressContext from "./Store/UserProgressContext";
import ErrorPage from "./ErrorPage";
import { API_BASE_URL } from "./ServerRequests";

export default function Checkout() {
  const crtCntxt = useContext(CartContext);
  const userPrgrs = useContext(UserProgressContext);
  const userId = JSON.parse(localStorage.getItem("userDetails")).userId;

  const [isOrderPlaced, setIsOrderPlaced] = useState(false); // Track if the order is placed successfully.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cartTotal = crtCntxt.items.reduce((totalPrice, item) => {
    return totalPrice + item.quantity * item.price;
  }, 0);

  function handleHideCheckout() {
    userPrgrs.hideCheckout();
  }

  function handleFinish() {
    setIsOrderPlaced(false); // Reset state for future use.
    userPrgrs.hideCheckout();
    crtCntxt.clearCart();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/place/${userId}`,
        {
          order: {
            items: crtCntxt.items,
            customer: customerData,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setIsOrderPlaced(true); // Show success modal.
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  let actions = (
    <>
      <Buttons type="button" textOnly onClick={handleHideCheckout}>
        Close
      </Buttons>
      <Buttons>Place Order</Buttons>
    </>
  );

  if (isLoading) {
    actions = <span>Placing your order...</span>;
  }

  if (isOrderPlaced) {
    return (
      <Modal open={userPrgrs.progress === "checkout"}>
        <h2>Success!</h2>
        <p>Your Order Placed Successfully</p>
        <p>We will get back to you with more details via email.</p>
        <p className="modal-actions">
          <Buttons onClick={handleFinish}>Okay</Buttons>
        </p>
      </Modal>
    );
  }

  if (error) {
    return <ErrorPage title="Failed to place order" message={error} />;
  }

  return (
    <Modal open={userPrgrs.progress === "checkout"}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {Math.round(cartTotal * 100) / 100}</p>
        <Input id="name" type="text" label="Full Name" />
        <Input id="email" type="email" label="Email" />
        <Input id="street" type="text" label="Street" />
        <div className="control-row">
          <Input id="city" type="text" label="City" />
          <Input id="postal-code" type="text" label="Postal Code" />
        </div>
        <p>Card Details</p>
        <Input id="Card Number" type="text" label="Card Number" />
        <Input id="Name on Card" type="text" label="Name On Card" />
        <Input id="CVV" type="text" label="CVV" />
        <Input id="expiry" type="text" label="Expiry" />
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
