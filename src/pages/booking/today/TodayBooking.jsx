import axios from "axios";
import Moment from "moment";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import BookingFilter from "../../../components/BookingFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";

import { ClipboardList } from "lucide-react";
import React from "react";
import AssignDetailsModal from "../../../components/AssignDetailsModal";
import CommentPopover from "../../../components/common/CommentPopover";
import FollowupModal from "../../../components/common/FollowupModal";
import LoaderComponent from "../../../components/common/LoaderComponent";

const TodayBooking = () => {
  const [todayBookingData, setTodayBookingData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const { userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [selectedAssignDetails, setSelectedAssignDetails] = useState([]);
  const [openFollowModal, setOpenFollowModal] = useState(false);
  const [followupdata, setFollowUpData] = useState("");

  UseEscapeKey();

  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-today-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const bookingData = response.data?.booking;
        setTodayBookingData(bookingData);
        setFilteredData(bookingData);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayData();
  }, []);

  useEffect(() => {
    if (!todayBookingData) return;
    let filtered = [...todayBookingData];

    switch (activeTab) {
      case "v3-team":
        filtered = filtered.filter((item) => {
          const orderAssign = item.order_assign || [];
          const activeAssignments = orderAssign?.filter(
            (assign) => assign.order_assign_status !== "Cancel",
          );
          return (
            activeAssignments.length > 0 &&
            item.order_vendor_id === null &&
            item.order_status !== "Vendor"
          );
        });
        break;

      case "non-assigned":
        filtered = filtered.filter((item) => {
          const orderAssign = item.order_assign || [];
          const activeAssignments = orderAssign?.filter(
            (assign) => assign.order_assign_status !== "Cancel",
          );
          return activeAssignments.length === 0;
        });
        break;

      case "vendor-team":
        filtered = filtered.filter(
          (item) =>
            item.order_vendor_id !== null || item.order_status == "Vendor",
        );
        break;

      case "all":
      default:
        break;
    }

    setFilteredData(filtered);
  }, [activeTab, todayBookingData]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAction = (e, id, status) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === "Inspection") {
      navigate(`/edit-booking-inspection/${id}`);
    } else {
      navigate(`/edit-booking/${id}`);
    }
  };

  const handleView = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/view-booking/${id}`);
  };

  const handleFollowModal = (e, orderfollowup) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowUpData(orderfollowup);
    setOpenFollowModal(true);
  };

  const columns = [
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id, tableMeta) => {
          const status = tableMeta.rowData[23];
          const orderfollowup = tableMeta.rowData[31];
          const noFollowup = !orderfollowup || orderfollowup.length === 0;

          const booking = {
            order_remarks: tableMeta.rowData[29],
            order_comment: tableMeta.rowData[30],
            order_postpone_reason: tableMeta.rowData[31],
          };
          return (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <CiSquarePlus
                  onClick={(e) => handleAction(e, id, status)}
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
            </div>
          );
        },
      },
    },
    // ... rest of your columns remain the same
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
          const bookTime = tableMeta.rowData[27];

          return (
            <div className="flex flex-col w-32">
              <span>{order_ref}</span>
              <span>{branchName}</span>
              <span>{bookTime}</span>
              {/* <span>{areaDisplay}</span> */}
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
    // ... rest of columns (same as before)
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
        filter: false,
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
      label: "Time/Km/Area",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const km = tableMeta.rowData[39];
          const locality = tableMeta.rowData[34];
          const subLocality = tableMeta.rowData[35];
          const address = tableMeta.rowData[26];

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

          const shortAddress =
            address && address.length > 50
              ? address.slice(0, 50) + "..."
              : address || "N/A";
          return (
            <div className="w-32">
              <div className="text-sm break-words">{value || "N/A"}</div>
              <div className="text-xs text-gray-800 ">Km :{km ? km : 0}</div>
              <div className="text-xs text-gray-500 ">{areaDisplay}</div>
              <div className="text-xs text-gray-800 ">{shortAddress}</div>
            </div>
          );
        },
      },
    },
    //13

    {
      name: "service_data",
      label: "Service",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const service = tableMeta.rowData[9];
          const customeDetails = tableMeta.rowData[11];
          if (service == "Custom") {
            return (
              <div className="flex flex-col w-32">
                <span>{customeDetails}</span>
              </div>
            );
          }
          return (
            <div className=" flex flex-col w-32">
              <span>{service}</span>
            </div>
          );
        },
      },
    },
    //14
    {
      name: "service_price",
      label: "Total Amount",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const price = tableMeta.rowData[10];

          // const advance_amount = tableMeta.rowData[35];
          // const dis_amount = tableMeta.rowData[36];
          return (
            <div className=" flex flex-col">
              {/* <span>{service}</span> */}
              <span>{price}</span>
              {/* <span>Advance : {advance_amount}</span>
                <span>Discount : {dis_amount}</span> */}
            </div>
          );
        },
      },
    },

    //15
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
    //16
    {
      name: "amount_type",
      label: "Received Amount",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const type = tableMeta.rowData[23];
          const paid_amount = tableMeta.rowData[22];
          const price = tableMeta.rowData[10];
          const advance_amount = tableMeta.rowData[37];
          const dis_amount = tableMeta.rowData[38];
          const balance =
            Number(price) -
            Number(advance_amount) -
            Number(dis_amount) -
            Number(paid_amount);
          const receivedamount = Number(paid_amount) + Number(advance_amount);
          return (
            <div className=" flex flex-col">
              <span>{receivedamount ? receivedamount : "0"}</span>
              <span className="text-xs text-gray-800">{type}</span>
              {/* <span>Balance : {balance ? balance : "0"}</span> */}
            </div>
          );
        },
      },
    },
    //17
    {
      name: "amount_type",
      label: "Balance Amount",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const paid_amount = tableMeta.rowData[22];
          const price = tableMeta.rowData[10];
          const advance_amount = tableMeta.rowData[37];
          const dis_amount = tableMeta.rowData[38];
          const payment_type = tableMeta.rowData[23];
          const balance =
            Number(price) -
            Number(advance_amount) -
            Number(dis_amount) -
            Number(paid_amount);
          return (
            <div className=" flex flex-col">
              <span
                className={`px-5 py-2 text-center rounded-lg text-white ${balance != 0 && payment_type == null ? "bg-red-500" : "bg-blue-500"}`}
              >
                {" "}
                {balance ? balance : "0"}
              </span>
            </div>
          );
        },
      },
    },
    //18
    {
      name: "order_no_assign",
      label: "No of Assign",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderAssign = tableMeta.rowData[15];

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
    //19
    {
      name: "assignment_details",
      label: "Assign Details",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderAssign = tableMeta.rowData[15];

          const activeAssignments = orderAssign?.filter(
            (assign) => assign?.order_assign_status !== "Cancel",
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
    //20
    {
      name: "time",
      label: "Start/End Time",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderAssign = tableMeta.rowData[15] || [];

          const activeAssignments = orderAssign.filter(
            (assign) => assign.order_assign_status !== "Cancel",
          );

          if (activeAssignments.length === 0) {
            return <span>-</span>;
          }

          const assignment = activeAssignments[0];

          return (
            <div className="w-28 text-xs space-y-1 leading-tight">
              <div>
                <span className="font-medium">Start:</span>{" "}
                {assignment.order_start_time}
              </div>

              <div>
                <span className="font-medium">End:</span>{" "}
                {assignment.order_end_time}
              </div>
            </div>
          );
        },
      },
    },
    //21
    {
      name: "confirm/status/inspection status",
      label: "Confirm By/Status/Inspection Status",
      options: {
        filter: false,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "150px",
            maxWidth: "200px",
            width: "180px",
          },
        }),
        customBodyRender: (value, tableMeta) => {
          const confirmBy = tableMeta.rowData[24];
          const status = tableMeta.rowData[25];
          const inspectionstatus = tableMeta.rowData[28];
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
    //22
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
    //23
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

    //24
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
    //25
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

    //26
    {
      name: "order_address",
      label: "Address",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //27
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
    //28
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
    //29
    {
      name: "order_remarks",
      label: "Remarks",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //30
    {
      name: "order_comment",
      label: "Comment",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //31
    {
      name: "order_postpone_reason",
      label: "Reason",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //32
    {
      name: "order_followup",
      label: "Followup",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //33
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
    //34
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
    //35
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
    //36
    {
      name: "order_sub_locality",
      label: "Sub Locality",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //37
    {
      name: "order_advance",
      label: "Advance",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //38
    {
      name: "order_discount",
      label: "Discount",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //39
    {
      name: "order_km",
      label: "Km",
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
    pagination: false,
    rowsPerPageOptions: [],
    fixedHeader: true,
    tableBodyHeight: "calc(100vh - 250px)",
    tableBodyMaxHeight: "",
    onRowClick: (rowData, rowMeta, e) => {
      const id = filteredData[rowMeta.dataIndex].id;
      handleView(e, id)();
    },

    setRowProps: (rowData) => {
      const orderStatus = rowData[25];
      let backgroundColor = "";
      if (orderStatus == "Confirmed") {
        backgroundColor = "#ffffff"; // white
      } else if (orderStatus == "ReConfirmed") {
        backgroundColor = "#ffffff"; // white
      } else if (orderStatus == "Completed") {
        backgroundColor = "#fed966"; // gold yellow
      } else if (orderStatus == "Inspection") {
        backgroundColor = "#01b0f1"; // light blue
      } else if (orderStatus == "RNR") {
        backgroundColor = "#B9CCF4"; // light blue
      } else if (orderStatus == "Pending") {
        backgroundColor = "#ffc8ce"; // light pink
      } else if (orderStatus == "Cancel") {
        backgroundColor = "#F76E6E"; // light  red
      } else if (orderStatus == "On the way") {
        backgroundColor = "#ffff00"; // light  yellow
      } else if (orderStatus == "In Progress") {
        backgroundColor = "#A7FCA7"; // light  green
      } else if (orderStatus == "Vendor") {
        backgroundColor = "#F38121"; // light  ornage
      } else if (orderStatus == "Reached") {
        backgroundColor = "#92d14f"; // light  green
      }

      return {
        style: {
          backgroundColor: backgroundColor,
          borderBottom: "5px solid #f1f7f9",
          cursor: "pointer",
        },
      };
    },

    customToolbar: () => {
      return (
        <React.Fragment>
          <button
            onClick={() => handleTabClick("all")}
            className={`px-4 py-2 rounded-md font-medium text-xs ${
              activeTab === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleTabClick("v3-team")}
            className={`px-4 py-2 ml-2 rounded-md font-medium text-xs ${
              activeTab === "v3-team"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            V3 Team
          </button>
          <button
            onClick={() => handleTabClick("non-assigned")}
            className={`px-4 py-2 ml-2 rounded-md font-medium text-xs ${
              activeTab === "non-assigned"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Non Assigned
          </button>
          <button
            onClick={() => handleTabClick("vendor-team")}
            className={`px-4 py-2 ml-2 rounded-md font-medium text-xs ${
              activeTab === "vendor-team"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Vendor Team
          </button>
        </React.Fragment>
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
            title={"Today Booking List"}
            data={filteredData ? filteredData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
      <AssignDetailsModal
        open={openModal}
        handleOpen={setOpenModal}
        assignDetails={selectedAssignDetails}
      />
      {openFollowModal && (
        <FollowupModal
          open={openFollowModal}
          handleOpen={setOpenFollowModal}
          followData={followupdata}
        />
      )}
    </Layout>
  );
};

export default TodayBooking;
