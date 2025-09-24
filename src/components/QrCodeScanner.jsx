import { Button } from "@/components/ui/button";
import { FlashlightIcon, ImageUpIcon, XIcon } from "lucide-react";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";

function QrCodeScanner({ onClose }) {
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const [isFlashOn, setIsFlashOn] = useState(false);

  const handleClose = () => {
    if (scanner?.current) {
      scanner.current.stop();
      scanner.current = null;
    }
    setQrOn(false);
    onClose("");
  };

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

  const onScanSuccess = (result) => {
    console.log("QR Code detected:", result);
    onClose(result?.data);
    setQrOn(false);
  };

  const onScanFail = (err) => {
    console.log("QR scan error:", err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // Camera permission alert
  useEffect(() => {
    if (!qrOn) {
      onClose("");
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
    }
  }, [qrOn]);

  return (
    <div className="fixed inset-0 w-full overflow-hidden bg-black">
      {/* Top Bar */}
      <div className="Top-Bar absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-4">
        <Button
          onClick={handleClose}
          size="icon"
          variant="ghost"
          className="rounded-full p-5  text-white "
        >
          <XIcon className="size-6" />
        </Button>

        {/* Flashlight button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleFlashlight}
          className={` rounded-full  p-5 ${
            isFlashOn ? "bg-white text-black" : "text-white"
          }`}
        >
          <FlashlightIcon className="size-5" />
        </Button>
      </div>

      {/* Video Stream - Full Screen Background */}
      <video ref={videoEl} className=" h-full w-full object-cover" />

      <div ref={qrBoxEl} className="-translate-y-16">
        <div className="absolute inset-0 pointer-events-none flex gap-12 flex-col justify-center items-center">
          <CustomQrFrame />
          <p className="text-white text-base z-10 ">Scan QR Code </p>
        </div>
      </div>

      {/* Scan from photo button */}
      <div className="absolute bottom-12 left-1/2 z-50 -translate-x-1/2 transform">
        <Button
          variant="secondary"
          onClick={() => alert("coming soon")}
          className=" leading-0 rounded-3xl py-5 !px-6 font-normal text-black shadow"
        >
          <ImageUpIcon />
          Upload Photo
        </Button>
      </div>
    </div>
  );
}

export default QrCodeScanner;

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
