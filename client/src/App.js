import "./App.css";
import React from "react";
/* import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { format } from "date-fns"; */
import { DataGrid } from "@mui/x-data-grid";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.state = {
      farmDataList: null,
      columns: [
        { field: "location", headerName: "Farm name", width: 130 },
        { field: "datetime", headerName: "Date", width: 130 },
        { field: "sensorType", headerName: "Metric", width: 130 },
        {
          field: "value",
          headerName: "Value",
          type: "number",
          width: 90,
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

  handleLoad() {
    fetch("/farmData/byRainFall", {
      method: "GET",
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          this.setState({ farmDataList: json });
        });
      }
    });
  }

  displayTable() {
    return (
      <div>
        <div style={{ height: 400, width: "50%" }}>
          <DataGrid
            rows={this.state.farmDataList}
            columns={this.state.columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </div>
    );
  }

  /* <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Farm name</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Metric type</TableCell>
                <TableCell align="right">Metric value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.farmDataList.map((entry) => (
                <TableRow
                  key={entry.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{entry.location}</TableCell>
                  <TableCell align="right">
                    {format(
                      new Date(entry.datetime),
                      "yyyy/MM/dd kk:mm:ss"
                    ).toString()}
                  </TableCell>
                  <TableCell align="right">{entry.sensorType}</TableCell>
                  <TableCell align="right">{entry.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */

  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        {this.state.farmDataList != null ? this.displayTable() : <p>Loading</p>}
      </div>
    );
  }
}
export default App;
