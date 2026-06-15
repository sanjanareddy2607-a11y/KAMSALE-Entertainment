import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { PageLayout } from "./components/PageLayout";
import { HomePage } from "./pages/HomePage";
import { LanguageProvider } from "./context/LanguageContext";

const RegisterVinootanaPage = lazy(() =>
  import("./pages/RegisterVinootanaPage").then((m) => ({
    default: m.RegisterVinootanaPage,
  }))
);

const RegisterSuccessPage = lazy(() =>
  import("./pages/RegisterSuccessPage").then((m) => ({
    default: m.RegisterSuccessPage,
  }))
);

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div
        className="h-10 w-10 rounded-full border-2 border-yellow-200 border-t-yellow-500 animate-spin"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                <PageLayout>
                  <HomePage />
                </PageLayout>
              }
            />

            <Route
              path="/register/vinootana-golden-singers"
              element={
                <PageLayout>
                  <RegisterVinootanaPage />
                </PageLayout>
              }
            />

            <Route
              path="/register/vinootana-golden-singers/success"
              element={
                <PageLayout>
                  <RegisterSuccessPage />
                </PageLayout>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;