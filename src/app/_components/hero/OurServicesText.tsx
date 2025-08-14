"use client";
import React from "react";
import { Cover } from "../../../components/ui/cover";
import { motion } from "motion/react";

const OurServicesText:React.FC = () => {
  return (
    <motion.h3 
      className="text-5xl font-bold" 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      Our <Cover>Services</Cover>
    </motion.h3>
  );
};

export default OurServicesText;
