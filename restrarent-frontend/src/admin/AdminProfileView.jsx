
import { useNavigate } from "react-router-dom";
import { getAdminDetails } from "./AdminProfileForm";

export default function AdminProfileView() {
  const navigate = useNavigate();
  const details = getAdminDetails();
  const profileImage = localStorage.getItem("tastepoint_profile_image");

  const rows = [
    ["Admin Name", details.name],
    ["Email", details.email],
    ["Phone Number", details.phone],
    ["Restaurant Name", details.restaurantName],
    ["Restaurant Address", details.address],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Admin Profile</h2>
          <p className="mt-2 text-slate-500">
            View your account and restaurant details.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/profile/edit")}
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Edit Profile
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Admin profile"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-3xl">
              👤
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold">{details.name}</h3>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid gap-1 py-4 sm:grid-cols-2"
            >
              <p className="font-medium text-gray-500">{label}</p>
              <p className="break-words font-semibold text-gray-800">
                {value || "Not provided"}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/admin/profile/edit")}
          className="mt-5 rounded-xl border border-orange-200 px-5 py-3 font-semibold text-orange-600 hover:bg-orange-50"
        >
          Edit Details
        </button>
      </div>
    </div>
  );
}
