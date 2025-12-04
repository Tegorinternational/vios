import React, { useState, useEffect } from "react";
import axios from "axios";

export default function VideoManager() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [videos, setVideos] = useState([]);

  // Auto Dynamic Backend URL
  const backend = `http://${window.location.hostname}:5000`;

  // Load all videos
  const loadVideos = async () => {
    try {
      const res = await axios.get(`${backend}/api/videos/all`);
      setVideos(res.data);
    } catch (err) {
      console.log("Load Error", err);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  // Upload function
  const handleUpload = async () => {
    if (!file) return setMsg("Select a video");

    const formData = new FormData();
    formData.append("video", file);

    try {
      await axios.post(`${backend}/api/videos/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("Uploaded successfully!");
      loadVideos(); // Reload list
    } catch (err) {
      console.log(err);
      setMsg("Upload Failed!");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Video Manager</h1>

      {/* Upload Box */}
      <div className="p-4 border rounded-lg mb-6">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
        {msg && <p className="mt-2 font-semibold">{msg}</p>}
      </div>

      {/* Video List */}
      <h2 className="text-xl font-semibold mb-3">Uploaded Videos</h2>

      <div className="grid grid-cols-1 gap-4">
        {videos.map((v, i) => (
          <div key={i} className="border p-3 rounded-lg flex items-center gap-4">
            <img
              src={`${backend}/${v.thumbnail}`}
              className="w-32 h-20 object-cover rounded"
            />

            <div>
              <p className="font-semibold">{v.filename}</p>
              <video
                src={`${backend}/${v.video}`}
                controls
                className="w-64 rounded mt-2"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}