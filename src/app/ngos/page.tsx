'use client';
import NgoCard from "@/ui/NgoCard";
import { useEffect, useState } from "react";
import api from "../utils/api";

const Page: React.FC = () => {
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNgos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch NGOs");
        }
        const data = await response.json();
        // console.log(data);
        setNgos(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  });
  return (
    <div className="pt-32 px-4">
      <h3 className="text-5xl text-black text-center font-extrabold">
        NGOs List
      </h3>
      <p className="text-lg text-center font-semibold mt-2">
        <span className="text-green-900">{ngos.length}</span> ngos are with us
        and many more are joining.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {ngos.map((ngo) => (
          <NgoCard
            key={ngo._id}
            id={ngo._id}
            name={ngo.name}
            services={ngo.services}
            contact={ngo.contact}
            rating={ngo.ratings}
            address={ngo.address}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
