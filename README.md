# Weather Forecast App

This is a Weather Forecast application built using **Next.js** for the frontend and **jsonServer** for data storage. The app fetches real-time weather data from the **OpenWeatherMap API** to display the current weather conditions for any location.

## Features

- Real-time weather updates
- Search weather by city
- Simple and clean UI
- Data persistence using jsonServer

## Technologies Used

- **Next.js**: Frontend framework
- **jsonServer**: Local database for storing data
- **OpenWeatherMap API**: Weather data provider

---

## How to Run

Follow these steps to set up and run the Weather Forecast app on your local machine.

### Step 1: Install Dependencies

First, clone the project and navigate to the project directory. Then, run the following command to install all necessary dependencies:

```bash
npm install
```

### Step 2: Set Up OpenWeatherMap API

1. Go to [OpenWeatherMap API](https://openweathermap.org/api).
2. Create an account if you don't have one.
3. After logging in, click on your username in the top-right corner and go to **My API Keys**.
4. Here you will find your API key.

### Step 3: Add Your API Key

Open the file `src/components/forecast.js`, and replace `YOUR_API_KEY` with the API key you obtained from OpenWeatherMap.

```javascript
const API_KEY = "YOUR_API_KEY";
```

### Step 4: Run the Application

- Now run the application using following command

```bash
npm run dev:all
```

### Step 5: Access the Application

- Once the project is running, go to your browser and open:
  [http://localhost:3000](http://localhost:3000).
