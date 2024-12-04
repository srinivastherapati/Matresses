import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import useHttp from "../hooks/useHttp";
import ErrorPage from "./ErrorPage";
import { getAllOrders, updateOrderStatus } from "./ServerRequests"; // Assume you have an API call for updating status

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#2e2e2e",
    minHeight: "100vh",
    color: "#fff",
    width: "100%",
  },
  table: {
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#ff7058",
    color: "#fff",
    fontWeight: "bold",
  },
  tableCell: {
    backgroundColor: "black",
    color: "black",
    border: "none",
    fontsize:"15px"
  },
};

const statusOptions = [
  "PREPARING",
  "READY",
  "DELIVERED",
 
];

const AllOrders = () => {
  const [totalOrders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update order status:", error);
      });
  };

  useEffect(() => {
    getAllOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => console.error("Failed to fetch orders:", error));
  }, []);


  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <ErrorPage title="Failed to fetch orders" message={error.message} />;
  }

  return (
    <Box style={styles.container}>
      <Typography variant="h4" gutterBottom>
        Total Orders
      </Typography>
      <TableContainer component={Paper} style={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={styles.tableHeader}>Order ID</TableCell>
              <TableCell style={styles.tableHeader}>Customer Name</TableCell>
              <TableCell style={styles.tableHeader}>Customer Email</TableCell>
              <TableCell style={styles.tableHeader} align="center">
                Total Price
              </TableCell>
              <TableCell style={styles.tableHeader} align="center">
                Order Date
              </TableCell>
              <TableCell style={styles.tableHeader}>Order Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totalOrders ?totalOrders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.customerEmail}</TableCell>
                <TableCell>${order.totalPayment.toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
  <select
    value={order.status}
    onChange={(e) =>
      handleStatusChange(order.orderId, e.target.value)
    }
    disabled={
      order.status === "Cancelled (By User)" ||
      order.status === "Cancelled (By Admin)" ||
      order.status === "DELIVERED"
    }
    style={{
      backgroundColor: order.status === "DELIVERED" || order.status.includes("Cancelled")
        ? "#f0f0f0"
        : "lightGreen",
      color: order.status === "DELIVERED" || order.status.includes("Cancelled")
        ? "#999999"
        : "#333333",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "8px 12px",
      fontSize: "14px",
      width: "100%",
      maxWidth: "200px",
      appearance: "none", // Remove default browser styling
      cursor: order.status === "DELIVERED" || order.status.includes("Cancelled")
        ? "not-allowed"
        : "pointer",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
    }}
  >
    {statusOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
</TableCell>

              </TableRow>
            )):  (
              <div style={{ display: "flex", width: "100%" }}>
                <p
                  style={{
                    justifyContent: "space-around",
                  }}
                >
                  No Orders at this time
                </p>
              </div>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllOrders;
