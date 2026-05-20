/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { getLocalImageUrl } from "../utils/images";

export default function ListingItem({ listing, className = "w-full sm:w-[330px]" }) {
  const {
    _id,
    imageUrls,
    name,
    address,
    description,
    offer,
    discountPrice,
    regularPrice,
    type,
    bedrooms,
    bathrooms,
  } = listing;

  const listingImage = getLocalImageUrl(imageUrls[0]);

  const price = offer ? discountPrice : regularPrice;
  const formattedPrice = price.toLocaleString("en-US");
  const rentSuffix = type === "rent" ? " / month" : "";

  return (
    <div
      className={`overflow-hidden rounded-md bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      <Link to={`/listing/${_id}`}>
        <img
          src={listingImage}
          alt="listing cover"
          className="h-[320px] w-full object-cover transition duration-300 hover:scale-105 sm:h-[220px]"
        />
        <div className="p-4 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-amber-600" />
            <p className="text-sm text-gray-600 truncate w-full">{address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          <p className="text-slate-500 mt-2 font-semibold">
            ${formattedPrice}
            {rentSuffix}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {bedrooms} {bedrooms > 1 ? "beds" : "bed"}
            </div>
            <div className="font-bold text-xs">
              {bathrooms} {bathrooms > 1 ? "baths" : "bath"}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
