// src/pages/Student/Profile.jsx
import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from "lucide-react";
import { fetchStudentProfile, updateStudentProfile, selectClass } from "../../api/studentApi";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Load profile
      const profileRes = await fetchStudentProfile();
      const profileData = profileRes.data;
      setProfile(profileData);
      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        dob: profileData.dob || "",
      });

      // Load class details
      const classRes = await selectClass();
      setClassDetails(classRes.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudentProfile(formData);
      setProfile({ ...profile, ...formData });
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={64} className="text-blue-600" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
              <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full inline-block">
                Student
              </div>

              {/* Class Information from student API */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium">
                    {classDetails?.name || profile?.class_name || "Not Assigned"}
                  </span>
                </div>
                {classDetails?.teacher_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Teacher:</span>
                    <span className="font-medium">{classDetails.teacher_name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Roll Number:</span>
                  <span className="font-medium">{profile?.roll_number || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Join Date:</span>
                  <span className="font-medium">
                    {profile?.join_date ? new Date(profile.join_date).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Learning Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Subjects Enrolled</span>
                  <span className="font-medium">{profile?.subjects_count || 0}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${((profile?.completed_subjects || 0) / (profile?.subjects_count || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-medium">{profile?.overall_progress || 0}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${profile?.overall_progress || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Attendance</span>
                  <span className="font-medium">{profile?.attendance_percentage || 0}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-orange-500 rounded-full" 
                    style={{ width: `${profile?.attendance_percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form - Remains the same */}
        {/* ... rest of the Profile.jsx code remains unchanged ... */}
      </div>
    </div>
  );
};

export default StudentProfile;