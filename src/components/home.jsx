import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import BookAppointmentForm from "./BookAppointmentForm";

const Home = () => {
  const { user, isAuthenticated } = useAuth0();

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);

  const { reset } = useForm();

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

  // Removed department fetching useEffect entirely since you don't want to fetch departments 

  const cities = [...new Set(hospitals.map((h) => h.location).filter(Boolean))];

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesName = hospital.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity ? hospital.location === selectedCity : true;
    return matchesName && matchesCity;
  });

  const openModal = (hospital) => {
  console.log("Opening modal for hospital:", hospital._id);
  reset({
    hospitalName: hospital.name,
    hospitalLocation: hospital.location,
  });
  setSelectedHospital(hospital);
};


  const closeModal = () => setSelectedHospital(null);

  const onSuccess = () => {
    closeModal();
  };

  return (
    <div className="container mx-auto px-4">
      {isAuthenticated && (
        <h1 className="text-[50px] italic font-bold text-[#343282] text-center mt-5 font-arimo">
          Welcome Mr. {user?.name}
        </h1>
      )}

      {/* Search + Filter */}
      <div className="flex justify-center gap-4 mb-8 max-w-3xl mx-auto">
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search for hospitals"
            className="
              w-full rounded-full bg-white bg-opacity-80 
              pl-10 pr-4 
              py-2.5 
              text-base text-[#343282] placeholder-[#acaed6]
              shadow-md border border-gray-300 
              outline-none focus:ring-2 focus:ring-[#5A63E3]
              transition font-semibold
            "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8686a0]">
            <img className="w-4 h-4" src="search.svg" alt="search" />
          </span>
        </div>

        <div className="relative flex-shrink-0">
          <select
            className="
              w-full rounded-full bg-white bg-opacity-80 
              py-2.5 px-6
              text-base text-[#343282] 
              shadow-md border border-gray-300 
              outline-none appearance-none 
              focus:ring-2 focus:ring-[#5A63E3] 
              transition font-semibold
              min-w-[150px] cursor-pointer
            "
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
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 text-sm">
            ▼
          </span>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <ul className="max-w-5xl mx-auto grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <li
              key={index}
              className="border rounded p-4 pl-14 shadow bg-[#DEEEFF] animate-pulse"
            >
              <div className="h-5 w-2/3 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-2/4 bg-gray-300 rounded mb-2"></div>
              <div className="h-12 w-32 bg-gray-400 rounded mt-4"></div>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* Hospital List */}
      {!loading && !error && (
        <ul className="max-w-5xl mx-auto grid grid-cols-2 gap-4">
          {filteredHospitals.length === 0 ? (
            <p className="text-center text-gray-600">No hospitals found.</p>
          ) : (
            filteredHospitals.map((hospital) => (
              <li
                key={hospital._id}
                className="border rounded p-4 pl-14 shadow hover:shadow-lg transition bg-[#DEEEFF]"
              >
                <h2 className="text-xl text-[#262656] font-semibold underline">
                  {hospital.name}
                </h2>
                <p>
                  <strong>Location:</strong> {hospital.location}
                </p>
                <p>
                  <strong>Specialties:</strong> {hospital.specialties?.join(", ")}
                </p>
                <p>
                  <strong>Contact:</strong> {hospital.contact}
                </p>
                <p>{hospital.description}</p>
                <button
                  onClick={() => openModal(hospital)}
                  className="mt-3 ml-[120px] bg-[#262656] text-white px-4 py-2 rounded-full hover:bg-[#343282] transition duration-200"
                >
                  Book Appointment
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {/* Modal with Appointment Form */}
      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg w-[380px] max-w-full relative"
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
                aria-label="Close modal"
              >
                ×
              </button>
              <BookAppointmentForm
               hospitalId={selectedHospital._id}
  userId={user?.sub}   // Pass logged-in user id here
  onSuccess={closeModal}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
