"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudIcon from "@mui/icons-material/Cloud";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CircularProgress from "@mui/material/CircularProgress";

const Favorite = ({ city, isVisible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get("http://localhost:3001/favoriteCities");
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorite cities:", error);
    }
  };

  const addToFavorites = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3001/favoriteCities", {
        name: city,
        id: uuidv4(),
      });
      fetchFavorites();
      onClose();
    } catch (error) {
      console.error("Error adding city to favorites:", error);
    }
    setLoading(false);
  };

  const deleteCity = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/favoriteCities/${id}`);
      setFavorites((prev) => prev.filter((city) => city.id !== id));
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  };

  return (
    <Dialog
      open={isVisible}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 25,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          padding: "20px",
        },
      }}
      transitionDuration={500}
    >
      <DialogTitle
        style={{
          background: "linear-gradient(135deg, #84fab0, #8fd3f4)",
          color: "white",
          textAlign: "center",
          padding: "25px",
          borderRadius: "20px 20px 0 0",
        }}
      >
        <WbSunnyIcon
          fontSize="large"
          style={{ color: "yellow", marginBottom: "-10px" }}
        />
        <Typography
          variant="h5"
          style={{
            fontWeight: "bold",
            marginTop: "10px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Add {city} to Favorites?
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        style={{
          background: "rgba(240, 248, 255, 0.85)",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <Typography
          variant="h6"
          style={{
            color: "#333",
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Your Favorite Cities
        </Typography>
        {favorites.length === 0 ? (
          <Typography
            variant="body1"
            style={{ color: "#777", textAlign: "center" }}
          >
            No favorite cities added yet.
          </Typography>
        ) : (
          <List>
            {favorites.map((favCity) => (
              <ListItem
                key={favCity.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteCity(favCity.id)}
                  >
                    <DeleteIcon style={{ color: "#ff4d4d" }} />
                  </IconButton>
                }
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "15px",
                  margin: "8px 0",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                  padding: "10px 15px",
                }}
              >
                <CloudIcon style={{ color: "#1E90FF", marginRight: "15px" }} />
                <ListItemText
                  primary={favCity.name}
                  style={{ color: "#333", fontFamily: "'Poppins', sans-serif" }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "0 0 20px 20px",
        }}
      >
        <Button
          onClick={addToFavorites}
          variant="contained"
          style={{
            background: "linear-gradient(90deg, #ff9966, #ff5e62)",
            color: "white",
            borderRadius: "30px",
            padding: "10px 20px",
            marginRight: "10px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} style={{ color: "white" }} />
          ) : (
            "Yes, Add"
          )}
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          style={{
            background: "linear-gradient(90deg, #36d1dc, #5b86e5)",
            color: "white",
            borderRadius: "30px",
            padding: "10px 20px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Favorite;
