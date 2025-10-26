// src/components/official/OfficialLayout.jsx
import React, { useState } from 'react';
import OfficialSidebar from './OfficialSidebar';
import OfficialHeader from './OfficialHeader';

const OfficialLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <OfficialSidebar 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfficialHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OfficialLayout;
