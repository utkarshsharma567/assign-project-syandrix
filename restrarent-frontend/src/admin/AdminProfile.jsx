import { useState } from "react";
import { useNavigate } from "react-router-dom";
const CLOUD_NAME = "bpcumddi";
const UPLOAD_PRESET = "ml_default";

const AdminProfile = () => {
  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem("tastepoint_profile_image") || null,
  );

  

  const [isOpen, setIsOpen] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingQR, setUploadingQR] = useState(false);
  const navigate = useNavigate();

  // Common Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    return data.secure_url;
  };

  // Profile photo upload
  const handleImageUpload = async (e) => {
    const input = e.target;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      input.value = "";
      return;
    }

    setUploadingProfile(true);

    try {
      const imageUrl = await uploadToCloudinary(file);

      setProfileImage(imageUrl);
      localStorage.setItem("tastepoint_profile_image", imageUrl);

      alert("Profile photo uploaded successfully!");
    } catch (error) {
      console.error("Profile upload error:", error);
      alert(error.message || "Profile photo upload nahi hui.");
    } finally {
      setUploadingProfile(false);
      input.value = "";
    }
  };

  
const handleQRUpload = async (e) => {
  const input = e.target;
  const file = input.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid QR image.");
    input.value = "";
    return;
  }

  setUploadingQR(true);

  try {
    const qrUrl = await uploadToCloudinary(file);

    // Save QR URL for the customer checkout page
    localStorage.setItem("tastepoint_payment_qr", qrUrl);

    // Notify other components in the same browser tab
    window.dispatchEvent(new Event("tastepoint-qr-updated"));

    alert("Payment QR uploaded successfully!");
  } catch (error) {
    console.error("QR upload error:", error);
    alert(error.message || "Payment QR upload failed.");
  } finally {
    setUploadingQR(false);
    input.value = "";
  }
};


  return (
    <div className="relative inline-block">
      {/* Admin Profile Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 transition hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="Admin"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGc3KWtOh6O3lBNrdo-HUvJv4ph-YJ5DPk4z41GElQxXnxzqoxNbD-ypk&s=10"
            alt="Default Profile"
            className="h-8 w-8 shrink-0 rounded-full bg-orange-200 object-cover"
          />
        )}

        <span className="font-medium text-orange-800">
          Admin <span aria-hidden="true"></span>
        </span>
      </button>

      {/* Admin Dropdown */}
      {isOpen && (
        <>
          {/* Click outside to close */}
          <button
            type="button"
            aria-label="Close admin menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full z-50 mt-2 max-h-[75vh] w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-gray-100 bg-white p-3 shadow-xl">
            <div className="mb-2 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="text-xl">🏪</span>
              <span className="font-bold text-gray-800">TastePoint</span>
            </div>

       {/* edit or view admin profile */}
<div className="grid grid-cols-2 gap-2 border-b border-gray-100 pb-3">
  <button
    type="button"
    onClick={() => {
      setIsOpen(false);
      navigate("/admin/profile");
    }}
    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-orange-50"
  >
    View Profile
  </button>

  <button
    type="button"
    onClick={() => {
      setIsOpen(false);
      navigate("/admin/profile/edit");
    }}
    className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
  >
    Edit Profile
  </button>
</div>




            
            {/* Profile Photo Upload */}
            <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 text-sm text-gray-700 transition hover:bg-orange-50">
              <span className="text-lg">📷</span>

              <span className="flex-1">
                <span className="block font-medium">Change Profile Pic</span>
                <span className="mt-1 block text-xs text-gray-500">
                  {uploadingProfile
                    ? "Uploading photo..."
                    : "Choose from gallery"}
                </span>
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingProfile}
                className="hidden"
              />
            </label>

            <div className="my-1 border-t border-gray-100" />

            {/* Payment QR Upload */}
           
{/* Payment QR Upload - Admin only uploads, no preview */}
<label
  className={`flex items-center gap-3 rounded-lg px-2 py-3 text-sm text-gray-700 transition hover:bg-orange-50 ${
    uploadingQR ? "cursor-wait opacity-60" : "cursor-pointer"
  }`}
>
  <span className="text-lg">📱</span>

  <span className="flex-1">
    <span className="block font-medium">Upload Payment QR</span>

    <span className="mt-1 block text-xs text-gray-500">
      {uploadingQR
        ? "Uploading QR..."
        : localStorage.getItem("tastepoint_payment_qr")
          ? "QR saved · Choose to replace"
          : "Choose QR from gallery"}
    </span>
  </span>

  <input
    type="file"
    accept="image/*"
    onChange={handleQRUpload}
    disabled={uploadingQR}
    className="hidden"
  />
</label>

          </div>
        </>
      )}
    </div>
  );
};

export default AdminProfile;
