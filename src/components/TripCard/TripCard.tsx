import React from "react";
import "./TripCard.css"; 

interface Trip {
  id: string;
  from: string;
  to: string;
  tariff: string;
  status: string;
}

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  return (
    <div className="trip-card">
      <h2>Поездка #{trip.id}</h2>
      <p>
        <strong>Откуда:</strong> {trip.from}
      </p>
      <p>
        <strong>Куда:</strong> {trip.to}
      </p>
      <p>
        <strong>Тариф:</strong> {trip.tariff}
      </p>
      <p>
        <strong>Статус:</strong> {trip.status}
      </p>
    </div>
  );
};

export default TripCard;
