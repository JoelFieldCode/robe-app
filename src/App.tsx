import React, { useEffect } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm/index";

import { useDispatch, useSelector } from "react-redux";
import { loginAsync, userAuth } from "./store/slices/user";
import { selectCategories, fetchCategories } from "./store/slices/categories";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector(userAuth);
  const categories = useSelector(selectCategories);
  useEffect(() => {
    dispatch(loginAsync());
  }, [dispatch]);

  useEffect(() => {
    if (auth) {
      dispatch(fetchCategories());
    }
  }, [auth]);

  if (!auth || !categories.length) {
    return <div> Loading </div>;
  }
  return (
    <div>
      <h4 className="text-center"> Robe</h4>
      <ItemForm categories={categories}></ItemForm>
    </div>
  );
};

export default App;
