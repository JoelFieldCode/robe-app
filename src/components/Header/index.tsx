import React from "react";
import { Home, Plus, User } from "lucide-react";
import { Button } from "../../@/components/ui/button";
import { Link } from "react-router-dom";

const Header = ({ withAddButton = true }: { withAddButton?: boolean }) => {
  return (
    <div className="pt-2 px-2 flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2"></div>
      <div />
      {withAddButton && (
        <div>
          <Button asChild size="icon" variant="ghost">
            <Link to="/items/create">
              <Plus className="h-8 w-8" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
