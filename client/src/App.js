import "./App.css";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.state = {
      noorasFarmDataList: null,
      ossiFarmDataList: null,
      partialFarmDataList: null,
      frimanFarmDataList: null,
      columns: [
        { field: "location", headerName: "Farm name", width: 150 },
        { field: "datetime", headerName: "Date", width: 150 },
        { field: "sensorType", headerName: "Metric", width: 150 },
        {
          field: "value",
          headerName: "Value",
          type: "number",
          width: 150,
        },
      ],
    };
  }

  componentDidMount() {
    window.addEventListener("load", this.handleLoad);
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.handleLoad);
  }

  // Farm data for each farm is fetched as the page is loaded.
  handleLoad() {
    fetch("/noorasFarmData", {
      method: "GET",
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          //console.log(json);
          this.setState({ noorasFarmDataList: json });
        });
      }
    });
    fetch("/ossiFarmData", {
      method: "GET",
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          //console.log(json);
          this.setState({ ossiFarmDataList: json });
        });
      }
    });
    fetch("/partialFarmData", {
      method: "GET",
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          //console.log(json);
          this.setState({ partialFarmDataList: json });
        });
      }
    });
    fetch("/frimanFarmData", {
      method: "GET",
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          //console.log(json);
          this.setState({ frimanFarmDataList: json });
        });
      }
    });
  }

  //The data on the page is dispalyed in a grid container
  displayTable() {
    return (
      <div>
        <p>
          The tables can be filtered by clicking the three dots beside a column
          name and giving it filtering parameters. The table can also be sorted
          by that colums values through the aforementioned menu or by clicking
          the sort arrow also beside the column's name.
        </p>
        <div className="grid-container">
          <div className="grid-child" style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={this.state.noorasFarmDataList}
              columns={this.state.columns}
              pageSize={20}
              rowsPerPageOptions={[20]}
            />
          </div>
          <div className="grid-child" style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={this.state.ossiFarmDataList}
              columns={this.state.columns}
              pageSize={20}
              rowsPerPageOptions={[20]}
            />
          </div>
        </div>
        <div className="grid-container">
          <div className="grid-child" style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={this.state.partialFarmDataList}
              columns={this.state.columns}
              pageSize={20}
              rowsPerPageOptions={[20]}
            />
          </div>
          <div className="grid-child" style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={this.state.frimanFarmDataList}
              columns={this.state.columns}
              pageSize={20}
              rowsPerPageOptions={[20]}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        {this.state.noorasFarmDataList != null ? (
          this.displayTable()
        ) : (
          <p>Loading</p>
        )}
      </div>
    );
  }
}
export default App;
