// Landing page is now the main entry point - this Index page is no longer used
// but kept for reference

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to landing page
    navigate('/');
  }, [navigate]);

  return null;
};

export default Index;
