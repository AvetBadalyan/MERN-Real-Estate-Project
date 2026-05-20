/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLocalImageUrl } from "../utils/images";
import {
  FaArrowRight,
  FaHome,
  FaKey,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";

SwiperCore.use([Navigation]);

const heroImage = "/images/1717701464707_luxury-residential-real-estate.png";

const quickLinks = [
  { label: "Buy", to: "/search?type=sale", icon: FaHome },
  { label: "Rent", to: "/search?type=rent", icon: FaKey },
  { label: "Explore all", to: "/search", icon: FaSearch },
];

const featureCards = [
  {
    title: "Curated local listings",
    text: "Browse homes with clear photos, pricing, amenities, and location details in one place.",
  },
  {
    title: "Fast search filters",
    text: "Narrow your options by rent, sale, parking, furnished homes, offers, and price sorting.",
  },
  {
    title: "Direct seller contact",
    text: "Open a listing, review the details, and contact the owner when a property feels right.",
  },
];

function ListingSection({ title, subtitle, linkText, linkTo, listings }) {
  if (listings.length === 0) return null;

  return (
    <section className="animate-rise space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            {subtitle}
          </p>
          <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">
            {title}
          </h2>
        </div>
        <Link
          className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-amber-700"
          to={linkTo}
        >
          {linkText}
          <FaArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingItem className="w-full" listing={listing} key={listing._id} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [listings, setListings] = useState({
    offer: [],
    rent: [],
    sale: [],
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch("/api/listing?offer=true&limit=4"),
          fetch("/api/listing?type=rent&limit=4"),
          fetch("/api/listing?type=sale&limit=4"),
        ]);

        const [offerData, rentData, saleData] = await Promise.all([
          offerRes.json(),
          rentRes.json(),
          saleRes.json(),
        ]);

        setListings({
          offer: offerData,
          rent: rentData,
          sale: saleData,
        });
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        toast.error("Failed to fetch listings.");
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="overflow-hidden bg-slate-50 text-slate-800">
      <section
        className="relative min-h-[540px] bg-cover bg-center px-4 py-10 sm:px-6 lg:min-h-[600px] lg:py-16"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div className="absolute inset-0 bg-slate-950/45"></div>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 text-white">
          <div className="animate-rise max-w-3xl pt-6 sm:pt-10">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              <FaMapMarkerAlt /> Homes, rentals, and investment properties
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              Find a home that fits the way you live.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">
              Explore curated properties, compare key details quickly, and move
              from browsing to contacting the seller with less friction.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Browse properties
                <FaArrowRight />
              </Link>
            </div>
          </div>

          <div className="animate-rise grid max-w-3xl gap-3 sm:grid-cols-3">
            {quickLinks.map(({ label, to, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="group flex items-center justify-between rounded-md bg-white/90 px-4 py-4 text-slate-800 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:bg-white"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <span className="rounded-md bg-amber-600 p-2 text-white">
                    <Icon />
                  </span>
                  {label}
                </span>
                <FaArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-amber-700" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 py-8 sm:grid-cols-3">
          <div className="animate-rise rounded-md border border-slate-200 p-4 sm:p-5">
            <p className="text-3xl font-bold text-slate-900">
              {listings.rent.length + listings.sale.length + listings.offer.length}+
            </p>
            <p className="mt-1 text-sm text-slate-500">fresh listings previewed</p>
          </div>
          <div className="animate-rise rounded-md border border-slate-200 p-4 sm:p-5 [animation-delay:90ms]">
            <p className="text-3xl font-bold text-slate-900">6</p>
            <p className="mt-1 text-sm text-slate-500">photos supported per listing</p>
          </div>
          <div className="animate-rise rounded-md border border-slate-200 p-4 sm:p-5 [animation-delay:180ms]">
            <p className="text-3xl font-bold text-slate-900">2</p>
            <p className="mt-1 text-sm text-slate-500">clear paths: buy or rent</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="animate-rise rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <h2 className="text-xl font-semibold text-slate-800">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {listings.offer.length > 0 && (
        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Featured
                </p>
                <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">
                  Homes with active offers
                </h2>
              </div>
              <Link
                to="/search?offer=true"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-amber-700"
              >
                See all offers
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="overflow-hidden rounded-md shadow-xl">
              <Swiper navigation>
                {listings.offer.map((listing) => (
                  <SwiperSlide key={listing._id}>
                    <Link to={`/listing/${listing._id}`} className="block">
                      <div
                        style={{
                          backgroundImage: `url('${getLocalImageUrl(
                            listing.imageUrls[0]
                          )}')`,
                        }}
                        className="relative h-[360px] bg-cover bg-center sm:h-[460px]"
                      >
                        <div className="absolute inset-0 bg-slate-950/35"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-6">
                          <p className="mb-2 inline-flex rounded-md bg-amber-600 px-3 py-1 text-sm font-semibold">
                            ${listing.discountPrice.toLocaleString("en-US")}
                          </p>
                          <h3 className="max-w-2xl text-2xl font-semibold sm:text-4xl">
                            {listing.name}
                          </h3>
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-100">
                            <FaMapMarkerAlt /> {listing.address}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      <div className="px-4 pb-16 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-14">
          <ListingSection
            title="Recent places for rent"
            subtitle="Move-in ready"
            linkText="Show more rentals"
            linkTo="/search?type=rent"
            listings={listings.rent}
          />
          <ListingSection
            title="Recent places for sale"
            subtitle="For your next chapter"
            linkText="Show more homes"
            linkTo="/search?type=sale"
            listings={listings.sale}
          />
          <ListingSection
            title="Recent offers"
            subtitle="Better value"
            linkText="Show more offers"
            linkTo="/search?offer=true"
            listings={listings.offer}
          />
        </div>
      </div>
    </div>
  );
}
