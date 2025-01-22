import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./TripDetails.css"; 

interface Trip {
  id: string;
  from: string;
  to: string;
  tariff: string;
  status: string;
}

const TripDetails: React.FC<{ userType: "driver" | "passenger" }> = ({
  userType,
}) => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (id) {
          const response = await fetch(`http://localhost:3000/trips/${id}`);
          if (!response.ok) {
            throw new Error("Поездка не найдена");
          }
          const data = await response.json();
          setTrip(data);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const updateTripStatus = async (newStatus: string) => {
    if (trip) {
      const updatedTrip = { ...trip, status: newStatus };

      try {
        const response = await fetch(`http://localhost:3000/trips/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTrip),
        });
        if (!response.ok) {
          throw new Error("Не удалось обновить статус поездки");
        }
        setTrip(updatedTrip);
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  const handleStartTrip = () => updateTripStatus("В пути");
  const handleArrive = () => updateTripStatus("Прибыл");
  const handleCompleteTrip = () => updateTripStatus("Завершено");

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="trip-details-container">
      <h1>Детали поездки</h1>
      {trip && (
        <div className="trip-info">
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
      )}
      {userType === "driver" && trip && trip.status !== "Завершено" && (
        <div className="driver-actions">
          <button onClick={handleStartTrip}>Начать поездку</button>
          <button onClick={handleArrive}>Приехал на место</button>
          <button onClick={handleCompleteTrip}>Завершить поездку</button>
        </div>
      )}
      <button className="back-button" onClick={() => window.history.back()}>
        Назад
      </button>
    </div>
  );
};

export default TripDetails;
