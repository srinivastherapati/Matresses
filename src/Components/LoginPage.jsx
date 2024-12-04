import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { registerUser, loginUser } from "./ServerRequests";

function LoginPage({ setLoggedIn, setUserData }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const togglePage = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ email, password });
      userData.role = "admin";
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userDetails", JSON.stringify(userData));
      console.log(userData);
      setUserData(userData);
      setLoggedIn(true);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const newUser = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address: [`${street}, ${city}, ${state}, ${zip}`],
      };
      console.log("Signup Payload:", newUser);
      await registerUser(newUser);
      alert("Signup successful! Please log in.");
      setIsLogin(true);
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        "&::after": {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        },
      }}
    >
      {/* Quote Section */}
      <Box
        sx={{
          zIndex: 2,
          color: "#fff",
          textAlign: "left",
          padding: "30px",
          maxWidth: "40%",
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", color: "#ff7058", mb: 2 }}
        >
          "Wake Up to Comfort"
        </Typography>
        <Typography variant="h6" sx={{ color: "#fefefe" }}>
          Find the perfect mattress for every sleeper. Experience unmatched
          quality and design tailored just for you.
        </Typography>
      </Box>

      {/* Login/Signup Box */}
      <Paper
        elevation={5}
        sx={{
          padding: "30px",
          width: "400px",
          zIndex: 2,
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "20px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {isLogin ? "Login" : "Sign Up"}
        </Typography>
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <>
              <TextField
                label="First Name"
                fullWidth
                margin="normal"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <TextField
                label="Last Name"
                fullWidth
                margin="normal"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <Typography variant="subtitle1" sx={{ textAlign: "left", mt: 2 }}>
                Address:
              </Typography>
              <TextField
                label="Street"
                fullWidth
                margin="normal"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
              <TextField
                label="City"
                fullWidth
                margin="normal"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <TextField
                label="State"
                fullWidth
                margin="normal"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
              <TextField
                label="Zip Code"
                fullWidth
                margin="normal"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
              />
            </>
          )}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <TextField
              label="Confirm Password"
              fullWidth
              type="password"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2, backgroundColor: "#324a5e" }}
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
        <Button
          variant="text"
          onClick={togglePage}
          sx={{ color: "#ff7058", textTransform: "none" }}
        >
          {isLogin
            ? "New here? Sign Up"
            : "Already have an account? Login"}
        </Button>
      </Paper>
    </Box>
  );
}

export default LoginPage;