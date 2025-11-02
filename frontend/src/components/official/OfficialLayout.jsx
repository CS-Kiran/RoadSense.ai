// src/components/official/OfficialLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import OfficialSidebar from './OfficialSidebar';
import OfficialHeader from './OfficialHeader';

const OfficialLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <OfficialSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfficialHeader />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OfficialLayout;
