import FancyButton from "./FancyButton";
import { useState, useRef } from "react";
export default function DropZone({ children, handleDropZoneDrop, handleDropZoneClick }) {
  const [isDragActive, setIsDragActive] = useState(false);
  
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    preventDefaults(e);
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    preventDefaults(e);
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    preventDefaults(e);
  };

  const handleDrop = (e) => {
    preventDefaults(e);
    setIsDragActive(false);
    handleDropZoneDrop(e);
  };


  return (
        <div 
          className={`group border-4 border-dashed rounded-2xl p-16 m-8 text-center cursor-pointer transition-all duration-300 relative ${
            isDragActive ? 'scale-105 border-[#FFD700] bg-linear-145 from-[#FFFEF7] to-[#FFFDF0] shadow-[0_15px_40px_rgba(255,215,0,0.3),_inset_0_0_20px_rgba(255,215,0,0.1)]' 
            : 'hover:-translate-y-1 border-[#DC143C] bg-linear-145 from-[#FFF8DC] to-[#FFFAF0] shadow-[0_20px_40px_rgba(139,0,0,0.3),_inset_0_0_2px_#FFD700]'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleDropZoneClick}
        >
          {/* Decorative characters */}
          <div className="absolute top-4 left-8 text-3xl font-bold opacity-20 text-red-600">大</div>
          <div className="absolute bottom-4 right-8 text-3xl font-bold opacity-20 text-red-600">發</div>
          
          <div className="pointer-events-none">
            <span className="text-6xl block mb-4 text-red-600" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'}}>
              🏮
            </span>
            <h3 className="text-2xl font-bold mb-2 text-red-800">將文件拖曳到這裡</h3>
            <p className="mb-4 text-red-700">支援 xls, xlsx 格式</p>
            <FancyButton className="px-8 py-3 z-2" type="middle">
              瀏覽文件
            </FancyButton>
          </div>
         {children} 
        </div>
  );
}