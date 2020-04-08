import React, { Component } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm/index";
import AuthService from "./services/AuthService";

export interface AppState {
  auth: boolean;
}

class App extends Component {
  state: AppState;
  constructor(props: any) {
    super(props);
    this.state = {
      auth: false
    };
  }

  async componentDidMount() {
    await AuthService.signin();
    this.setState({
      auth: true
    });
  }

  render() {
    if (!this.state.auth) {
      return null;
    }

    return (
      <div>
        <h4 className="text-center"> Robe</h4>
        <ItemForm></ItemForm>
      </div>
    );
  }
}

export default App;
