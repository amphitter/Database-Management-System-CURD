"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Cropper from "react-easy-crop";

export default function EditStudent() {
  const router = useRouter();
  const { registrationNumber } = useParams(); // Extract registrationNumber from path params
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "",
    contact: "",
    qualification: "",
    registrationNumber: "",
    modeOfPayment: "",
    courseTitle: "",
    feesStatus: "Pending",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null); // Original selected file
  const [imageSrc, setImageSrc] = useState(null); // Data URL for cropping
  const [showCropModal, setShowCropModal] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  // States for react-easy-crop
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (registrationNumber) {
      const fetchStudent = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/students/registration/${registrationNumber}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const student = res.data;
          if (student) {
            setFormData({
              name: student.name || "",
              fatherName: student.fatherName || "",
              dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split("T")[0] : "",
              gender: student.gender || "",
              contact: student.contact || "",
              qualification: student.qualification || "",
              registrationNumber: student.registrationNumber || "",
              modeOfPayment: student.modeOfPayment || "",
              courseTitle: student.courseTitle || "",
              feesStatus: student.feesStatus || "Pending",
              email: student.email || "",
              address: student.address || "",
            });
          }
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch student data.");
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [registrationNumber, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // When file is selected, load it for cropping
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // When crop is complete, capture the pixel values
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Perform the crop and set the cropped image blob
  const handleCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedBlob);
      setShowCropModal(false);
    } catch (err) {
      console.error("Crop failed:", err);
    }
  };

  // Submit form data along with cropped image (if available)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (croppedImage) {
        // Convert blob to file
        const file = new File([croppedImage], "croppedImage.jpg", { type: "image/jpeg" });
        data.append("image", file);
      } else if (image) {
        data.append("image", image);
      }
      await axios.put(
        `http://localhost:5000/api/students/registration/${registrationNumber}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/students");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating student. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-grow">
        <h1 className="text-3xl font-semibold mb-6">Edit Student</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Father's Name:</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Contact:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Qualification:</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Registration Number:</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold">Mode of Payment:</label>
            <input
              type="text"
              name="modeOfPayment"
              value={formData.modeOfPayment}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Course Title:</label>
            <input
              type="text"
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Fee Status:</label>
            <select
              name="feesStatus"
              value={formData.feesStatus}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Upload New Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Student
          </button>
        </form>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded">
            <div className="relative w-80 h-80">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowCropModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to load an image from a URL
function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

// Crop the image based on the selected pixel area
async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Canvas is empty");
        return reject(new Error("Canvas is empty"));
      }
      resolve(blob);
    }, "image/jpeg");
  });
}
