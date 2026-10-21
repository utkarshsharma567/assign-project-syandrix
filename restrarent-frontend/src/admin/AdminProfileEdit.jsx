
import { useNavigate } from "react-router-dom";
import AdminProfileForm, {
  getAdminDetails,
} from "./AdminProfileForm";

export default function AdminProfileEdit() {
  const navigate = useNavigate();

  const handleSave = (form) => {
    localStorage.setItem(
      "tastepoint_admin_details",
      JSON.stringify(form)
    );

    alert("Admin profile updated successfully!");
    navigate("/admin/profile");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <button
          onClick={() => navigate("/admin/profile")}
          className="mb-3 text-sm font-semibold text-orange-600 hover:underline"
        >
          ← Back to Profile
        </button>

        <h2 className="text-3xl font-bold">Edit Admin Profile</h2>
        <p className="mt-2 text-slate-500">
          Update your admin and restaurant information.
        </p>
      </div>

      <AdminProfileForm
        initialData={getAdminDetails()}
        onSave={handleSave}
        onCancel={() => navigate("/admin/profile")}
      />
    </div>
  );
}
