import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const Home = () => {
  const { user, isAuthenticated } = useAuth0();

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/hospitals")
      .then((response) => {
        setHospitals(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching hospitals");
        setLoading(false);
      });
  }, []);

  // ✅ Extract unique cities for dropdown
  const cities = [...new Set(hospitals.map((h) => h.location).filter(Boolean))];

  // ✅ Filter hospitals by name & selected city
  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesName = hospital.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity ? hospital.location === selectedCity : true;
    return matchesName && matchesCity;
  });

  return (
    <div className="container mx-auto px-4">
      {isAuthenticated && (
        <h1 className="text-[50px] italic font-bold text-[#343282] text-center mt-5 font-arimo">
          Welcome Mr. {user?.name}
        </h1>
      )}

      {/* Search + City Dropdown */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between my-5 w-[60%] ml-[20%]">
        <div className="flex border rounded-full px-4 py-2 items-center w-full sm:w-[400px]">
          <img className="w-5 mr-2" src="search.svg" alt="search icon" />
          <input
            type="text"
            placeholder="Search for hospitals"
            className="flex-grow outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="border rounded-full px-4 py-2 outline-none w-full sm:w-[150px]"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && <p className="text-center">Loading hospitals...</p>}

      {/* Error State */}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* Hospitals List */}
      {!loading && !error && (
        <ul className="max-w-5xl mx-auto grid grid-cols-2 gap-4 ">
          {filteredHospitals.length === 0 ? (
            <p className="text-center text-gray-600">No hospitals found.</p>
          ) : (
            filteredHospitals.map((hospital) => (
              <li
                key={hospital._id}
                className="border rounded p-4 pl-14 shadow hover:shadow-lg transition bg-[#DEEEFF]"
              >
                <h2 className="text-xl text-[#262656] font-semibold underline ">{hospital.name}</h2>
                <p>
                  <strong>Location:</strong> {hospital.location}
                </p>
                <p>
                  <strong>Specialties:</strong>{" "}
                  {hospital.specialties?.join(", ")}
                </p>
                <p>
                  <strong>Contact:</strong> {hospital.contact}
                </p>
                <p>{hospital.description}</p>
               <button
  className="mt-3 ml-[120px] bg-[#262656] text-white px-4 py-2 rounded-full hover:bg-[#343282] transition duration-200"
  
>
  Book Appointment
</button>

              </li>
              
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Home;
