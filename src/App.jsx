// React
import { useState } from "react";
import QrReader from "./components/QrReader";
import {
  FlashlightIcon,
  ImageIcon,
  ImageUpIcon,
  Settings,
  X,
  XIcon,
  Zap,
} from "lucide-react";
import { Button } from "./components/ui/button";
import QrFrame from "./components/QrFrame";

// Components

function App() {
  const [openQr, setOpenQr] = useState(false);
  const [result, setResult] = useState("");
  const onClose = (result) => {
    setOpenQr(false);
    setResult(result);
  };

  return (
    <div className="h-dvh bg-black/50">
      <Button onClick={() => setOpenQr(!openQr)} className="text-green-700 ">
        {openQr ? "Close" : "Open"} QR Scanner
      </Button>
     
      {openQr && <QrReader onClose={onClose} />}

      {result && <p className="text-green-700">{result}</p>}
    </div>
  );
}

export default App;
