import { useEffect, useRef, useState } from "react";
import { X, Upload, FlashlightIcon, QrCode } from "lucide-react";

const QrReader = () => {
  // QR States
  const scanner = useRef();
  const videoEl = useRef(null);
  const [qrOn, setQrOn] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
  const [cameraPermission, setCameraPermission] = useState(null);

  // Success
  const onScanSuccess = (result) => {
    console.log(result);
    setScannedResult(result?.data);
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoEl?.current) {
        videoEl.current.srcObject = stream;
        videoEl.current.play();
      }
      
      setCameraPermission(true);
      setQrOn(true);
    } catch (err) {
      console.error('Camera access denied:', err);
      setCameraPermission(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoEl?.current && videoEl.current.srcObject) {
      const tracks = videoEl.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setQrOn(false);
    setScannedResult("");
  };

  // Handle close button
  const handleClose = () => {
    stopCamera();
    console.log("Close scanner");
  };

  // Handle upload from gallery
  const handleUpload = () => {
    console.log("Upload from gallery");
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video Stream */}
      <video 
        ref={videoEl}
        className="w-full h-full object-cover"
        playsInline
        muted
      />
      
      {/* Dark overlay with cutout for scanning area */}
      <div className="absolute inset-0 bg-black bg-opacity-60">
        {/* Cutout area for scanning */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-64 h-64"
            style={{
              background: 'transparent',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
            }}
          />
        </div>
      </div>
      
      {/* Top bar with close button */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4">
        <button 
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-black bg-opacity-70 flex items-center justify-center text-white hover:bg-opacity-90 transition-all"
        >
          <X size={24} strokeWidth={2} />
        </button>
        
        {/* Top right icons */}
        <div className="flex gap-4">
          {/* Gallery icon */}
          <button className="w-10 h-10 flex items-center justify-center text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </button>
          
          {/* QR code icon */}
          <button className="w-10 h-10 flex items-center justify-center text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4z"/>
              <rect x="15" y="13" width="2" height="2"/>
              <rect x="15" y="15" width="2" height="2"/>
              <rect x="15" y="17" width="2" height="2"/>
              <rect x="17" y="15" width="2" height="2"/>
              <rect x="17" y="17" width="2" height="2"/>
              <rect x="19" y="13" width="2" height="2"/>
              <rect x="19" y="15" width="2" height="2"/>
              <rect x="19" y="17" width="2" height="2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* QR Frame with animated colored corners */}
      <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
        <div className="relative w-64 h-64">
          {/* Animated scanning corners */}
          
          {/* Top left corner - Red */}
          <div className="absolute -top-1 -left-1">
            <div className="w-8 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-8 bg-red-500 rounded-full"></div>
          </div>
          
          {/* Top right corner - Orange */}
          <div className="absolute -top-1 -right-1">
            <div className="w-8 h-2 bg-orange-500 rounded-full ml-auto"></div>
            <div className="w-2 h-8 bg-orange-500 rounded-full ml-auto"></div>
          </div>
          
          {/* Bottom left corner - Blue */}
          <div className="absolute -bottom-1 -left-1">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
          </div>
          
          {/* Bottom right corner - Green */}
          <div className="absolute -bottom-1 -right-1">
            <div className="w-2 h-8 bg-green-500 rounded-full ml-auto"></div>
            <div className="w-8 h-2 bg-green-500 rounded-full ml-auto"></div>
          </div>
          
          {/* Animated scanning line */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse absolute top-1/2 transform -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* Upload from gallery button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button 
          onClick={handleUpload}
          className="flex items-center gap-2 px-4 py-3 bg-gray-800 bg-opacity-80 rounded-full text-white text-sm font-medium border border-gray-600"
        >
          <Upload size={18} />
          Upload from gallery
        </button>
      </div>

      {/* Scanned result display */}
      {scannedResult && (
        <div className="absolute top-20 left-4 right-4 z-50">
          <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-2">Scanned Result:</h3>
            <p className="text-sm break-all">{scannedResult}</p>
          </div>
        </div>
      )}

      {/* Camera permission denied */}
      {cameraPermission === false && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black">
          <div className="bg-gray-800 rounded-lg p-6 m-4 text-center border border-gray-600">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-lg font-semibold mb-4 text-white">Camera Access Required</h3>
            <p className="text-gray-300 mb-6">Please allow camera access to scan QR codes</p>
            <button 
              onClick={startCamera}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Enable Camera
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {!qrOn && cameraPermission === null && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black">
          <div className="text-white text-center">
            <div className="animate-spin w-12 h-12 border-3 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg">Starting camera...</p>
          </div>
        </div>
      )}

      {/* Instruction text */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-40">
        <p className="text-white text-center text-sm opacity-80">
          Point your camera at a QR code
        </p>
      </div>
    </div>
  );
};

export default QrReader;