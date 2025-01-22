import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import NewTrip from "./pages/NewTrip/NewTrip";
import TripDetails from "./pages/TripDetails/TripDetails";
import Trips from "./pages/Trips/Trips";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/trips/passenger"
          element={<Trips userType={"passenger"} />}
        />
        <Route path="/trips/driver" element={<Trips userType={"driver"} />} />
        <Route path="/new-trip" element={<NewTrip />} />

        <Route
          path="/driver/trip-details/:id"
          element={<TripDetails userType={"driver"} />}
        />
        <Route
          path="/passenger/trip-details/:id"
          element={<TripDetails userType={"passenger"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
