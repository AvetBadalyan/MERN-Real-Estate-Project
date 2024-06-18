import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const getParams = useCallback(
    (params) => {
      const urlParams = new URLSearchParams(location.search);
      const result = {};
      params.forEach((param) => {
        const value = urlParams.get(param);
        if (value !== null) result[param] = value;
      });
      return result;
    },
    [location.search]
  );

  useEffect(() => {
    const params = getParams([
      "searchTerm",
      "type",
      "parking",
      "furnished",
      "offer",
      "sort",
      "order",
    ]);

    setSidebardata({
      searchTerm: params.searchTerm || "",
      type: params.type || "all",
      parking: params.parking === "true",
      furnished: params.furnished === "true",
      offer: params.offer === "true",
      sort: params.sort || "createdAt",
      order: params.order || "desc",
    });

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      try {
        const searchQuery = new URLSearchParams(params).toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length === 0) {
          toast.info("No listings found!");
        }
        setShowMore(data.length > 8);
        setListings(data);
      } catch (error) {
        toast.error("Failed to fetch listings.");
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search, getParams]);

  const handleChange = useCallback((e) => {
    const { id, value, checked, type, name } = e.target;

    setSidebardata((prevData) => {
      if (type === "radio") {
        return { ...prevData, [name]: id };
      }
      if (type === "checkbox") {
        return { ...prevData, [id]: checked };
      }
      if (id === "sort_order") {
        const [sort, order] = value.split("_");
        return {
          ...prevData,
          sort: sort || "createdAt",
          order: order || "desc",
        };
      }
      return { ...prevData, [id]: value };
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.keys(sidebardata).forEach((key) => {
      urlParams.set(key, sidebardata[key]);
    });
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);

    try {
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();
      setShowMore(data.length >= 9);
      setListings((prevListings) => [...prevListings, ...data]);
    } catch (error) {
      toast.error("Failed to fetch more listings.");
      console.error("Failed to fetch more listings:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="radio"
                name="type"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="type"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="type"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listings found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="w-full p-2 bg-gray-200 hover:bg-gray-300 transition-all ease-in-out"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
