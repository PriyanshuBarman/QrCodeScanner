import { useEffect, useRef, useState } from "react";
import { X, ImageIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import QrScanner from "qr-scanner";

const QrReader = ({ onClose }) => {
  const scanner = useRef(null);
  const videoEl = useRef(null);
  const videoContainerEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);

  // Success callback
  const onScanSuccess = (result) => {
    console.log("QR Code detected:", result.data);
    onClose(result.data);
    if (scanner.current) {
      scanner.current.stop();
      scanner.current = null;
    }
  };

  // Error callback
  const onScanFail = (err) => {
    console.log("QR scan error:", err);
  };

  // Handle close button
  const handleClose = () => {
    if (scanner.current) {
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
        alert("Flashlight is not available on this device.");
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
            console.log("QR Code from image:", result);
            onClose(result);
          } catch (err) {
            console.error("No QR code found in image:", err);
            alert("No QR code found in the selected image.");
          }
        }
      };
      input.click();
    } catch (err) {
      console.error("Error scanning from photo:", err);
    }
  };

  // Initialize QR Scanner
  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // Add the class for the custom style
      if (videoContainerEl.current) {
        videoContainerEl.current.className = "example-style-2";
      }

      scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
      });

      scanner.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          console.error("Failed to start scanner:", err);
          setQrOn(false);
        });
    }

    // Clean up on unmount
    return () => {
      if (scanner.current) {
        scanner.current.stop();
        scanner.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="fixed inset-0 w-full overflow-hidden bg-black flex flex-col justify-center items-center">
      {/* Video Stream Container - This will get the new class for styling */}
      <div ref={videoContainerEl} id="video-container"  className="example-style-2">
        <video
          ref={videoEl}
          className="h-full w-full object-cover"
          playsInline
          muted
        />
      </div>

      {/* Top bar with close button and controls */}
      <div className="absolute top-0 right-0 left-0 z-50 flex items-center justify-between p-4 text-white">
        <button
          onClick={handleClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70"
        >
          <X size={24} strokeWidth={2} />
        </button>
        <div className="flex gap-4">
          <button
            onClick={toggleFlashlight}
            className={`flex h-10 w-10 items-center justify-center transition-colors text-white hover:text-yellow-400`}
          >
            <Zap size={24} />
          </button>
        </div>
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
