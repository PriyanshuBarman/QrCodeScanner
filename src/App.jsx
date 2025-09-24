import { useState } from "react";
import { Button } from "./components/ui/button";
import QrReader from "./components/QrReader";
import { ArrowDownIcon } from "lucide-react";

function App() {
  const [openQr, setOpenQr] = useState(false);
  const [result, setResult] = useState("");
  const onClose = (result) => {
    setOpenQr(false);
    setResult(result);
  };

  return (
    <div className="h-dvh flex  flex-col gap-12 justify-center items-center ">
      <Button onClick={() => setOpenQr(!openQr)}>
        {openQr ? "Close" : "Open"} QR Scanner
      </Button>

      {openQr && <QrReader onClose={onClose} />}

      {result && (
        <div>
          <h2 className="text-xl font-bold flex justify-center items-center gap-2 text-center ">
            Scan Result <ArrowDownIcon />
          </h2>
          <p className=" mt-4 font-medium text-center">{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;
