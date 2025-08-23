import React, { useEffect, useState, useRef } from "react";
import Navbar from "./navbar";
import { FiSearch, FiPlus } from "react-icons/fi";
import HospitalBooking from "./hospitalBooking";
import { useAppointment } from "../contexts/AppointmentContext";

const tabs = [
  { key: "upcoming", label: "Upcoming Appointments" },
  { key: "completed", label: "Completed Appointments" },
  { key: "cancelled", label: "Cancelled Appointments" },
  { key: "admitted", label: "Admitted Patients" },
  { key: "emergency", label: "Emergency Patients" },
  { key: "opd", label: "OPD Patients" },
];

const Appointments = () => {
  const { setCounts, setHospitalId } = useAppointment();

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hospitalIdLocal, setHospitalIdLocal] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const containerRef = useRef(null);

  const [tokenMap, setTokenMap] = useState({});
  const listContainerRef = useRef(null);
  const [currentTopToken, setCurrentTopToken] = useState(null);

  useEffect(() => {
    const hospitalData = localStorage.getItem("hospital");
    if (hospitalData) {
      try {
        const hospital = JSON.parse(hospitalData);
        setHospitalIdLocal(hospital._id || hospital.id || null);
        setHospitalId(hospital._id || hospital.id || null); // update context
      } catch {
        setHospitalIdLocal(null);
        setHospitalId(null);
      }
    } else {
      setHospitalIdLocal(null);
      setHospitalId(null);
    }
  }, [setHospitalId]);

  // Function to assign tokens for upcoming appointments
  const assignTokens = (upcomingAppointments, prevTokenMap) => {
    const newTokenMap = { ...prevTokenMap };
    // Get maximum token currently assigned
    let maxToken = 0;
    Object.values(newTokenMap).forEach((t) => {
      if (t > maxToken) maxToken = t;
    });

    // Find upcoming appointments without tokens
    const noTokenAppts = upcomingAppointments.filter((appt) => !(appt._id in newTokenMap));

    // Assign new tokens starting from maxToken+1
    let nextToken = maxToken + 1;
    noTokenAppts.forEach((appt) => {
      newTokenMap[appt._id] = nextToken;
      nextToken++;
    });

    // Optionally reorder token numbers here if needed, but to keep stable, don't reorder existing assignments
    return newTokenMap;
  };

  const fetchAppointments = async () => {
    if (!hospitalIdLocal) {
      setError("Hospital ID is missing! Please log in again.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `http://localhost:3000/api/appointments/hospital/${hospitalIdLocal}`,
        { credentials: "include" }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();

      setAppointments(data);

      // Filter upcoming appointments to assign tokens
      const upcomingAppointments = data.filter((a) => !a.completed && !a.cancelled);

      // Assign tokens maintaining stability
      const newTokenMap = assignTokens(upcomingAppointments, tokenMap);
      setTokenMap(newTokenMap);

      const counts = {
        upcoming: upcomingAppointments.length,
        completed: data.filter((a) => a.completed).length,
        cancelled: data.filter((a) => a.cancelled).length,
      };
      setCounts(counts);
    } catch (err) {
      setError("Failed to load appointments. Please try again.");
      setAppointments([]);
      setCounts({ upcoming: 0, completed: 0, cancelled: 0 });
      setTokenMap({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hospitalIdLocal) fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalIdLocal]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSearchActive(false);
        setSearchName("");
      }
    }
    if (searchActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchActive]);

  useEffect(() => {
    let filtered = [];

    switch (activeTab) {
      case "upcoming":
        filtered = appointments.filter((a) => !a.completed && !a.cancelled);
        break;
      case "completed":
        filtered = appointments.filter((a) => a.completed);
        break;
      case "cancelled":
        filtered = appointments.filter((a) => a.cancelled);
        break;
      case "admitted":
        filtered = appointments.filter((a) => a.admitted);
        break;
      case "emergency":
        filtered = appointments.filter((a) => a.emergency);
        break;
      case "opd":
        filtered = appointments.filter((a) => a.OPD); // Adjust if OPD field differs
        break;
      default:
        filtered = appointments;
    }

    filtered = filtered.filter((appt) => {
      const matchesName =
        appt.patientName?.toLowerCase().includes(searchName.toLowerCase()) ?? true;
      const matchesDate = searchDate
        ? new Date(appt.appointmentDate).toISOString().slice(0, 10) === searchDate
        : true;
      return matchesName && matchesDate;
    });

    setFilteredAppointments(filtered);
  }, [activeTab, searchName, searchDate, appointments]);

  // Function to update current top token based on scroll or appointments change
  const updateCurrentTopToken = () => {
    if (!listContainerRef.current) return;

    const containerTop = listContainerRef.current.getBoundingClientRect().top;

    let closestId = null;
    let minDistance = Infinity;

    filteredAppointments.forEach((appt) => {
      const el = document.getElementById(`appt-${appt._id}`);
      if (el) {
        const elTop = el.getBoundingClientRect().top;
        const distance = Math.abs(elTop - containerTop);
        if (distance < minDistance) {
          minDistance = distance;
          closestId = appt._id;
        }
      }
    });

    if (closestId && tokenMap[closestId] !== currentTopToken) {
      setCurrentTopToken(tokenMap[closestId]);
    }
  };

  useEffect(() => {
    updateCurrentTopToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAppointments, tokenMap]);

  const handleCancel = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      // Get token of canceled appointment to reassign
      const canceledToken = tokenMap[appointmentId];

      const res = await fetch(`http://localhost:3000/api/appointments/${appointmentId}/cancel`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to cancel appointment");

      // Update token map: remove canceled appointment token
      setTokenMap((prev) => {
        const newMap = { ...prev };
        delete newMap[appointmentId];

        // Find upcoming appointments (without a token) after re-fetch
        const upcomingAppts = appointments.filter(
          (a) => !a.completed && !a.cancelled && a._id !== appointmentId
        );
        const nextApptWithoutToken = upcomingAppts.find((appt) => !(appt._id in newMap));

        if (nextApptWithoutToken !== undefined && canceledToken !== undefined) {
          // Assign the freed token number to the next upcoming without token
          newMap[nextApptWithoutToken._id] = canceledToken;
        }

        return newMap;
      });

      fetchAppointments();
    } catch (err) {
      alert("Failed to cancel appointment.");
      fetchAppointments();
    }
  };

  const handleMarkDone = async (appointmentId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/appointments/${appointmentId}/complete`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark as done");

      // Remove token of completed appointment, do not reorder tokens
      setTokenMap((prev) => {
        const newMap = { ...prev };
        delete newMap[appointmentId];
        return newMap;
      });

      fetchAppointments();
    } catch (err) {
      alert("Failed to mark appointment as done.");
      fetchAppointments();
    }
  };

  return (
    <>
      <div className="flex">
        <div className="Navbar w-72 fixed top-0 left-0 h-screen bg-white shadow-md overflow-auto z-20">
          <Navbar />
        </div>

        <div
          className="p-4 ml-72 pl-20 flex-grow max-w-full flex flex-col"
          style={{ minHeight: "100vh" }}
        >
          <div className="sticky top-0 z-40 bg-white py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-4">Appointments</h1>

            <div className="flex gap-4 mb-4">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  className={`px-4 py-2 rounded ${
                    activeTab === key ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div ref={containerRef} className="flex items-center justify-between gap-4 max-w-xl">
              <div className="flex items-center gap-3 relative w-full max-w-xl">
                <button
                  className={`text-gray-600 hover:text-gray-900 transition-opacity duration-300 ease-in-out ${
                    searchActive ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                  onClick={() => setSearchActive(true)}
                  aria-label="Open search"
                  style={{ flexShrink: 0 }}
                >
                  <FiSearch size={24} />
                </button>
                <input
                  type="text"
                  placeholder="Search by patient name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className={`bg-gray-100 border border-gray-300 rounded p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500 ease-in-out w-96 ${
                    searchActive ? "opacity-100 w-full visible" : "opacity-0 w-0 invisible"
                  }`}
                  spellCheck={false}
                  autoComplete="off"
                />
                <FiSearch
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none transition-opacity duration-500 ease-in-out ${
                    searchActive ? "opacity-100" : "opacity-0"
                  }`}
                  size={18}
                />
              </div>
              <input
    type="date"
    value={searchDate}
    onChange={(e) => setSearchDate(e.target.value)}
    className="border border-gray-300 rounded p-2  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    max={new Date().toISOString().slice(0, 10)}
  />

  <button
    onClick={() => {
      setSearchName("");
      setSearchDate("");
      setSearchActive(false);
    }}
    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
    aria-label="Clear search"
  >
    Clear
  </button>

              {/* Current Top Token Box */}
              <div className="mr-4 flex items-center">
                <span className="font-semibold text-gray-700">Current Token:</span>
                <div className="ml-2 px-3 py-1 bg-blue-200 text-blue-800 rounded font-mono">
                  {currentTopToken ?? "-"}
                </div>
              </div>

              <button
                onClick={fetchAppointments}
                className="p-2 rounded hover:bg-gray-200 transition flex items-center justify-center"
                aria-label="Refresh appointments"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M20 20v-5h-.581m-15.357-2a8.003 8.003 0 0015.357 2"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={listContainerRef}
            className="overflow-auto flex-grow pr-2"
            onScroll={updateCurrentTopToken}
          >
            {loading && <p className="mt-4">Loading appointments...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {!loading && !error && filteredAppointments.length === 0 && (
              <p className="mt-4">No appointments matched your search.</p>
            )}

            {!loading && !error && filteredAppointments.length > 0 && (
              <ul className="mt-4 space-y-2">
                {filteredAppointments.map((appointment) => (
                  <li
                    key={appointment._id}
                    id={`appt-${appointment._id}`}
                    className="bg-white shadow rounded p-3 flex items-center gap-4 justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {activeTab === "upcoming" && (
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-semibold select-none">
                          {tokenMap[appointment._id] !== undefined ? tokenMap[appointment._id] : "-"}
                        </div>
                      )}

                      {appointment.patientImage ? (
                        <img
                          src={appointment.patientImage}
                          alt={`${appointment.patientName}'s profile`}
                          className="w-16 h-16 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 select-none"
                        title={appointment.patientName}
                        style={{ display: appointment.patientImage ? "none" : "flex" }}
                      >
                        {appointment.patientName ? appointment.patientName.charAt(0).toUpperCase() : "?"}
                      </div>

                      <div>
                        <p>
                          <strong>Patient:</strong> {appointment.patientName || "Unknown"}
                        </p>
                        <p>
                          <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Phone:</strong> {appointment.phone}
                        </p>
                        <p>
                          <strong>Email:</strong> {appointment.patientEmail}
                        </p>
                        <p>
                          <strong>Address:</strong> {appointment.patientAddress}
                        </p>
                      </div>
                    </div>

                    {activeTab === "upcoming" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                          aria-label={`Cancel appointment for ${appointment.patientName}`}
                        >
                          Cancel
                        </button>

                        <button
                          onClick={() => handleMarkDone(appointment._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                          aria-label={`Mark appointment done for ${appointment.patientName}`}
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Rounded Plus Floating Button */}
      <button
        onClick={() => setShowBookingForm(true)}
        aria-label="Add Offline Patient"
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          color: "white",
          fontSize: 28,
          border: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s ease",
          zIndex: 1100,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
      >
        <FiPlus />
      </button>

      {/* Centered Modal with Fade and Scale Animation */}
      {showBookingForm && (
        <>
          <div
            onClick={() => setShowBookingForm(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(2px)",
              zIndex: 1090,
              opacity: 1,
              transition: "opacity 0.3s ease",
            }}
          />

          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(1)",
              backgroundColor: "white",
              borderRadius: 8,
              padding: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              width: "90%",
              maxWidth: 400,
              maxHeight: "75vh",
              overflowY: "auto",
              zIndex: 1100,
              opacity: 1,
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <HospitalBooking
              hospitalId={hospitalIdLocal}
              onSuccess={() => {
                setShowBookingForm(false);
                fetchAppointments();
              }}
            />
            <div style={{ textAlign: "right", marginTop: 16 }}>
              <button
                onClick={() => setShowBookingForm(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#555",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Appointments;
