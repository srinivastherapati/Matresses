import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Collapse,
  CircularProgress,
  Button,
  Grid,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Star,
  StarBorder,
} from "@mui/icons-material";
import {
  cancelOrder,
  getCustomerOrders,
  updateProductRating,
} from "./ServerRequests.jsx";
import "./CustomerOrders.css"; // Update CSS for global styles.

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openRow, setOpenRow] = useState({});
  const [ratings, setRatings] = useState({});
  const userData = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    getCustomerOrders(userData.userId)
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch past orders.");
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  const handleCancelOrder = useCallback((id) => {
    cancelOrder(id);
    alert("Order Cancelled, Refund Initiated");
  }, []);

  const handleRatingChange = (productId, rating) => {
    try {
      updateProductRating(userData.userId, productId, rating);
      alert("Rating updated successfully");
    } catch (error) {
      alert("Error : " + error);
    }
    setRatings((prev) => ({ ...prev, [productId]: rating }));
  };

  const toggleRow = (orderId) => {
    setOpenRow((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const renderStars = (productId) => {
    const currentRating = ratings[productId] || 0;
    return (
      <Box display="flex">
        {[1, 2, 3, 4, 5].map((value) => (
          <IconButton
            key={value}
            onClick={() => handleRatingChange(productId, value)}
            size="small"
            style={{
              color: value <= currentRating ? "#ff7058" : "#ccc",
              transition: "color 0.3s ease",
            }}
          >
            {value <= currentRating ? <Star /> : <StarBorder />}
          </IconButton>
        ))}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#324a5e"
      >
        <CircularProgress style={{ color: "#ff7058" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#324a5e"
      >
        <Typography variant="h6" color="#ff7058">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box padding={3} bgcolor="#f5f7fa" minHeight="100vh">
      <Typography
        variant="h4"
        gutterBottom
        style={{ color: "#324a5e", fontWeight: "bold", textAlign: "center" }}
      >
        Your Orders
      </Typography>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.orderId}>
            <Card
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <CardContent
                style={{ backgroundColor: "#324a5e", color: "#fff" }}
              >
                <Typography variant="h6">Order ID: {order.orderId}</Typography>
                <Typography variant="body2" style={{ color: "#c0d3e0" }}>
                  Date: {new Date(order.orderDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  Amount: ${order.totalPayment.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  style={{
                    color: order.status === "CANCELLED" ? "#ff7058" : "#c0d3e0",
                  }}
                >
                  Status: {order.status}
                </Typography>
              </CardContent>
              <CardActions
                style={{ justifyContent: "space-between", padding: "8px 16px" }}
              >
                {order.status !== "CANCELLED" && (
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#ff7058",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleCancelOrder(order.orderId)}
                  >
                    Cancel Order
                  </Button>
                )}
                <IconButton
                  onClick={() => toggleRow(order.orderId)}
                  style={{ color: "#ff7058" }}
                >
                  {openRow[order.orderId] ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              </CardActions>
              <Collapse
                in={openRow[order.orderId]}
                timeout="auto"
                unmountOnExit
              >
                <Box padding={2} bgcolor="#f7f9fc">
                  <Typography variant="subtitle1" style={{ color: "#324a5e" }}>
                    Order Items:
                  </Typography>
                  {order.products.map((product) => (
                    <Box
                      key={product.productId}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      my={1}
                      style={{
                        borderBottom: "1px solid #ccc",
                        paddingBottom: "8px",
                      }}
                    >
                      <Typography style={{ color: "#324a5e" }}>
                        {product.name}
                      </Typography>
                      {renderStars(product.productId)}
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CustomerOrders;
