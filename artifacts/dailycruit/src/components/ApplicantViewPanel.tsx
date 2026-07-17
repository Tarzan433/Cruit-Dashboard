import { X, MapPin, Mail, Phone } from "lucide-react";
import type { ProfileData } from "../services/profile";

type ApplicantViewPanelProps = {
  open: boolean;
  onClose: () => void;
  applicant: ProfileData | null;
};

export function ApplicantViewPanel({
  open,
  onClose,
  applicant,
}: ApplicantViewPanelProps) {
  if (!open || !applicant) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
          <h2 className="text-xl font-semibold">Applicant Profile</h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="p-6">

          {/* Profile */}
          <div className="flex items-center gap-4">

            {applicant.photoURL ? (
              <img
                src={applicant.photoURL}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-3xl font-bold text-white">
                {applicant.fullName?.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h3 className="text-2xl font-bold">
                {applicant.fullName}
              </h3>

              <p className="text-gray-500">
                @{applicant.username}
              </p>

              <p className="mt-1 text-green-600">
                {applicant.headline}
              </p>
            </div>
          </div>

          {/* Contact */}

          <div className="mt-6 space-y-2">

            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {applicant.location || "Not provided"}
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} />
              {applicant.email || "Not provided"}
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} />
              {applicant.phoneNumber || "Not provided"}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}