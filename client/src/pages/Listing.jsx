import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLocalImageUrl } from "../utils/images";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/${params.listingId}`);
        if (!res.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch listing.");
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (loading) {
    return <p className="text-center my-6 text-2xl">Loading...</p>;
  }

  if (error) {
    return <p className="text-center my-6 text-2xl">Something went wrong!</p>;
  }

  return (
    <main>
      {listing && (
        <div>
          <Swiper modules={[Navigation]} slidesPerView={1} navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[280px] w-full bg-cover bg-center sm:h-[420px] lg:h-[550px]"
                  style={{
                    backgroundImage: `url('${getLocalImageUrl(url)}')`,
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-24 right-4 z-10 border rounded-full w-11 h-11 sm:w-12 sm:h-12 flex justify-center items-center bg-slate-100 cursor-pointer transition hover:bg-amber-100">
            <FaShare className="text-slate-500" onClick={handleShareClick} />
          </div>
          {copied && (
            <p className="fixed top-40 right-4 z-10 rounded-md bg-slate-100 p-2 shadow-md">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto px-4 py-6 sm:px-6 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - $
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-amber-600" />
              {listing.address}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <p className="bg-slate-800 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-amber-600 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-amber-800 font-semibold text-sm flex flex-wrap items-center gap-4">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact seller
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
