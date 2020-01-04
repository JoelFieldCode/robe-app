import React, { FC } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm/index";

//@ts-ignore
if (chrome.identity) {
  chrome.identity.getAuthToken({ interactive: true }, function(token) {
    console.log(token);
    //@ts-ignore
    chrome.identity.getProfileUserInfo((profile: any) => {
      console.log(profile);
    });
  });
}

const App: FC<{}> = () => {
  return (
    <div>
      <h4 className="text-center"> Robe</h4>
      <ItemForm></ItemForm>
    </div>
  );
};

export default App;
