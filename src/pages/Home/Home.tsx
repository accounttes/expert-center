import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Добро пожаловать в приложение для организации поездок!</h1>
      <p>Выберите один из вариантов ниже, чтобы продолжить:</p>
      <div className="button-container">
        <Link to="/trips/passenger" className="button passenger-button">
          Я пассажир
        </Link>
        <Link to="/trips/driver" className="button driver-button">
          Я водитель
        </Link>
      </div>
    </div>
  );
};

export default Home;
