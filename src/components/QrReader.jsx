import { useEffect, useRef, useState } from "react";
import { X, ImageIcon, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import QrScanner from "qr-scanner";

const QrReader = ({ onClose }) => {
  // QR States (using the working logic from Medium article)
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  // const [scannedResult, setScannedResult] = useState("");
  // const [flashlightOn, setFlashlightOn] = useState(false);

  // Success callback (from Medium article)
  const onScanSuccess = (result) => {
    console.log("QR Code detected:", result);
    // setScannedResult(result?.data);
    onClose(result?.data);
    setQrOn(false);
  };

  // Error callback (from Medium article)
  const onScanFail = (err) => {
    console.log("QR scan error:", err);
  };

  // Handle close button
  const handleClose = () => {
    if (scanner?.current) {
      scanner.current.stop();
      scanner.current = null;
    }
    setQrOn(false);
    onClose("");
    console.log("Scanner closed - camera should be off");
  };

  // Toggle flashlight
  const toggleFlashlight = async () => {
    if (scanner.current) {
      try {
        await scanner.current.toggleFlash();
      } catch (error) {
        alert(error);
      }
    }
  };

  // Handle scan from photo
  const handleScanFromPhoto = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          try {
            const result = await QrScanner.scanImage(file);
            // setScannedResult(result);
            console.log("QR Code from image:", result);
          } catch (err) {
            console.error("No QR code found in image:", err);
            alert("No QR code found in the selected image");
          }
        }
      };

      input.click();
    } catch (err) {
      console.error("Error scanning from photo:", err);
    }
  };

  // Initialize QR Scanner (using exact logic from Medium article)
  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // Instantiate the QR Scanner (from Medium article)
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // Camera facing mode - "environment" means back camera
        preferredCamera: "environment",
        // Help position our scan region
        highlightScanRegion: true,
        // Show yellow outline around detected QR code
        highlightCodeOutline: true,
        // Custom div for scan region control
        overlay: qrBoxEl?.current || undefined,
      });

      // Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // Clean up on unmount
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // Camera permission alert (from Medium article)
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="fixed inset-0 w-full overflow-hidden bg-black">
      {/* Top bar with close button and controls */}
      <div className="absolute top-0 right-0 left-0 z-50 flex items-center justify-between p-4 text-white">
        <button
          onClick={handleClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70"
        >
          <X size={24} strokeWidth={2} />
        </button>

        {/* Top right controls */}
        <div className="flex gap-4">
          {/* Flashlight button */}
          <button
            onClick={toggleFlashlight}
            className={`flex h-10 w-10 items-center justify-center transition-colors ${
              scanner?.current?.isFlashOn() ? "text-yellow-400" : "text-white"
            }`}
          >
            <Zap size={24} />
          </button>

          {/* Settings button */}
          <button className="flex h-10 w-10 items-center justify-center">
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Video Stream - Full Screen Background */}
      <video ref={videoEl} className=" h-full w-full object-cover" muted />

      <div
        ref={qrBoxEl}
        >
        <img
          src="./qr-frame.svg"
          alt="Qr Frame"
          width={256}
          height={256}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Scan from photo button */}
      <div className="absolute bottom-12 left-1/2 z-50 -translate-x-1/2 transform">
        <Button
          variant="ghost"
          onClick={handleScanFromPhoto}
          className="flex items-center gap-2 rounded-2xl bg-black/70 !px-6 font-normal text-white shadow backdrop-blur-sm hover:bg-black/80"
        >
          <ImageIcon size={20} />
          Scan from photo
        </Button>
      </div>

      {/* Loading state */}
      {!qrOn && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-3 border-white border-t-transparent" />
            <p className="text-lg text-white">
              Camera not accessible. Please allow camera permissions and reload.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrReader;
