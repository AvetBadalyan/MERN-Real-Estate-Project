/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Contact({ listing }) {
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const fetchSeller = useCallback(async () => {
    try {
      const res = await fetch(`/api/user/${listing.userRef}`);
      const data = await res.json();
      setSeller(data);
    } catch (error) {
      console.error("Error fetching seller:", error);
      toast.error("Error fetching seller information. Please try again later.");
    }
  }, [listing.userRef]);

  useEffect(() => {
    fetchSeller();
  }, [fetchSeller]);

  if (!seller) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p>
        Contact <span className="font-semibold">{seller.username}</span> for{" "}
        <span className="font-semibold">{listing.name.toLowerCase()}</span>
      </p>
      <textarea
        name="message"
        id="message"
        rows="2"
        value={message}
        onChange={onChange}
        placeholder="Enter your message here..."
        className="w-full border p-3 rounded-lg"
      ></textarea>
      <Link
        to={`mailto:${seller.email}?subject=Regarding ${listing.name}&body=${message}`}
        className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
      >
        Send Message
      </Link>
    </div>
  );
}
