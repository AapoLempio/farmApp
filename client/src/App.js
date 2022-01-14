import "./App.css";
import React from "react";
import logo from "./logo.svg";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.state = {
      data: null,
      setData: null,
    };
  }

  componentDidMount() {
    window.addEventListener("load", this.handleLoad);
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.handleLoad);
  }

  handleLoad() {
    try {
      React.useEffect(() => {
        fetch("/farmData")
          .then((res) => res.json())
          .then((json) => {
            console.log(json)
            this.setState({
              items: json,
            });
          });
      });
    } catch (error) {
      console.error("Could not load farm data");
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{!this.state.data ? "Loading..." : this.state.data}</p>
        </header>
      </div>
    );
  }
}
export default App;
