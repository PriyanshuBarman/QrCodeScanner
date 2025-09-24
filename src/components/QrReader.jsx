import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FlashlightIcon, ImageUpIcon, XIcon } from "lucide-react";
import QrScanner from "qr-scanner";

function QrReader({ onClose }) {
  // 🔹 Refs & State
  const scanner = useRef(null);
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);

  // 🔹 Handlers
  const handleClose = () => {
    scanner.current?.stop();
    scanner.current = null;
    setIsActive(false);
    onClose("");
  };

  const handleScanSuccess = (result) => {
    console.log("QR Code detected:", result);
    onClose(result?.data);
    setIsActive(false);
  };

  const handleScanError = (err) => {
    console.log("QR scan error:", err);
  };

  const handleToggleFlashlight = async () => {
    if (!scanner.current) return;
    try {
      await scanner.current.toggleFlash();
      setIsFlashOn(scanner.current.isFlashOn());
    } catch (error) {
      console.error("Flashlight not supported:", error);
    }
  };

  // 🔹 Scanner Lifecycle
  useEffect(() => {
    if (videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl.current, handleScanSuccess, {
        onDecodeError: handleScanError,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl.current || undefined,
      });

      scanner.current
        .start()
        .then(() => setIsActive(true))
        .catch((err) => {
          console.error("Camera start error:", err);
          setIsActive(false);
          onClose("");
          alert(
            "Camera is blocked or not accessible. Please allow camera in your browser permissions and reload."
          );
        });
    }

    return () => {
      scanner.current?.stop();
      scanner.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full overflow-hidden bg-black">
      {/* 🔹 Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <Button
          onClick={handleClose}
          size="icon"
          variant="ghost"
          className="rounded-full p-5 text-white"
        >
          <XIcon className="size-6" />
        </Button>
        <Button
          onClick={handleToggleFlashlight}
          size="icon"
          variant="ghost"
          className={`rounded-full p-5 ${
            isFlashOn ? "bg-white text-black" : "text-white"
          }`}
        >
          <FlashlightIcon className="size-5" />
        </Button>
      </div>

      {/* 🔹 Camera Preview */}
      <video ref={videoEl} className="h-full w-full object-cover" />

      {/* 🔹 QR Frame Overlay */}
      <div
        ref={qrBoxEl}
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 -translate-y-16 pointer-events-none"
      >
        <CustomQrFrame />
        <p className="text-white text-base">Scan QR Code</p>
      </div>

      {/* 🔹 Upload Button */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
        <Button
          variant="secondary"
          onClick={() => alert("coming soon")}
          className=" leading-0 rounded-3xl py-5 !px-6 font-normal text-black shadow"
        >
          <ImageUpIcon /> Upload Photo
        </Button>
      </div>
    </div>
  );
}

export default QrReader;

function CustomQrFrame() {
  return (
    <div className="relative grid place-items-center sm:min-h-82 sm:min-w-82 min-w-66 min-h-66">
      {/* Main rounded square (invisible) */}
      <div className="size-[93.5%] sm:size-[94%] rounded-[42px] outline-[50vmax] outline-black/30" />

      {/* Top left corner */}
      <div className="absolute top-0 left-0">
        <div className="size-12 border-t-4 border-l-4  border-white rounded-tl-full" />
      </div>

      {/* Top right corner */}
      <div className="absolute top-0 right-0">
        <div className="size-12 border-t-4 border-r-4 border-white rounded-tr-full" />
      </div>

      {/* Bottom left corner */}
      <div className="absolute bottom-0 left-0">
        <div className="size-12 border-b-4 border-l-4 border-white rounded-bl-full" />
      </div>

      {/* Bottom right corner */}
      <div className="absolute bottom-0 right-0">
        <div className="size-12 border-b-4 border-r-4 border-white rounded-br-full" />
      </div>
    </div>
  );
}
