import axios from "axios";
import { ClipboardList } from "lucide-react";
import Moment from "moment";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import BookingFilter from "../../../components/BookingFilter";
import CommentPopover from "../../../components/common/CommentPopover";
import FollowupModal from "../../../components/common/FollowupModal";
import LoaderComponent from "../../../components/common/LoaderComponent";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import AssignDetailsModal from "../../../components/AssignDetailsModal";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { FaWpforms } from "react-icons/fa";
import { TextField } from "@mui/material";

const InspectionBooking = () => {
  const [InspectionBookData, setInspectionBookData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredBookingData, setFilteredBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const searchParams = new URLSearchParams(location.search);
  const [openFollowModal, setOpenFollowModal] = useState(false);
  const [followupdata, setFollowUpData] = useState("");
  const pageParam = searchParams.get("page");
  const [selectedAssignDetails, setSelectedAssignDetails] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      const storedPageNo = localStorage.getItem("page-no");
      if (storedPageNo) {
        setPage(parseInt(storedPageNo) - 1);
        navigate(`/inspection?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  useEffect(() => {
    const fetchInspectionData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-inspection-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setInspectionBookData(response.data?.booking);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInspectionData();
  }, []);
  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/edit-booking-inspection/${id}`);
  };
  const handleQuotation = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/quotation/${id}?mode=create`);
  };
  const handleView = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/view-booking/${id}`);
  };
  const handleFollowModal = (e, orderfollowup) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowUpData(orderfollowup);
    setOpenFollowModal(true);
  };
  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    localStorage.setItem("filteredInspectionDate", date);

    if (date) {
      const filteredData = InspectionBookData.filter((item) => {
        const itemDate = new Date(item.order_service_date);
        const selectedDateObj = new Date(date);
        return itemDate.toDateString() === selectedDateObj.toDateString();
      });
      setFilteredBookingData(filteredData);
    } else {
      setFilteredBookingData(InspectionBookData);
    }
  };
  useEffect(() => {
    const storedDate = localStorage.getItem("filteredInspectionDate");

    if (storedDate && InspectionBookData) {
      const filteredData = InspectionBookData.filter((item) => {
        const itemDate = new Date(item.order_service_date);
        const selectedDateObj = new Date(storedDate);
        return itemDate.toDateString() === selectedDateObj.toDateString();
      });

      setSelectedDate(storedDate);
      setFilteredBookingData(filteredData);
    } else {
      setFilteredBookingData(InspectionBookData);
    }
  }, [InspectionBookData]);
  const handleReset = () => {
    setSelectedDate(null);
    setFilteredBookingData(InspectionBookData);
    localStorage.removeItem("filteredInspectionDate");
  };
  const columns = [
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id, tableMeta) => {
          const orderfollowup = tableMeta.rowData[29];
          const noFollowup = !orderfollowup || orderfollowup.length === 0;

          const booking = {
            order_remarks: tableMeta.rowData[26],
            order_comment: tableMeta.rowData[27],
            order_postpone_reason: tableMeta.rowData[28],
          };
          const status = tableMeta.rowData[22];
          const inspectionstatus = tableMeta.rowData[25];
          const quotation =
            status == "Inspection" && inspectionstatus == "Pending";

          return (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <CiSquarePlus
                  onClick={(e) => handleEdit(e, id)}
                  title="Edit Booking"
                  className="h-6 w-6 hover:w-8 hover:h-8 hover:text-blue-900 cursor-pointer"
                />
              )}
              <ClipboardList
                title="Follow Up"
                onClick={(e) => handleFollowModal(e, orderfollowup)}
                className={`h-6 w-6 cursor-pointer hover:text-blue-900 ${
                  noFollowup ? "text-red-600" : "text-gray-700"
                }`}
              />

              <CommentPopover booking={booking} />
              {(userType == "6" || userType == "7" || userType == "8") &&
                quotation && (
                  <FaWpforms
                    title="Quotation"
                    onClick={(e) => handleQuotation(e, id)}
                    // onClick={() => navigate(`/quotation/${id}?mode=create`)}
                    className={`h-6 w-6 cursor-pointer hover:text-blue-900 ${
                      noFollowup ? "text-blue-400" : "text-gray-700"
                    }`}
                  />
                )}
            </div>
          );
        },
      },
    },
    //1
    {
      name: "booking_service_date",
      label: "Booking/Service",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const bookingDate = tableMeta.rowData[7];
          const serviceDate = tableMeta.rowData[8];
          return (
            <div className=" flex flex-col justify-center">
              <span>{Moment(bookingDate).format("DD-MM-YYYY")}</span>
              <span>{Moment(serviceDate).format("DD-MM-YYYY")}</span>
            </div>
          );
        },
      },
    },
    //2
    {
      name: "order_ref",
      label: "Order/Branch/BookTime",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (order_ref, tableMeta) => {
          const branchName = tableMeta.rowData[4];
          const bookTime = tableMeta.rowData[24];
          return (
            <div className="flex flex-col w-32">
              <span>{order_ref}</span>
              <span>{branchName}</span>
              <span>{bookTime}</span>
            </div>
          );
        },
      },
    },
    //3
    {
      name: "customer_mobile",
      label: "Customer/Mobile",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const customeName = tableMeta.rowData[5];
          const mobileNo = tableMeta.rowData[6];
          return (
            <div className=" flex flex-col w-32">
              <span>{customeName}</span>
              <span>{mobileNo}</span>
            </div>
          );
        },
      },
    },
    //4

    {
      name: "branch_name",
      label: "Branch",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        viewColumns: false,
        sort: true,
      },
    },
    //5
    {
      name: "order_customer",
      label: "Customer",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //6
    {
      name: "order_customer_mobile",
      label: "Mobile",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },

    //7
    {
      name: "order_date",
      label: "Booking Date",
      options: {
        filter: true,
        sort: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    //8
    {
      name: "order_service_date",
      label: "Service Date",
      options: {
        filter: true,
        sort: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },

    //9 service name
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: false,
        viewColumns: false,
        display: "exclude",
        searchable: true,
        sort: false,
      },
    },
    //10
    {
      name: "order_amount",
      label: "Price",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //11
    {
      name: "order_custom",
      label: "Custom",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //12
    {
      name: "order_time",
      label: "Time/Area",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const locality = tableMeta.rowData[31];
          const subLocality = tableMeta.rowData[32];

          let areaDisplay = "";
          if (locality && subLocality) {
            areaDisplay = `${locality} - ${subLocality}`;
          } else if (locality) {
            areaDisplay = locality;
          } else if (subLocality) {
            areaDisplay = subLocality;
          } else {
            areaDisplay = "N/A";
          }

          return (
            <div className="flex flex-col w-32">
              <span>{value}</span>
              <span style={{ fontSize: "12px" }}>{areaDisplay}</span>
            </div>
          );
        },
      },
    },
    //13
    {
      name: "service_price",
      label: "Service/Price",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const service = tableMeta.rowData[9];
          const price = tableMeta.rowData[10];
          const customeDetails = tableMeta.rowData[11];
          if (service == "Custom") {
            return (
              <div className="flex flex-col w-32">
                <span>{customeDetails}</span>
                <span>{price}</span>
              </div>
            );
          }
          return (
            <div className=" flex flex-col w-32">
              <span>{service}</span>
              <span>{price}</span>
            </div>
          );
        },
      },
    },

    //14
    {
      name: "order_assign",
      label: "Order Assign",
      options: {
        filter: false,
        sort: false,
        display: "exclude",
        viewColumns: false,
      },
    },
    //15
    {
      name: "amount_type",
      label: "Paid Amount/Type",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const type = tableMeta.rowData[20];
          const paid_amount = tableMeta.rowData[19];

          return (
            <div className=" flex flex-col w-32">
              <span>{paid_amount}</span>
              <span>{type}</span>
            </div>
          );
        },
      },
    },
    //16
    {
      name: "confirm/status/inspection status",
      label: "Confirm By/Status/Inspection Status",
      options: {
        filter: false,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "150px", // minimum width
            maxWidth: "200px", // optional maximum
            width: "180px", // fixed width
          },
        }),
        customBodyRender: (value, tableMeta) => {
          const confirmBy = tableMeta.rowData[21];
          const status = tableMeta.rowData[22];
          const inspectionstatus = tableMeta.rowData[25];
          return (
            <div className=" flex flex-col ">
              <span>{confirmBy}</span>
              <span>{status}</span>
              <td className="flex  items-center">
                {status === "Inspection" && (
                  <span className="px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-green-800">
                    {inspectionstatus}
                  </span>
                )}
              </td>
            </div>
          );
        },
      },
    },
    //17
    {
      name: "order_no_assign",
      label: "No of Assign",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderAssign = tableMeta.rowData[14];

          const activeAssignments = orderAssign.filter(
            (assign) => assign.order_assign_status !== "Cancel",
          );
          const count = activeAssignments.length;

          if (count > 0) {
            return (
              <button
                className="w-16 hover:bg-red-200 border border-gray-200 rounded-lg shadow-lg bg-green-200 text-black cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAssignDetails(activeAssignments);
                  setOpenModal(true);
                }}
              >
                {count}
              </button>
            );
          }
          return <span>{count}</span>;
        },
      },
    },
    // 18
    {
      name: "assignment_details",
      label: "Assign Details",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderAssign = tableMeta.rowData[14];

          const activeAssignments = orderAssign.filter(
            (assign) => assign.order_assign_status !== "Cancel",
          );

          if (activeAssignments.length === 0) {
            return <span>-</span>;
          }

          return (
            <div className="w-48 overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-sm">
                <tbody className="flex flex-wrap h-[40px]  w-48">
                  <tr>
                    <td className="text-xs px-[2px] leading-[12px]">
                      {activeAssignments
                        ?.map((assign) => assign?.user?.name)
                        .filter(Boolean)
                        .join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        },
      },
    },
    //19
    {
      name: "order_payment_amount",
      label: "Amount",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: true,
      },
    },
    //20
    {
      name: "order_payment_type",
      label: "Type",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: true,
      },
    },

    //21
    {
      name: "updated_by",
      label: "Confirm By",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //22
    {
      name: "order_status",
      label: "Status",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },

    //23
    {
      name: "order_address",
      label: "Address",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //24
    {
      name: "order_booking_time",
      label: "Book Time",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //25
    {
      name: "order_inspection_status",
      label: "Inspection Status",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //26
    {
      name: "order_remarks",
      label: "Remarks",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //27
    {
      name: "order_comment",
      label: "Comment",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //28
    {
      name: "order_postpone_reason",
      label: "Reason",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //29
    {
      name: "order_followup",
      label: "Followup",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //30
    {
      name: "order_area",
      label: "Order Area",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //31 - order_locality
    {
      name: "order_locality",
      label: "Locality",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //32 - order_sub_locality
    {
      name: "order_sub_locality",
      label: "Sub Locality",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    count: filteredBookingData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/inspection?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta, e) => {
      const id = filteredBookingData[rowMeta.dataIndex].id;
      handleView(e, id)();
    },
    setRowProps: () => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
          cursor: "pointer",
        },
      };
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
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
      return (
        <div className="flex justify-end items-center p-4">
          <span className="mx-4">
            <span className="text-red-600">Page {page + 1}</span> of{" "}
            {Math.ceil(count / rowsPerPage)}
          </span>
          <IoIosArrowBack
            onClick={page === 0 ? null : () => changePage(page - 1)}
            className={`w-6 h-6 cursor-pointer ${
              page === 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
            }  hover:text-red-600`}
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
            }  hover:text-red-600`}
          />
        </div>
      );
    },
  };
  return (
    <Layout>
      <BookingFilter />

      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title={"Inspection Booking List"}
            data={filteredBookingData ? filteredBookingData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
      {openFollowModal && (
        <FollowupModal
          open={openFollowModal}
          handleOpen={setOpenFollowModal}
          followData={followupdata}
        />
      )}
      {openModal && (
        <AssignDetailsModal
          open={openModal}
          handleOpen={setOpenModal}
          assignDetails={selectedAssignDetails}
        />
      )}
    </Layout>
  );
};

export default InspectionBooking;
