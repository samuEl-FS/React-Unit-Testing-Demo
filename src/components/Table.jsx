import React, { Fragment, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";


import { getData } from "../data/getMockData";
import { TableHead } from "@material-ui/core";
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        data-testid="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        data-testid="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        data-testid="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        data-testid="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

export default function CustomPaginationActionsTable() {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({});
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage =  (event, newPage) => {
    setPage(newPage);
    fetchData(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchData(0, parseInt(event.target.value, 10));
  };

  const fetchData = useCallback((page = 0, rowsPerPage = 5) => {
    setLoading(true);
    const params  = new URLSearchParams({
      page: page,
      per_page: rowsPerPage,
    });
    fetch(`https://reqres.in/api/users?${params}`)
      .then((res) => res.json())
      .then((json) => {
        const dummyData = getData(page, rowsPerPage)
        setData(dummyData);
        setRows(dummyData.data);
        setLoading(false);
      }).catch(() => {
        setData({});
        setRows([]);
        setLoading(false);
      });
  })

  useEffect(() => {
    fetchData();
  }, []);
  

  return (
    <TableContainer component={Paper} data-testid="table">
      <Table className={classes.table} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>First-Name</TableCell>
            <TableCell align="right">Last-Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Gender</TableCell>
            <TableCell align="right">Mobile</TableCell>
          </TableRow>
        </TableHead>
        <TableBody  >
          {!loading  ? 
            <Fragment>
              {rows.length > 0 ? (rows).map((row, idx) => (
                <TableRow key={row.id} data-testid="content">
                  <TableCell component="th" scope="row">
                    {row.first_name}
                  </TableCell>
                  <TableCell style={{ width: 160 }}>
                    {row.last_name}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.email}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.gender}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.mobile}
                  </TableCell>
                </TableRow>
              ))
              : 
                <TableRow key="loading" data-testid="noData"><TableCell colSpan={6} >No Data Found...</TableCell></TableRow>
              }
            </Fragment>
            : <TableRow key="loading" data-testid="loading"><TableCell colSpan={6} >Loading...</TableCell></TableRow>
          }
          
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={3}
              count={data.total || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { "aria-label": "rows per page", "data-testid": "select" },
                native: true,

              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
