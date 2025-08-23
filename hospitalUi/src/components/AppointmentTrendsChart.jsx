import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AppointmentTrendsChart = ({ daywise }) => {
  if (!daywise || !daywise.dates) return null;

  // Prepare data for the chart
  const data = daywise.dates.map((date, idx) => ({
    date,
    Upcoming: daywise.upcoming[idx] || 0,
    Completed: daywise.completed[idx] || 0,
    Cancelled: daywise.cancelled[idx] || 0,
    Ongoing: daywise.ongoing[idx] || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 40, bottom: 20, left: 0 }}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Upcoming" stroke="#2563eb" />
        <Line type="monotone" dataKey="Completed" stroke="#22c55e" />
        <Line type="monotone" dataKey="Cancelled" stroke="#ef4444" />
        <Line type="monotone" dataKey="Ongoing" stroke="#0ea5e9" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AppointmentTrendsChart;
