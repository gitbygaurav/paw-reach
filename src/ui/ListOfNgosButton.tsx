"use client";
import Link from "next/link";
import { motion } from "motion/react"
import React from "react";
import { cn } from "@/lib/utils";

interface ListOfNgosButtonProps {
  className?: string;
}

const ListOfNgosButton: React.FC<ListOfNgosButtonProps> = ({className}) => {
  return (
    <Link className="mt-4" href="/ngos" passHref>
      <motion.span
        className={cn("bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 text-lg font-semibold", className)}
        initial= {{ opacity: 0, }}
        animate= {{ opacity: 1, }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        List of NGOs
      </motion.span>
    </Link>
  );
};

export default ListOfNgosButton;
