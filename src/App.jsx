// React
import { useState } from "react";
import QrReader from "./components/QrReader";

// Components

function App() {
  const [openQr, setOpenQr] = useState(false);
  return (
    <div>
      <button onClick={() => setOpenQr(!openQr)}>
        {openQr ? "Close" : "Open"} QR Scanner
      </button>
      {openQr && <QrReader />}
    </div>
  );
}

export default App;
