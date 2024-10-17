"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Favorite from "./Favourite";
import Forecast from "./Forecast";
import SearchComponent from "./SearchComponent";

const Dashboard = () => {
  const [city, setCity] = useState("Delhi");
  const [lastSearchedCity, setLastSearchedCity] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [unit, setUnit] = useState("metric");

  // Fetch last searched city from localStorage when component mounts
  useEffect(() => {
    const storedCity = localStorage.getItem("lastSearchedCity");
    if (storedCity) {
      setCity(storedCity);
      setLastSearchedCity(storedCity); // Set last searched city when the component mounts
    }
  }, [lastSearchedCity]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get("http://localhost:3001/favoriteCities");
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorite cities:", error);
    }
  };

  const handleOpenDialog = () => {
    fetchFavorites();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  const handleForecastLoad = (loadedCity) => {
    setCity(loadedCity);

    setLastSearchedCity(loadedCity);
    setShowPopup(true);
  };

  return (
    <div className="dashboard">
      <h1>Weather Dashboard</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "85%",
        }}
      >
        <SearchComponent setCity={setCity} />
        <Button
          variant="outlined"
          onClick={handleOpenDialog}
          style={{
            height: "40%",
            textTransform: "none",
            borderRadius: "10px",
            color: "black",
          }}
        >
          My Favourites
        </Button>
      </div>

      <FormControlLabel
        control={
          <Switch
            checked={unit === "imperial"}
            onChange={handleUnitToggle}
            color="primary"
          />
        }
        label={unit === "metric" ? "Celsius" : "Fahrenheit"}
        labelPlacement="start"
        style={{ marginLeft: "20px" }}
      />

      <Forecast city={city} unit={unit} onForecastLoad={handleForecastLoad} />

      <Favorite
        city={city}
        isVisible={showPopup}
        onClose={() => setShowPopup(false)}
      />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            backgroundColor: "#f5f5f5",
            boxShadow: "none",
            borderRadius: "15px",
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="h5"
            style={{ color: "#ff4081", textAlign: "center" }}
          >
            Your Favorite Cities
          </Typography>
        </DialogTitle>
        <DialogContent>
          <List>
            {favorites.length > 0 ? (
              favorites.map((favCity) => (
                <ListItem
                  key={favCity.id}
                  style={{
                    backgroundColor: "#fff",
                    margin: "5px 0",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "10px",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" style={{ color: "#333" }}>
                        {favCity.name}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography
                variant="body1"
                style={{ textAlign: "center", color: "#999" }}
              >
                No favorite cities added yet.
              </Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            color="secondary"
            style={{
              backgroundColor: "#ff4081",
              borderRadius: "20px",
              padding: "10px 20px",
              color: "white",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
