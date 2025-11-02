// src/components/official/OfficialLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import OfficialSidebar from './OfficialSidebar';
import OfficialHeader from './OfficialHeader';

const OfficialLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <OfficialSidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Header */}
        <OfficialHeader />

        {/* Page Content - This renders the child routes */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OfficialLayout;
