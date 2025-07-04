"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FindNearbyButtonProps {
  className?: string;
}

const FindNearbyButton: React.FC<FindNearbyButtonProps> = ({ className }) => {
  const router = useRouter();
  return (
    <motion.button
      onClick={() => router.push("/search")}
      className={cn("bg-[#00796B] text-white px-4 py-2 rounded-lg hover:bg-[#009688] text-lg font-semibold cursor-pointer mt-4", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      Find Nearby NGOs
    </motion.button>
  );
};

export default FindNearbyButton;