// src/pages/Teacher/Profile.jsx
import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Book, GraduationCap, Edit, Save, X } from "lucide-react";
import { fetchTeacherProfile, updateTeacherProfile } from "../../api/teacherApi";

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    qualification: "",
    specialization: "",
    experience: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetchTeacherProfile();
      const data = response.data;
      setProfile(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        qualification: data.qualification || "",
        specialization: data.specialization || "",
        experience: data.experience || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTeacherProfile(formData);
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
        <h1 className="text-3xl font-bold text-gray-900">Teacher Profile</h1>
        <p className="text-gray-600">Manage your professional information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="w-32 h-32 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={64} className="text-purple-600" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
              <div className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full inline-block">
                Teacher
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Teacher ID:</span>
                  <span className="font-medium">{profile?.teacher_id || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Join Date:</span>
                  <span className="font-medium">
                    {profile?.join_date ? new Date(profile.join_date).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Classes:</span>
                  <span className="font-medium">{profile?.class_count || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Teaching Stats */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Teaching Statistics</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-medium">{profile?.total_students || 0}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Subjects Taught</span>
                  <span className="font-medium">{profile?.subjects_count || 0}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Teaching Experience</span>
                  <span className="font-medium">{profile?.experience || "0"} years</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <Edit size={18} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                        address: profile.address,
                        qualification: profile.qualification,
                        specialization: profile.specialization,
                        experience: profile.experience,
                      });
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 px-3 py-1 border rounded-lg"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="mr-2" />
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  ) : (
                    <p className="px-4 py-2 border border-transparent rounded-lg">{profile?.name}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="mr-2" />
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  ) : (
                    <p className="px-4 py-2 border border-transparent rounded-lg">{profile?.email}</p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="mr-2" />
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="px-4 py-2 border border-transparent rounded-lg">
                      {profile?.phone || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="mr-2" />
                    Date of Birth
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="px-4 py-2 border border-transparent rounded-lg">
                      {profile?.dob ? new Date(profile.dob).toLocaleDateString() : "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {/* Professional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap size={16} className="mr-2" />
                    Qualification
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="px-4 py-2 border border-transparent rounded-lg">
                      {profile?.qualification || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Book size={16} className="mr-2" />
                    Specialization
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="px-4 py-2 border border-transparent rounded-lg">
                      {profile?.specialization || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Experience (Years)
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="px-4 py-2 border border-transparent rounded-lg">
                      {profile?.experience || "0"} years
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="mr-2" />
                  Address
                </label>
                {editing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="px-4 py-2 border border-transparent rounded-lg whitespace-pre-line">
                    {profile?.address || "Not provided"}
                  </p>
                )}
              </div>
            </form>

            {/* Teaching Subjects */}
            <div className="mt-8 pt-8 border-t">
              <h4 className="font-semibold text-gray-800 mb-4">Teaching Subjects</h4>
              <div className="flex flex-wrap gap-2">
                {profile?.subjects?.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {subject}
                  </span>
                ))}
                {(!profile?.subjects || profile.subjects.length === 0) && (
                  <p className="text-gray-500">No subjects assigned</p>
                )}
              </div>
            </div>

            {/* Change Password */}
            <div className="mt-8 pt-8 border-t">
              <h4 className="font-semibold text-gray-800 mb-4">Account Security</h4>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;