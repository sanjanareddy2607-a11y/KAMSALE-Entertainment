import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageLayout } from "./components/PageLayout";
import { HomePage } from "./pages/HomePage";

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
        className="h-10 w-10 rounded-full border-2 border-gold-200 border-t-gold-500 animate-spin"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
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
              <Suspense fallback={<PageLoader />}>
                <RegisterVinootanaPage />
              </Suspense>
            </PageLayout>
          }
        />
        <Route
          path="/register/vinootana-golden-singers/success"
          element={
            <PageLayout>
              <Suspense fallback={<PageLoader />}>
                <RegisterSuccessPage />
              </Suspense>
            </PageLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
