import { Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./components/home";

function App() {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
      setHasError(true);
      setErrorMessage(event.error?.message || "Unknown error");
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div style={{ backgroundColor: '#F9F6F1', color: '#2C2416', padding: '40px', fontFamily: 'sans-serif' }}>
        <h1>Error Loading App</h1>
        <p>{errorMessage}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F9F6F1', color: '#2C2416' }} className="min-h-screen">
      <Toaster position="top-center" richColors />
      <Suspense fallback={<div style={{ padding: '40px', fontFamily: 'sans-serif' }}>Loading application...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
