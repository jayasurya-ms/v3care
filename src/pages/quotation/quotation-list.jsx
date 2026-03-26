import axios from "axios";
import { SquarePen } from "lucide-react";
import MUIDataTable from "mui-datatables";
import React, { useContext, useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import Layout from "../../layout/Layout";
import LoaderComponent from "../../components/common/LoaderComponent";
import UseEscapeKey from "../../utils/UseEscapeKey";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import moment from "moment";
import { TextField, TableFooter, TableRow, TableCell } from "@mui/material";

const Quotation = () => {
  const [quotationData, setQuotationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const rowsPerPage = 10;

  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");

  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      localStorage.setItem("page-no", 1);
      setPage(0);
    }
  }, [location]);

  UseEscapeKey();

  useEffect(() => {
    const fetchQuotationData = async () => {
      setLoading(true);

      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }

        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-quotation-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setQuotationData(response.data?.quotation || []);
      } catch (error) {
        console.error("Error fetching quotation data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotationData();
  }, []);

  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/quotation/${id}?mode=edit`);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleReset = () => {
    setSelectedDate("");
  };

  const filteredData = selectedDate
    ? quotationData.filter((item) => item.quotation_date === selectedDate)
    : quotationData;

  const columns = [
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) =>
          userType !== "4" && (
            <div
              onClick={(e) => handleEdit(e, id)}
              className="flex items-center"
            >
              <SquarePen className="h-5 w-5 cursor-pointer hover:text-blue-700">
                <title>Edit Quotation</title>
              </SquarePen>
            </div>
          ),
      },
    },

    {
      name: "quotation_ref",
      label: "Quotation Ref",
      options: { filter: false, sort: true },
    },
    {
      name: "order_ref",
      label: "Order Ref",
      options: { filter: false, sort: true },
    },
    {
      name: "quotation_date",
      label: "Date",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value ? moment(value).format("DD-MM-YYYY") : "-";
        },
      },
    },
    {
      name: "quotation_customer",
      label: "Customer Name",
      options: { filter: true, sort: true },
    },
    {
      name: "quotation_customer_mobile",
      label: "Contact No",
      options: { filter: true, sort: true },
    },
    {
      name: "sub_sum_quotation_sub_amount",
      label: "Total Amount",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => `₹ ${value}`,
      },
    },
    {
      name: "quotation_status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];
  const handleView = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/quotation/view/${id}`);
  };
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    count: filteredData.length,
    rowsPerPage,
    page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/quotation-list?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta, e) => {
      const id = filteredData[rowMeta.dataIndex].id;

      handleView(e, id);
    },
    customToolbar: () => {
      return (
        <>
          <TextField
            label="Filter by Date"
            type="date"
            value={selectedDate || ""}
            onChange={handleDateChange}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            className="mr-4"
          />

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-black rounded-md ml-4"
          >
            Reset
          </button>
        </>
      );
    },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <TableFooter>
        <TableRow>
          <TableCell colSpan={1000} sx={{ border: "none" }}>
            <div className="flex justify-end items-center p-4">
              <span className="mx-4">
                <span className="text-red-600">Page {page + 1}</span> of{" "}
                {Math.ceil(count / rowsPerPage)}
              </span>
              <IoIosArrowBack
                onClick={page === 0 ? null : () => changePage(page - 1)}
                className={`w-6 h-6 cursor-pointer ${
                  page === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600"
                } hover:text-red-600`}
              />
              <IoIosArrowForward
                onClick={
                  page >= Math.ceil(count / rowsPerPage) - 1
                    ? null
                    : () => changePage(page + 1)
                }
                className={`w-6 h-6 cursor-pointer ${
                  page >= Math.ceil(count / rowsPerPage) - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600"
                } hover:text-red-600`}
              />
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    ),
  };

  return (
    <Layout>
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-4">
          <MUIDataTable
            title="Quotation List"
            data={filteredData}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default Quotation;
