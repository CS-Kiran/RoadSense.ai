import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CitizenSidebar from './CitizenSidebar';
import CitizenTopbar from './CitizenTopbar';

const CitizenLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <CitizenSidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <CitizenTopbar />
        
        <main className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenLayout;