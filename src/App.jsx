// React
import { useState } from "react";
import QrReader from "./components/QrReader";
import { FlashlightIcon, ImageIcon, Settings, X, Zap } from "lucide-react";
import { Button } from "./components/ui/button";

// Components

function App() {
  const [openQr, setOpenQr] = useState(false);
  const [result, setResult] = useState("");
  const onClose = (result) => {
    setOpenQr(false);
    setResult(result);
  };

  return (
    <div className="bg-black/50 h-dvh">
      <button onClick={() => setOpenQr(!openQr)} className="text-green-700 ">
        {openQr ? "Close" : "Open"} QR Scanner
      </button>

      {openQr && <QrReader onClose={onClose} />}

      {result && <p className="text-green-700">{result}</p>}
    </div>
  );
}

export default App;
