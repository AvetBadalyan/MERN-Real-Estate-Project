import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  FALLBACK_AVATAR_IMAGE,
  getAvatarImageUrl,
  getLocalImageUrl,
} from "../utils/images";
import { uploadImage } from "../utils/uploadImage";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(() => () => {});
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      setFileUploadError(false);
      setFilePercentage(10);
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      setFilePercentage(100);
      toast.success("Image successfully uploaded!");
    } catch (error) {
      setFileUploadError(error.message || "Error uploading image");
      setFilePercentage(0);
      toast.error(error.message || "Error uploading image");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success("Profile updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message);
    }
  };

  const confirmAndExecute = (action) => {
    setConfirmationAction(() => action);
    setModalOpen(true);
  };

  const handleDeleteUser = async () => {
    confirmAndExecute(async () => {
      dispatch(deleteUserStart());
      try {
        const res = await fetch(`/api/user/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          toast.error(data.message);
          return;
        }
        dispatch(deleteUserSuccess(data));
        toast.success("Account deleted successfully!");
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
        toast.error(error.message);
      }
    });
  };

  const handleSignOut = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        console.error(data.message);
        return;
      }
      dispatch(signOutUserSuccess());
      toast.success("Signed out successfully!");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
      toast.error("Error loading listings");
    }
  };

  const handleListingDelete = async (listingId) => {
    confirmAndExecute(async () => {
      try {
        const res = await fetch(`/api/listing/${listingId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success === false) {
          console.error(data.message);
          return;
        }
        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
        toast.success("Listing deleted successfully!");
      } catch (error) {
        toast.error(error.message);
        console.error(error.message);
      }
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-6">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={getAvatarImageUrl(formData.avatar || currentUser.avatar)}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_AVATAR_IMAGE;
          }}
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              {fileUploadError}
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">Uploading {filePercentage}%</span>
          ) : filePercentage === 100 ? (
            <span className="text-amber-700">Image successfully uploaded!</span>
          ) : null}
        </p>
        <input
          type="text"
          placeholder="Username"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-amber-600 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-4">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer hover:underline"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer hover:underline">
          Sign out
        </span>
      </div>

      {updateSuccess && (
        <p className="text-amber-700 mt-4">Profile updated successfully</p>
      )}
      <button
        className="bg-amber-600 w-full text-white rounded-lg p-3 uppercase text-center hover:opacity-95 mt-4"
        onClick={handleShowListings}
      >
        Show Listings
      </button>
      {showListingsError && (
        <p className="text-red-700 mt-4">Error loading listings</p>
      )}

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-6 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4"
            >
              <Link to={`/listing/${listing._id}`} className="w-full sm:w-auto">
                <img
                  src={getLocalImageUrl(listing.imageUrls[0])}
                  alt="listing cover"
                  className="h-28 w-full rounded-md object-cover sm:h-16 sm:w-16 sm:object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex w-full justify-between sm:w-auto sm:flex-col sm:items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase hover:underline"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-amber-700 uppercase hover:underline">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmationAction}
        message="Are you sure you want to proceed?"
      />
    </div>
  );
}
