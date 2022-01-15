import "./App.css";
import React from "react";
import logo from "./logo.svg";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.state = {
      farmDataList: null,
    };
  }

  componentDidMount() {
    window.addEventListener("load", this.handleLoad);
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.handleLoad);
  }

  handleLoad() {
    fetch("/farmData", {
      method: "GET",
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          console.log(json.Items);
          this.setState({ farmDataList: json.Items });
        });
      }
    });
  }

  displayTable(that) {
    return (
    <table>
      {that.state.farmDataList.map((entry) => (
        <tr>
          <td>{entry.location}</td>
          <td>{entry.datetime}</td>
          <td>{entry.sensorType}</td>
          <td>{entry.value}</td>
        </tr>
      ))}
      </table>)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          {this.state.farmDataList != null ? this.displayTable(this): (<p>Loading</p>)}
        </header>
      </div>
    );
  }
}
export default App;
