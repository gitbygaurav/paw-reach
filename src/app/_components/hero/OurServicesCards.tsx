"use client";
import React from "react";
import { motion } from "motion/react";

const cardsData = [
  {
    title: "On Spot Care",
    src: "/homepage/spot-care.jpg",
    description:
      "Providing immediate assistance to animals in distress, Connecting you to nearby NGOs and care providers. Dedicated to ensuring timely support and rescue, Because every life deserves compassion and care",
  },
  {
    title: "NGOs Directory",
    src: "/homepage/ngo-directory.jpg",
    description:
      "Explore our extensive directory of NGOs committed to animal welfare and rescue. Find the right support near you, because every animal deserves care.",
  },
  {
    title: "Volunteer Opportunities",
    src: "https://static.jobscan.co/blog/uploads/Volunteers-working-together-1.jpg",
    description:
      "Join hands with nearby NGOs to create meaningful change. Volunteer your time to support animals in need. Be a part of a compassionate community, Making a difference, one act of kindness at a time.",
  },
  {
    title: "Donation",
    src: "/homepage/donation.png",
    description:
      "Explore our extensive directory of NGOs committed to animal welfare and rescue. Find the right support near you, because every animal deserves care.",
  },
];

const OurServicesCards: React.FC = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
      {cardsData.map((card, index) => (
        <motion.div
          key={index}
          className="group relative h-[360px] max-w-sm overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
            delay: index * 0.1, // Add 0.2s delay for each subsequent card
          }}
        >
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <img
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              src={card.src}
              alt={card.title}
            />
          </div>
          <div className="p-4">
            <h5 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-teal-600">
              {card.title}
            </h5>
            <p className="text-sm text-gray-600 line-clamp-4">
              {card.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OurServicesCards;
