import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2563eb", "#f59e42", "#ef4444", "#f97316"];

const LiveDateTime = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="text-gray-700 font-medium mt-2 mb-4 text-lg">
      {now.toLocaleDateString()} {now.toLocaleTimeString()}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    numDoctors: 0,
    numPatients: 0,
    numAdmitted: 0,
    emergency: 0,
    ICUCount: 0,
    OPDCount: 0,
    daywise: {
      dates: [],
      upcoming: [],
      completed: [],
      cancelled: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const prevDataRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedHospital = localStorage.getItem("hospital");

    if (!token || !storedHospital) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const parsedHospital = JSON.parse(storedHospital);
      setHospital(parsedHospital);
    } catch {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!hospital) return;

    const fetchDashboardData = async () => {
      try {
        setError("");
        const response = await fetch(
          `http://localhost:3000/api/dashboard/${hospital._id}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();

        const safeDaywise = {
          dates: Array.isArray(data.daywise?.dates) ? data.daywise.dates : [],
          upcoming: Array.isArray(data.daywise?.upcoming) ? data.daywise.upcoming : [],
          completed: Array.isArray(data.daywise?.completed) ? data.daywise.completed : [],
          cancelled: Array.isArray(data.daywise?.cancelled) ? data.daywise.cancelled : [],
        };

        const newDataStr = JSON.stringify(data);
        if (prevDataRef.current !== newDataStr) {
          prevDataRef.current = newDataStr;
          setStats({
            ...data,
            daywise: safeDaywise,
            upcoming: data.upcoming || 0,
            completed: data.completed || 0,
            cancelled: data.cancelled || 0,
            numDoctors: data.numDoctors || 0,
            numPatients: data.numPatients || 0,
            numAdmitted: data.numAdmitted || 0,
            emergency: data.emergency || 0,
            ICUCount: data.ICUCount || 0,
            OPDCount: data.OPDCount || 0,
          });
        }
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const intervalId = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(intervalId);
  }, [hospital]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hospital");
    navigate("/", { replace: true });
  };

  if (!hospital) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading dashboard...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-medium">
        {error}
      </div>
    );
  }

  const daywiseChartData =
    stats.daywise?.dates?.map((date, index) => ({
      date,
      upcoming: stats.daywise?.upcoming?.[index] ?? 0,
      completed: stats.daywise?.completed?.[index] ?? 0,
      cancelled: stats.daywise?.cancelled?.[index] ?? 0,
    })) || [];

  const patientsPieData = [
    { name: "Admitted", value: stats.numAdmitted ?? 0 },
    { name: "ICU", value: stats.ICUCount ?? 0 },
    { name: "Emergency", value: stats.emergency ?? 0 },
    { name: "OPD", value: stats.OPDCount ?? 0 },
  ];

  const statConfig = [
    { label: "Upcoming Appointments", value: stats.upcoming },
    { label: "Completed Appointments", value: stats.completed },
    { label: "Cancelled Appointments", value: stats.cancelled },
    { label: "Doctors Available", value: stats.numDoctors },
  ];

  const Icon = ({ label }) => {
    switch (label) {
      case "Upcoming Appointments":
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill="#2563eb" rx="4" />
            <path d="M7 9h10M7 13h6" stroke="white" strokeWidth="2" />
          </svg>
        );
      case "Completed Appointments":
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#22c55e" />
            <path
              d="M8 12l3 3 5-5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "Cancelled Appointments":
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#ef4444" />
            <path
              d="M8 8l8 8M16 8l-8 8"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "Doctors Available":
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="#2563eb" />
            <rect x="4" y="16" width="16" height="6" rx="3" fill="#2563eb" />
            <rect x="9" y="18" width="6" height="2" rx="1" fill="#fff" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <div className="Navbar h-screen w-[23%] bg-white shadow">
        <Navbar />
      </div>

      <div className="flex-1 p-7 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {hospital.name || "Hospital"} 👋
            </h1>
            <div className="text-gray-500 mt-1">
              Hospital ID: {hospital.hospitalId || hospital._id || "N/A"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <LiveDateTime />

        {/* Stats Boxes with scrollbar hidden */}
        <div
          className="mb-8 flex flex-nowrap gap-6"
          style={{
            maxWidth: "100%",
            overflowX: "auto",
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For IE and Edge
          }}
        >
          {statConfig.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center bg-white rounded-xl shadow p-6 flex-shrink-0"
              style={{ minWidth: "260px", maxWidth: "280px", marginRight: "8px" }}
            >
              <span className="p-3 rounded-full mr-4 bg-gray-100 flex justify-center items-center">
                <Icon label={label} />
              </span>
              <div>
                <div className="text-lg font-semibold text-gray-900">{value}</div>
                <div className="text-gray-500">{label}</div>
              </div>
            </div>
          ))}
          <style>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Appointments (Bar Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daywiseChartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="upcoming" fill="#2563eb" />
                <Bar dataKey="completed" fill="#22c55e" />
                <Bar dataKey="cancelled" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Patients Distribution (Pie Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patientsPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {patientsPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
