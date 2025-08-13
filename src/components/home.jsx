import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const { user, isAuthenticated } = useAuth0();

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);

  //  Fixed: Destructure errors from formState
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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

  const cities = [...new Set(hospitals.map((h) => h.location).filter(Boolean))];

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesName = hospital.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity
      ? hospital.location === selectedCity
      : true;
    return matchesName && matchesCity;
  });

  const openModal = (hospital) => {
    setSelectedHospital(hospital);
    reset({
      hospitalName: hospital.name,
      hospitalLocation: hospital.location,
    });
  };

  const closeModal = () => {
    setSelectedHospital(null);
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    alert("Appointment booked!");
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

      {/* Loading / Error */}
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
                  <strong>Specialties:</strong>{" "}
                  {hospital.specialties?.join(", ")}
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

      {/* Modal with Animation */}
     {/* Modal with Animation */}
<AnimatePresence>
  {selectedHospital && (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white p-4 rounded-lg shadow-lg w-[350px]"
        initial={{ scale: 0.8, opacity: 0, y: -50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <h2 className="text-lg font-bold mb-3">Book Appointment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          
          {/* Hospital Info */}
          <input {...register("hospitalName")} readOnly className="w-full border px-2 py-1 rounded bg-gray-100" />
          <input {...register("hospitalLocation")} readOnly className="w-full border px-2 py-1 rounded bg-gray-100" />

          {/* Name + Contact in same row */}
          <div className="grid grid-cols-2 gap-2">
            <input
              {...register("patientName", {
                required: "Name is required",
                pattern: { value: /^[A-Za-z ]+$/, message: "Only letters allowed" },
                minLength: { value: 2, message: "At least 2 characters" }
              })}
              placeholder="Name"
              className="border px-2 py-1 rounded w-full"
            />
            <input
              {...register("patientContact", {
                required: "Contact required",
                pattern: { value: /^[0-9]{10}$/, message: "10-digit number only" }
              })}
              placeholder="Contact"
              className="border px-2 py-1 rounded w-full"
            />
          </div>
          {errors.patientName && <p className="text-red-500 text-xs">{errors.patientName.message}</p>}
          {errors.patientContact && <p className="text-red-500 text-xs">{errors.patientContact.message}</p>}

          {/* Gender + Date in same row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1">
                <input type="radio" value="Male" {...register("gender", { required: "Gender required" })} /> Male
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" value="Female" {...register("gender", { required: "Gender required" })} /> Female
              </label>
            </div>
            <input
              type="date"
              {...register("appointmentDate", { required: "Date required" })}
              className="border px-2 py-1 rounded w-full"
            />
          </div>
          {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
          {errors.appointmentDate && <p className="text-red-500 text-xs">{errors.appointmentDate.message}</p>}

          {/* Photo */}
          <input
            type="file"
            accept="image/*"
            capture="user"
            {...register("patientPhoto", { required: "Photo required" })}
            className="border px-2 py-1 rounded w-full"
          />
          {errors.patientPhoto && <p className="text-red-500 text-xs">{errors.patientPhoto.message}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeModal} className="px-3 py-1 bg-gray-300 rounded text-sm">Cancel</button>
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Confirm</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
};

export default Home;
