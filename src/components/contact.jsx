import React, { useState } from "react";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/feedback", formData);
      alert(res.data.message || "Feedback sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Error sending feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-16 px-6 md:px-16"
      style={{
        background: "linear-gradient(90deg, #3c67bf, #c0e8ff)"
      }}
    >
      <div className="bg-white/85 py-12 px-6 md:px-16 rounded-[13px] shadow-lg w-[90%] md:w-[70%] mx-auto">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-[#0097b2] mb-4 text-center font-georgiapro">
          Contact Us
        </h2>
        <p className="text-center text-[#737373] mb-8 max-w-2xl mx-auto">
          Have questions, suggestions, or need assistance? We’d love to hear from you.
          Fill out the form below or reach us directly.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0097b2]"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0097b2]"
            required
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0097b2] md:col-span-2"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0097b2] md:col-span-2"
            required
          ></textarea>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#8c52ff] hover:bg-[#6b3cd4] text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        {/* Contact Details */}
        <div className="mt-10 text-center text-[#737373]">
          <p>Email: <a href="mailto:support@swasthsetu.com" className="text-[#0097b2] hover:underline">support@swasthsetu.com</a></p>
          <p>Phone: <a href="tel:+911234567890" className="text-[#0097b2] hover:underline">+91 12345 67890</a></p>
          <p>Address: SwasthSetu HQ, Kurukshetra , Haryana , India</p>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;