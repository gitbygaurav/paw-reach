import React from "react";
import ReportButton from "./ReportButton";
import { GoStar, GoStarFill } from "react-icons/go";

interface NGOCardProps {
  name: string;
  address: string;
  services: string;
  contact: string;
  rating: number;
  id: string;
}

const NgoCard: React.FC<NGOCardProps> = ({
  name,
  address,
  services,
  contact,
  rating,
  id
}) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <div key={i} className="transform transition-transform hover:scale-110">
          {i < rating ? (
            <GoStarFill className="text-yellow-400 hover:text-yellow-300" />
          ) : (
            <GoStar className="text-gray-300 hover:text-gray-400" />
          )}
        </div>
      );
    }
    return stars;
  };

  return (
    <div className="group relative bg-white p-5 rounded-xl shadow-md min-h-[320px]
      hover:shadow-xl transition-all duration-300 ease-in-out
      hover:-translate-y-1 hover:bg-gradient-to-b from-white to-gray-50
      before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r
      before:from-green-400/20 before:to-blue-400/20 before:opacity-0
      before:transition-opacity hover:before:opacity-100 overflow-hidden">
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="font-bold text-xl group-hover:text-green-700 transition-colors">
            {name}
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
              {address}
            </p>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
              Services Offered: <span className="font-medium">{services}</span>
            </p>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
              Contact: <span className="font-medium">{contact}</span>
            </p>
            <div className="flex items-center gap-1 py-1">
              <p className="text-gray-600 group-hover:text-gray-700">Rating: </p>
              <div className="flex gap-1">{renderStars()}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 transform transition-transform">
          <ReportButton id={id} />
        </div>
      </div>
    </div>
  );
};

export default NgoCard;
