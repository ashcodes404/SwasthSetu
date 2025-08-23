import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const tabs = [
  { key: "upcoming", label: "Upcoming Appointments" },
  { key: "completed", label: "Completed Appointments" },
  { key: "cancelled", label: "Cancelled Appointments" },
  { key: "profile", label: "Profile" },
];

const Dashboard = ({ userId }) => {
  console.log("Dashboard userId:", userId);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch function memoized to avoid re-creating
  const fetchAppointments = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      let url = "";
      switch (activeTab) {
        case "upcoming":
          url = `http://localhost:3000/api/appointments/user/${userId}/upcoming`;
          break;
        case "completed":
          url = `http://localhost:3000/api/appointments/user/${userId}/completed`;
          break;
        case "cancelled":
          url = `http://localhost:3000/api/appointments/user/${userId}/cancelled`;
          break;
        default:
          url = "";
      }

      if (url) {
        const response = await axios.get(url, { withCredentials: true });
        setAppointments(response.data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      setError("Failed to fetch appointments.");
      setAppointments([]);
    }
    setLoading(false);
  }, [activeTab, userId]);

  useEffect(() => {
    fetchAppointments();

    // Poll every 15 seconds
    const intervalId = setInterval(() => {
      fetchAppointments();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchAppointments]);

  return (
    <div className="flex h-screen max-w-7xl mx-auto gap-6 p-4 bg-transparent">
      {/* Sidebar with sticky positioning */}
      <nav
        className="w-60 bg-white bg-opacity-80 border-r border-gray-300 flex flex-col pt-4"
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-left px-4 py-3 rounded-l-md font-semibold mb-1 transition-colors ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Scrollable right content with transparent background */}
      <main
        className="flex-1 p-6 rounded min-h-full overflow-y-auto"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", maxHeight: "100vh" }}
      >
        {loading && <p>Loading appointments...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && activeTab === "upcoming" && (
          <>
            {appointments.length === 0 ? (
              <p>No upcoming appointments found.</p>
            ) : (
              appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="border rounded p-4 mb-4 bg-gray-50 shadow-sm"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    Hospital: {appt.hospitalId?.name || "Unknown"}
                  </h2>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(appt.appointmentDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Location:</strong> {appt.hospitalId?.location || "-"}
                  </p>
                  <p>
                    <strong>Specialties:</strong>{" "}
                    {appt.hospitalId?.specialties?.join(", ") || "-"}
                  </p>
                  <p>
                    <strong>Your Token Number:</strong> {appt.tokenNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Current Running Token:</strong> {appt.hospitalId?.currentToken || "N/A"}
                  </p>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "completed" && (
          <p className="text-gray-600 italic">Completed appointments content here.</p>
        )}

        {activeTab === "cancelled" && (
          <p className="text-gray-600 italic">Cancelled appointments content here.</p>
        )}

        {activeTab === "profile" && (
          <p className="text-gray-600 italic">User profile content here.</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
