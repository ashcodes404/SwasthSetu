import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-white/80 py-12 px-6 md:px-16 rounded-[13px] shadow-lg w-[90%] md:w-[70%] mx-auto my-12">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-[#0097b2] mb-6 text-center font-georgiapro">
        About Us
      </h2>

      {/* Content */}
      <div className="space-y-6 text-[#737373] leading-relaxed text-lg">
        <p>
          Welcome to <span className="text-[#8c52ff] font-semibold">SwasthSetu</span> — your trusted digital healthcare companion.
          Our mission is to make healthcare accessible, efficient, and personalized through the power of technology.
        </p>

        <p>
          From AI-powered consultations to secure health records, SwasthSetu
          empowers individuals to manage their well-being from anywhere, at any time. 
          We bridge the gap between patients and healthcare providers by simplifying appointments, 
          follow-ups, and health monitoring.
        </p>

        <p>
          Built with innovation at its heart, SwasthSetu is designed for 
          people of all ages and backgrounds — because we believe quality healthcare should be a right, not a privilege.
        </p>
      </div>

      {/* Values Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <img src="icons8-mission.svg" alt="Mission" className="w-12 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-[#0097b2]">Our Mission</h3>
          <p className="text-sm text-[#737373]">
            To revolutionize healthcare with AI-driven solutions that are accessible to all.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <img src="icons8-vision.svg" alt="Vision" className="w-12 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-[#0097b2]">Our Vision</h3>
          <p className="text-sm text-[#737373]">
            To create a healthier world by connecting people with the right care at the right time.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <img src="icons8-values.svg" alt="Values" className="w-12 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-[#0097b2]">Our Values</h3>
          <p className="text-sm text-[#737373]">
            Compassion, innovation, and integrity guide everything we do.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;