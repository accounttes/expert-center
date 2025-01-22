import React, { useState, useEffect } from "react";
import "./NewTrip.css";

const NewTrip: React.FC = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tariff, setTariff] = useState("Эконом");
  const [region, setRegion] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const response = await fetch("http://localhost:3000/regions");
        const data = await response.json();
        setRegions(data.map((region: { name: string }) => region.name));
      } catch (error) {
        console.error("Ошибка при загрузке регионов:", error);
        setError("Не удалось загрузить регионы.");
      }
    };

    loadRegions();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!from || !to || !region) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      const newTrip = await fetch("http://localhost:3000/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, tariff, region }),
      });
      const createdTrip = await newTrip.json();
      console.log("Новая поездка добавлена:", createdTrip);
      setSuccessMessage("Поездка успешно создана!");

      setFrom("");
      setTo("");
      setTariff("Эконом");
      setRegion("");
      setFromSuggestions([]);
      setToSuggestions([]);
      setError("");
    } catch (error) {
      setError("Произошла ошибка при создании поездки.");
      console.error("Ошибка при добавлении поездки:", error);
    }
  };

  const fetchAddressSuggestions = async (
    input: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (input.length > 2) {
      const response = await fetch(
        `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`,
        {
          method: "POST",
          headers: {
            Authorization: "Token 267a6330d902a50641b88e7a90c73bfd9e0d0ef2",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: input }),
        }
      );

      const data = await response.json();
      setter(
        data.suggestions.map(
          (suggestion: { value: string }) => suggestion.value
        )
      );
    } else {
      setter([]);
    }
  };

  const handleAddressChange = async (
    setter: React.Dispatch<React.SetStateAction<string>>,
    input: string,
    suggestionsSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(input);
    await fetchAddressSuggestions(input, suggestionsSetter);
  };

  const selectSuggestion = (
    suggestion: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    suggestionsSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(suggestion);
    suggestionsSetter([]); 
  };

  return (
    <div className="new-trip-container">
      <h1>Создать новую поездку</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="from">Откуда:</label>
          <input
            type="text"
            id="from"
            value={from}
            onChange={(e) =>
              handleAddressChange(setFrom, e.target.value, setFromSuggestions)
            }
            placeholder="Введите адрес отправления"
            required
            maxLength={200}
          />
          {fromSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {fromSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() =>
                    selectSuggestion(suggestion, setFrom, setFromSuggestions)
                  }
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="to">Куда:</label>
          <input
            type="text"
            id="to"
            value={to}
            onChange={(e) =>
              handleAddressChange(setTo, e.target.value, setToSuggestions)
            }
            placeholder="Введите адрес назначения"
            required
            maxLength={200}
          />
          {toSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {toSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() =>
                    selectSuggestion(suggestion, setTo, setToSuggestions)
                  }
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="tariff">Тариф:</label>
          <select
            id="tariff"
            value={tariff}
            onChange={(e) => setTariff(e.target.value)}
          >
            <option value="Эконом">Эконом</option>
            <option value="Комфорт">Комфорт</option>
            <option value="Бизнес">Бизнес</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="region">Регион:</label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          >
            <option value="" disabled>
              Выберите регион
            </option>
            {regions.map((regionName) => (
              <option key={regionName} value={regionName}>
                {regionName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">
          Создать поездку
        </button>
      </form>
    </div>
  );
};

export default NewTrip;
