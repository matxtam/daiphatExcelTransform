import React, { useState, useRef } from 'react';
import { cn } from '@utils/cn';
import FancyButton from '@components/FancyButton';
import DropZone from '@components/DropZone';
import FancyContainer from '@components/FancyContainer';
import LoadingDots from '@components/LoadingDots';
import LangSwitcher from '@components/LangSwitcher';


const App = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [lang, setLang] = useState('vn');
  const fileInputRef = useRef(null);

  const handleDropZoneDrop = (e) => {
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    // Reset file input
    e.target.value = '';
  };

  const handleFiles = (files) => {
    setErrorMessage('');
    const validFiles = [];

    files.forEach(file => {
      if (!file.type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') &&
        !file.type.startsWith('application/vnd.ms-excel')) {
        setErrorMessage(lang == "vn" ? `"${file.name}" File excel hết hiệu lực` : `"${file.name}"不是有效的 Excel 文件。`);
        return;
      }

      // if (file.size > 10 * 1024 * 1024) {
      //   setErrorMessage(`"${file.name}" 文件過大。最大支援 10MB。`);
      //   return;
      // }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      validFiles.forEach(file => addUploadedFile(file));
    }
  };

  const addUploadedFile = async (file) => {
    const fileId = Date.now() + Math.random();
    setUploadedFiles(prev => [...prev, { id:fileId, loading:true, name: file.name}]);
    const url = await requestFileTransform(file);
    if (!url){
      removeFile(fileId);
      return;
    }
    const fileData = {
      id: fileId,
      loading: false,
      name: file.name,
      size: formatFileSize(file.size),
      url: url,
    };
    setUploadedFiles(prev=>
      prev.map(item =>
        (item.id === fileId) ? fileData : item
      )
    );
  };

  const requestFileTransform = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/transform`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
      } else {
        setErrorMessage(`"${file.name}" ${
          lang == "vn" ? "Chuyển đổi thất bại" : "轉換失敗"
        }：${response.status}${response.statusText}`);
        return;
      }
    } catch (error) {
      setErrorMessage(lang == "vn" ? `"${file.name}" Chuyển đổi thất bại: Lỗi Server` : `"${file.name}" 轉換失敗：伺服器錯誤`);
      return;
    }
  };


  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(img => img.id !== fileId));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Byte';
    const k = 1024;
    const sizes = ['Byte', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadAllFiles = () => {
    uploadedFiles.forEach(file => {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = "transformed_" + file.name;
      link.click();
    });
  };


  // Hide error message after 5 seconds
  React.useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);











  return (
    <div className="min-h-screen p-8 relative" style={{
      background: 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #B22222 100%)'
    }}>

      {/* Background decoration */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
          `,
          zIndex: -1
        }}
      />


      <FancyContainer title={lang == "vn" ? "Trình chuyển đổi đơn giao hàng":"送貨單轉換器"}>

        <LangSwitcher lang={lang} setLang={setLang} className="absolute top-4 right-4"/>

        <DropZone
          lang={lang}
          handleDropZoneDrop={handleDropZoneDrop}
          handleDropZoneClick={handleDropZoneClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileSelect}
          />
        </DropZone>

        {/* Error Message */}
        {(//errorMessage &&
          // <div className="mx-8 mb-4 p-4 rounded-xl font-bold border-2 bg-linear-135 from-[#DC143C] to-[#8B0000] border-[#FFD700] text-[#FFD700] shadow-[0_4px_15px_rgba(220,20,60,0.3)]" >
          <div className={cn(
            "mx-8 mb-4 p-4 rounded-xl font-bold border-2 bg-linear-135 from-[#DC143C] to-[#8B0000] border-[#FFD700] text-[#FFD700] shadow-[0_4px_15px_rgba(220,20,60,0.3)]",
            "transform transition-all duration-500 ease-out",
            (errorMessage ? 'translate-y-0 opacity-100' : 'my-0 py-0 h-0 -translate-y-full opacity-0')
          )}>
            {errorMessage}
          </div>
        )}

        {/* Preview Container */}
        {uploadedFiles.length > 0 && (
          <div className="m-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <h3 className="text-2xl font-bold text-red-800">👇{lang == 'vn' ? "Nhấn để tải xuống" : "點擊下載"}👇</h3>
                <FancyButton onClick={downloadAllFiles}>{lang == "vn" ? "Tải về toàn bộ":"下載全部"}</FancyButton>
              </div>
              <FancyButton onClick={clearAllFiles}>{lang == "vn" ? "Xóa hết" : "清空全部"}</FancyButton>
            </div>

            {/* File list */}
            <div className="grid grid-cols-1 gap-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="grid grid-cols-[1fr_100px_48px] content-end items-end justify-between justify-items-start w-full h-10 px-2 py-1 border-b-2 border-red-800 overflow-hidden transition-all duration-300 hover:border-yellow-400"
                >

                  {file.loading ? (
                    <div className="text-black font-bold truncate">{file.name} {lang == "vn"?"Đang chuyển đổi":"轉換中"} <LoadingDots/></div>
                  ): (<>
                  {/* download link */}
                  <a
                    className="text-black font-bold truncate"
                    href={file.url} target="_blank" rel="noopener noreferrer"
                    download={"transformed_" + file.name}
                  >{file.name}</a>

                  {/* File size */}
                  <div className="text-black opacity-90 text-xs">{file.size}</div>

                  {/* Remove button */}
                  <FancyButton onClick={() => removeFile(file.id)}
                    className="text-sm px-2 py-1 m-0"
                  >{lang == "vn"?"Xóa":"刪除"}</FancyButton>
                  </>)}

                </div>
              ))}
            </div>
          </div>
        )}

      </FancyContainer>

    </div>
  );
};

export default App;