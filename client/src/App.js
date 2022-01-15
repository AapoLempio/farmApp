import "./App.css";
import React from "react";
import logo from "./logo.svg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";

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
      <TableContainer component={Paper}>
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
            {that.state.farmDataList.map((entry) => (
              <TableRow
                key={entry.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{entry.location}</TableCell>
                <TableCell align="right">{entry.datetime}</TableCell>
                <TableCell align="right">{entry.sensorType}</TableCell>
                <TableCell align="right">{entry.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        {this.state.farmDataList != null ? (
          this.displayTable(this)
        ) : (
          <p>Loading</p>
        )}
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[10]}
          />
        </div>
      </div>
    );
  }
}
export default App;
