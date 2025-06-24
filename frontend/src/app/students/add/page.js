"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import Cropper from "react-easy-crop";
import { FiX } from "react-icons/fi";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "",
    contact: "",
    qualification: "",
    email: "",
    address: "",
    registrationNumber: "",
    modeOfPayment: "",
    courseTitle: "",
    fees: 0, // Auto-filled when course is selected
    feesStatus: "Pending",
  });
  const [courses, setCourses] = useState([]);
  const [imageSrc, setImageSrc] = useState(null); // Holds the original image URL for cropping
  const [croppedImage, setCroppedImage] = useState(null); // Holds the final cropped image blob
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch available courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    if (token) fetchCourses();
  }, [token]);

  // Update form data on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto-fill fees when course is selected
    if (name === "courseTitle") {
      const selectedCourse = courses.find((course) => course.title === value);
      setFormData({
        ...formData,
        [name]: value,
        fees: selectedCourse ? selectedCourse.fees : 0,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle file selection and open crop modal
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Capture cropping details
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Perform cropping and save the cropped image blob
  const handleCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedBlob);
      setShowCropModal(false);
    } catch (error) {
      console.error("Crop failed:", error);
    }
  };

  // Submit the form with cropped image (if available)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Session expired, please log in again.");
      router.push("/login");
      return;
    }
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (croppedImage) {
      // Convert blob to a file
      data.append("image", croppedImage, "croppedImage.jpg");
    }
    try {
      await axios.post("http://localhost:5000/api/students", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Student added successfully!");
      router.push("/students");
    } catch (error) {
      console.error("Error adding student:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-grow">
        <h1 className="text-3xl mb-4">Add Student</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          {/* Father's Name */}
          <div>
            <label>Father's Name:</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          {/* Date of Birth */}
          <div>
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          {/* Gender */}
          <div>
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Contact */}
          <div>
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          {/* Qualification */}
          <div>
            <label>Qualification:</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          {/* Email */}
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          {/* Address */}
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          {/* Registration Number */}
          <div>
            <label>Registration Number:</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          {/* Mode of Payment */}
          <div>
            <label>Mode of Payment:</label>
            <input
              type="text"
              name="modeOfPayment"
              value={formData.modeOfPayment}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          {/* Course Title */}
          <div>
            <label>Course Title:</label>
            <select
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course.title}>
                  {course.title} (₹{course.fees})
                </option>
              ))}
            </select>
          </div>
          {/* Course Fees (Auto-filled) */}
          <div>
            <label>Course Fees:</label>
            <input
              type="number"
              name="fees"
              value={formData.fees}
              readOnly
              className="border p-2 w-full bg-gray-100"
            />
          </div>
          {/* Fee Status */}
          <div>
            <label>Fee Status:</label>
            <select
              name="feesStatus"
              value={formData.feesStatus}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          {/* Image Upload */}
          <div>
            <label>Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2 w-full"
            />
            {croppedImage && (
              <img
                src={URL.createObjectURL(croppedImage)}
                alt="Cropped Preview"
                className="mt-4 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
          {/* Submit Button */}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Student
          </button>
        </form>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 relative">
            <button className="absolute top-2 right-2" onClick={() => setShowCropModal(false)}>
              <FiX />
            </button>
            <div className="w-96 h-96 relative">
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
            <div className="mt-4 flex justify-end">
              <button onClick={handleCrop} className="bg-blue-500 text-white px-4 py-2 rounded">
                Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility function to crop the image using canvas
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
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/jpeg");
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}
