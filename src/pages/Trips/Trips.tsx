import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Trips.css";
import TripCard from "../../components/TripCard/TripCard";

interface Trip {
  first: number;
  prev: number;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: Array<{
    id: string;
    from: string;
    to: string;
    tariff: string;
    status: string;
  }>;
}

interface Region {
  id: string;
  name: string;
}

interface TripCardProps {
  userType: "passenger" | "driver";
}

const Trips: React.FC<TripCardProps> = ({ userType }) => {
  const [trips, setTrips] = useState<Trip>({
    first: 0,
    prev: 0,
    next: 0,
    last: 0,
    pages: 0,
    items: 0,
    data: [
      {
        id: "",
        from: "",
        to: "",
        tariff: "",
        status: "",
      },
    ],
  });
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedTariff, setSelectedTariff] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState("Запланирована");

  const [currentPage, setCurrentPage] = useState(1);
  const [tripsPerPage, setTripsPerPage] = useState(10);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const response = await fetch("http://localhost:3000/regions");
        if (!response.ok) {
          throw new Error("Ошибка при загрузке регионов");
        }
        const regionsData: Region[] = await response.json();
        setRegions(regionsData);
      } catch {
        setError("Не удалось загрузить регионы");
      }
    };

    loadRegions();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const regionFromUrl = params.get("from");
    const tariffFromUrl = params.get("tariff");

    if (regionFromUrl) {
      setSelectedRegion(regionFromUrl);
    } else {
      setSelectedRegion(null);
    }

    if (tariffFromUrl) {
      setSelectedTariff(tariffFromUrl);
    } else {
      setSelectedTariff(null);
    }
  }, [location.search]);

  const loadTrips = async () => {
    const regionQuery = selectedRegion ? `&from=${selectedRegion}` : "";
    const tariffQuery = selectedTariff ? `&tariff=${selectedTariff}` : "";
    const statusQuery =
      selectedStatus && selectedStatus === "Завершено"
        ? `&status=${selectedStatus}`
        : "";
    const pageQuery = `&_page=${currentPage}&_per_page=${tripsPerPage}`;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/trips?${regionQuery}${tariffQuery}${statusQuery}${pageQuery}`
      );

      console.log("Fetching trips:", response.url);

      if (!response.ok) {
        throw new Error("Ошибка при загрузке поездок");
      }
      const data = await response.json();
      console.log("Loaded trips:", data);
      setTrips(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [
    selectedRegion,
    selectedTariff,
    currentPage,
    tripsPerPage,
    selectedStatus,
  ]);

  const totalTripsCount = trips.items;

  const totalPages = Math.ceil(totalTripsCount / tripsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const regionName = event.target.value;
    setSelectedRegion(regionName || null);

    const params = new URLSearchParams(location.search);
    if (regionName) {
      params.set("from", regionName);
    } else {
      params.delete("from");
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleFilterByTariff = (tariff: string) => {
    setSelectedTariff(tariff);

    const params = new URLSearchParams(location.search);
    if (tariff) {
      params.set("tariff", tariff);
    } else {
      params.delete("tariff");
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="trips-container">
      <h1>Список поездок</h1>

      {userType === "passenger" && (
        <Link to="/new-trip" className="add-trip-button">
          Добавить поездку
        </Link>
      )}

      {userType === "driver" && (
        <div className="filters">
          <select onChange={handleRegionChange} value={selectedRegion || ""}>
            <option value="">Выберите регион</option>
            {regions.map((region) => (
              <option key={region.id} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
          <div className="tariffs-filter">
            <button
              className={`${
                selectedTariff === "Эконом" ? "tariff-active" : ""
              }`}
              onClick={() => handleFilterByTariff("Эконом")}
            >
              Эконом
            </button>
            <button
              className={`${
                selectedTariff === "Комфорт" ? "tariff-active" : ""
              }`}
              onClick={() => handleFilterByTariff("Комфорт")}
            >
              Комфорт
            </button>
            <button
              className={`${
                selectedTariff === "Бизнес" ? "tariff-active" : ""
              }`}
              onClick={() => handleFilterByTariff("Бизнес")}
            >
              Бизнес
            </button>
          </div>
        </div>
      )}

      <div className="status-filter">
        <label htmlFor="status">Фильтр по статусу:</label>
        <select
          id="status"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="Запланирована">Опубликованные</option>
          <option value="Завершено">Завершенные</option>
        </select>
      </div>

      <div className="records-per-page">
        <label htmlFor="records-per-page">Записей на странице:</label>
        <select
          id="records-per-page"
          value={tripsPerPage}
          onChange={(e) => setTripsPerPage(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="trips-list">
        {trips.items === 0 ? (
          <div>Поездки не найдены.</div>
        ) : (
          trips &&
          trips.data &&
          trips.data.map((trip) => (
            <Link
              key={trip.id}
              to={`/${
                userType === "driver" ? "driver" : "passenger"
              }/trip-details/${trip.id}`}
            >
              <TripCard trip={trip} />
            </Link>
          ))
        )}
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Назад
        </button>
        <span>
          Страница {currentPage} из {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Вперед
        </button>
      </div>
    </div>
  );
};

export default Trips;
