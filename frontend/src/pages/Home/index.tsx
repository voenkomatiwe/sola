import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/routes/constants";

export function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <Button
        onClick={() => navigate(APP_ROUTES.DASHBOARD.TO_HOME("consumer"))}
      >
        Open Dashboard
      </Button>
    </div>
  );
}
