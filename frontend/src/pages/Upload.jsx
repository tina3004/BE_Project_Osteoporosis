import { useState } from "react";
import { predictImage } from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [patientName, setPatientName] = useState("");
  const [files, setFiles] = useState([]);         // array of File objects
  const [previews, setPreviews] = useState([]);   // parallel array of object URLs
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const navigate = useNavigate();

  // ADD new files to the existing list (don't replace)
  const handleFileChange = (e) => {
    const newly = Array.from(e.target.files);
    if (newly.length === 0) return;

    const newPreviews = newly.map((f) => URL.createObjectURL(f));

    setFiles((prev) => [...prev, ...newly]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Reset the input so the same file can be re-selected if needed
    e.target.value = "";
  };

  // Remove a single image from the list
  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear everything
  const clearAll = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
  };

  const handleUpload = async () => {
    if (!patientName.trim()) {
      alert("Please enter a patient name.");
      return;
    }
    if (files.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    setProgress({ current: 0, total: files.length });
    const collectedResults = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // *** CRITICAL: create a brand-new FormData for EACH file ***
        const fd = new FormData();
        fd.append("image", file);
        fd.append("patient_name", patientName.trim());

        const res = await predictImage(fd, token);

        collectedResults.push({
          ...res.data,
          fileName: file.name,
          previewUrl: previews[i],
        });

        // Update progress after each image is done
        setProgress({ current: i + 1, total: files.length });
      }

      // Navigate to /results — pass all data via router state
      navigate("/results", {
        state: {
          patientName: patientName.trim(),
          results: collectedResults,
        },
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert(`Error on image ${progress.current + 1}: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const pct = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">Upload X-ray Scans</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Select one or more images to analyse</p>

          {/* Patient Name */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Patient Name *</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
            />
          </div>

          {/* Drop Zone */}
          <div className="border-2 border-dashed border-teal-300 rounded-xl p-7 mb-5 bg-teal-50 text-center hover:bg-teal-100 transition">
            <svg className="mx-auto h-10 w-10 text-teal-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-500 mb-3">Click to choose files</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                file:text-sm file:font-semibold file:bg-teal-600 file:text-white
                hover:file:bg-teal-700 cursor-pointer transition"
            />
          </div>

          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {previews.length} image{previews.length > 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-2 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="h-20 w-20 object-cover rounded-lg border-2 border-teal-200 shadow-sm"
                    />
                    <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {isLoading && progress.total > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Analysing image {progress.current} of {progress.total}…</span>
                <span>{pct}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          {/* Analyse Button */}
          <button
            onClick={handleUpload}
            disabled={isLoading || files.length === 0 || !patientName.trim()}
            className={`w-full font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-white ${
              isLoading || files.length === 0 || !patientName.trim()
                ? "bg-teal-300 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 active:scale-95"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analysing {progress.current}/{progress.total}…
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Analyse {files.length > 1 ? `${files.length} Images` : "Image"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}