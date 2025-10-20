import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { trackPageView, trackFormError } from "@/config/analytics";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Track 404 page view
    trackPageView('404 Not Found', {
      page_category: 'error',
      attempted_path: location.pathname
    });
    
    // Track as error event
    trackFormError('404_error', `Page not found: ${location.pathname}`);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
