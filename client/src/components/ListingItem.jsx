/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
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

  const listingImage =
    imageUrls[0] ||
    "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg";

  const price = offer ? discountPrice : regularPrice;
  const formattedPrice = price.toLocaleString("en-US");
  const rentSuffix = type === "rent" ? " / month" : "";

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${_id}`}>
        <img
          src={listingImage}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
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
