// src/components/Tabs.jsx

import React, { useState } from 'react';

// The Tabs Component
const Tabs = ({ tabsData }) => {
  const [activeTab, setActiveTab] = useState(0); // State to keep track of the active tab

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex bg-stone-900 px-2 justify-center flex-wrap text-xs pt-4 border-gray-300 mb-4 mt-4">
        {tabsData.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-2 px-4 mt-4 sm:px-10 text-lg sm:text-2xl mr-2 rounded-lg transition-all duration-200 
              ${activeTab === index ? 'bg-stone-800 font-bold text-white' : 'bg-stone-800 text-white'} 
              hover:bg-stone-500 focus:outline-none`}
          >
            {tab.tabLabel}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 rounded-b-lg">
        {tabsData[activeTab] && (
          <div>{tabsData[activeTab].tabContent}</div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
