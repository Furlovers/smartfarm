import { AlertTriangle } from "lucide-react";

export default function ErrorBox({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4 mt-4">
      {message}
    </div>
  );
}