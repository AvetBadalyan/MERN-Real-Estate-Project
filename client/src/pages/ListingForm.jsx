/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ListingForm({ mode }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "update") {
      const fetchListing = async () => {
        try {
          const res = await fetch(`/api/listing/get/${params.listingId}`);
          const data = await res.json();
          if (data.success === false) {
            toast.error(data.message);
            return;
          }
          setFormData(data);
        } catch (err) {
          toast.error("An error occurred while fetching the listing data");
          console.error(err);
        }
      };
      fetchListing();
    }
  }, [mode, params.listingId]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = Array.from(files).map((file) => storeImage(file));

      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.concat(urls),
          }));
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setImageUploadError("Image upload failed (2 mb max per image)");
          toast.error("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      toast.error("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    if (type === "radio" && checked) {
      setFormData((prev) => ({
        ...prev,
        type: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) {
      toast.error("You must upload at least one image");
      return setError("You must upload at least one image");
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      toast.error("Discount price must be lower than regular price");
      return setError("Discount price must be lower than regular price");
    }
    setLoading(true);
    setError(false);
    try {
      const endpoint =
        mode === "create"
          ? "/api/listing/create"
          : `/api/listing/update/${params.listingId}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        toast.error(data.message);
        setError(data.message);
        return;
      }
      toast.success("Listing successfully submitted!");
      navigate(`/listing/${data._id}`);
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        {mode === "create" ? "Create" : "Update"} a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                name="listingType"
                className="w-5"
                value="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                value="sale"
                name="listingType"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <label htmlFor="sale">Sale</label>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="bedrooms" className="text-lg">
                Bedrooms
              </label>
              <input
                type="number"
                className="border p-3 rounded-lg"
                id="bedrooms"
                onChange={handleChange}
                value={formData.bedrooms}
                min="1"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="bathrooms" className="text-lg">
                Bathrooms
              </label>
              <input
                type="number"
                className="border p-3 rounded-lg"
                id="bathrooms"
                onChange={handleChange}
                value={formData.bathrooms}
                min="1"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="regularPrice" className="text-lg">
                Regular Price in $
              </label>
              <input
                type="number"
                className="border p-3 rounded-lg"
                id="regularPrice"
                onChange={handleChange}
                value={formData.regularPrice}
                min="50"
                required
              />
              {formData.type === "rent" && (
                <span className="text-gray-500">$ / month</span>
              )}
            </div>
            {formData.offer && (
              <div className="flex flex-col gap-2">
                <label htmlFor="discountPrice" className="text-lg">
                  Discount Price in $
                </label>
                <input
                  type="number"
                  className="border p-3 rounded-lg"
                  id="discountPrice"
                  onChange={handleChange}
                  value={formData.discountPrice}
                  min="0"
                  required={formData.offer}
                />
                {formData.type === "rent" && (
                  <span className="text-gray-500">$ / month</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div className="relative border p-3 rounded-lg h-80 overflow-y-auto">
            <div className="grid grid-cols-3 gap-3">
              {formData.imageUrls.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white w-8"
                    onClick={() => handleRemoveImage(i)}
                  >
                    &times;
                  </button>
                </div>
              ))}
              {formData.imageUrls.length < 6 && (
                <div>
                  <input
                    type="file"
                    className="border p-3 rounded-lg"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                  />
                  <button
                    type="button"
                    className="p-3 mt-2 bg-blue-700 text-white rounded-lg uppercase hover:opacity-95"
                    onClick={handleImageSubmit}
                  >
                    {uploading ? "Uploading..." : "Upload Images"}
                  </button>
                </div>
              )}
            </div>
            {imageUploadError && (
              <div className="text-red-500 mt-2">{imageUploadError}</div>
            )}
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : mode === "create"
              ? "Create Listing"
              : "Update Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}
