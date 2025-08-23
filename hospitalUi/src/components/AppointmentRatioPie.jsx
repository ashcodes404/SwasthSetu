import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#2563eb", "#22c55e", "#ef4444", "#0ea5e9"];

const AppointmentRatioPie = ({ daywise }) => {
  if (!daywise || !daywise.dates) return null;

  const lastIndex = daywise.dates.length - 1;

  const data = [
    { name: "Upcoming", value: daywise.upcoming[lastIndex] || 0 },
    { name: "Completed", value: daywise.completed[lastIndex] || 0 },
    { name: "Cancelled", value: daywise.cancelled[lastIndex] || 0 },
    { name: "Ongoing", value: daywise.ongoing[lastIndex] || 0 },
  ].filter(item => item.value > 0); // avoid zero slices

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AppointmentRatioPie;
