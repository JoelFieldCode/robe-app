import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../../@/components/ui/button";

const Header: React.FC<{ setShowForm: (showForm: boolean) => void }> = ({
  setShowForm,
}) => {
  return (
    <div className="twbg-green-400 twflex twflex-row twitems-center twjustify-between twpx-2">
      <div />
      <div>
        <Button onClick={() => setShowForm(false)} variant="ghost">
          Robe
        </Button>
      </div>
      <div>
        <Button onClick={() => setShowForm(true)} size="icon" variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
