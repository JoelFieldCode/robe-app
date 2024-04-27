import React from "react";
import { ChevronLeft, Home, HomeIcon, Plus } from "lucide-react";
import { Button } from "../../@/components/ui/button";
import { Link } from "react-router-dom";

const Header = ({ withAddButton = true }: { withAddButton?: boolean }) => {
  return (
    <div className="pt-2 flex flex-row items-center justify-between px-2">
      <div>
        <Button asChild size="icon" variant="ghost">
          <Link to="/">
            <Home className="h-8 w-8" />
          </Link>
        </Button>
      </div>
      <div>
        {/* <Button
          onClick={() => {
            // TODO
          }}
          variant="ghost"
        >
          Robe
        </Button> */}
      </div>
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
