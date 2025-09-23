import { Button } from "@/components/ui/button";
import { FlashlightIcon, ImageUpIcon, XIcon } from "lucide-react";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";

const QrReader = ({ onClose }) => {
  // QR States (using the working logic from Medium article)
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const [isFlashOn, setIsFlashOn] = useState(false);

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
        setIsFlashOn(scanner.current.isFlashOn());
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
      {/* Top Bar */}
      <div className="Top-Bar absolute top-0 right-0 left-0 z-50 flex items-center justify-between p-4 text-white">
        <Button
          onClick={handleClose}
          size="icon"
          variant="ghost"
          className="rounded-full p-5 bg-black/50 backdrop-blur-sm "
        >
          <XIcon className="size-6" />
        </Button>

        {/* Flashlight button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleFlashlight}
          className={` rounded-full p-5 bg-black/50 backdrop-blur-sm ${
            isFlashOn ? "text-yellow-400" : "text-white"
          }`}
        >
          <FlashlightIcon className="size-6" />
        </Button>
      </div>

      {/* Video Stream - Full Screen Background */}
      <video ref={videoEl} className=" h-full w-full object-cover" muted />

      <div ref={qrBoxEl} className="-translate-y-18">
        <div className="absolute inset-0 pointer-events-none flex gap-12 flex-col justify-center items-center">
          {/*  custom rounded square border frame */}
          <div className="relative  sm:min-h-72 sm:min-w-72 min-w-64 min-h-64">
            {/* Main rounded square border - invisible, just for positioning */}
            <div className="h-full w-full" />

            {/* Rounded corner borders */}
            {/* Top left corner */}
            <div className="absolute top-0 left-0">
              <div className="h-8 w-8 rounded-tl-3xl border-t-4 border-l-4 border-white" />
            </div>

            {/* Top right corner */}
            <div className="absolute top-0 right-0">
              <div className="h-8 w-8 rounded-tr-3xl border-t-4 border-r-4 border-white" />
            </div>

            {/* Bottom left corner */}
            <div className="absolute bottom-0 left-0">
              <div className="h-8 w-8 rounded-bl-3xl border-b-4 border-l-4 border-white" />
            </div>

            {/* Bottom right corner */}
            <div className="absolute right-0 bottom-0">
              <div className="h-8 w-8 rounded-br-3xl border-r-4 border-b-4 border-white" />
            </div>
          </div>

          <p className="text-white font-[450] ">Scan Vestify QR Code </p>
        </div>
      </div>

      {/* Scan from photo button */}
      <div className="absolute bottom-12 left-1/2 z-50 -translate-x-1/2 transform">
        <Button
          variant="ghost"
          onClick={handleScanFromPhoto}
          className=" leading-0 rounded-3xl bg-black/70 py-5 !px-6 font-normal text-white shadow backdrop-blur-sm "
        >
          <ImageUpIcon />
          Upload Photo
        </Button>
      </div>
    </div>
  );
};

export default QrReader;
