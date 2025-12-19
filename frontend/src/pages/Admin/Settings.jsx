// src/pages/Admin/Settings.jsx
import React, { useState } from "react";
import {
  Save,
  Bell,
  Shield,
  Globe,
  Database,
  Mail,
  Users,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Rural LMS",
    siteDescription: "Rural Learning Management System",
    contactEmail: "admin@rurallms.com",
    contactPhone: "+91 98765 43210",
    maintenanceMode: false,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "noreply@rurallms.com",
    fromName: "Rural LMS",
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    enable2FA: false,
  });

  const tabs = [
    { id: "general", label: "General", icon: <Globe size={18} /> },
    { id: "email", label: "Email", icon: <Mail size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "database", label: "Database", icon: <Database size={18} /> },
    { id: "users", label: "User Management", icon: <Users size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        siteName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        contactEmail: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={generalSettings.siteDescription}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        siteDescription: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={generalSettings.contactPhone}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        contactPhone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="maintenance"
                  checked={generalSettings.maintenanceMode}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      maintenanceMode: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="maintenance" className="ml-2 text-sm text-gray-700">
                  Enable Maintenance Mode
                </label>
              </div>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={emailSettings.smtpHost}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpHost: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Port
                </label>
                <input
                  type="text"
                  value={emailSettings.smtpPort}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpPort: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={emailSettings.smtpUsername}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={emailSettings.smtpPassword}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email
                </label>
                <input
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, fromEmail: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Name
                </label>
                <input
                  type="text"
                  value={emailSettings.fromName}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, fromName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Test Email Configuration
              </button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  min="6"
                  max="20"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      passwordMinLength: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="specialChars"
                    checked={securitySettings.requireSpecialChars}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        requireSpecialChars: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="specialChars" className="ml-2 text-sm text-gray-700">
                    Require special characters in passwords
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="numbers"
                    checked={securitySettings.requireNumbers}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        requireNumbers: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="numbers" className="ml-2 text-sm text-gray-700">
                    Require numbers in passwords
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="uppercase"
                    checked={securitySettings.requireUppercase}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        requireUppercase: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="uppercase" className="ml-2 text-sm text-gray-700">
                    Require uppercase letters in passwords
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable2FA"
                    checked={securitySettings.enable2FA}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        enable2FA: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="enable2FA" className="ml-2 text-sm text-gray-700">
                    Enable Two-Factor Authentication
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Login Attempts
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        maxLoginAttempts: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tabs.find((t) => t.id === activeTab)?.label} Settings
            </h3>
            <p className="text-gray-600">Configure your {activeTab} settings here.</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600">Configure system settings and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t flex justify-end">
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-red-200">
        <h3 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h3>
        <p className="text-red-600 mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="space-y-3">
          <button className="bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 border border-red-300">
            Clear All Cache
          </button>
          <button className="bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 border border-red-300">
            Reset System Settings
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;