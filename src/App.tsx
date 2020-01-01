import React, { FC } from "react";
import "./App.css";

import ItemForm from "./components/ItemForm/index";

const App: FC<{}> = () => {
  return (
    <div>
      <h4 className="text-center"> Robe</h4>
      <ItemForm></ItemForm>
    </div>
  );
};

export default App;
