import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../base/BaseUrl";
import BookingFilter from "../../../../components/BookingFilter";
import Layout from "../../../../layout/Layout";

import { Dialog, DialogActions, DialogContent } from "@mui/material";
import MUIDataTable from "mui-datatables";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../../components/common/LoaderComponent";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
const status = [
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "RNR",
    label: "RNR",
  },
  {
    value: "Inspection",
    label: "Inspection",
  },
  {
    value: "Confirmed",
    label: "Confirmed",
  },
  {
    value: "On the way",
    label: "On the way",
  },
  {
    value: "In Progress",
    label: "In Progress",
  },
  {
    value: "Completed",
    label: "Completed",
  },
  {
    value: "Vendor",
    label: "Vendor",
  },
  {
    value: "Cancel",
    label: "Cancel",
  },
];

const Istatus = [
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "On the way",
    label: "On the way",
  },
  {
    value: "In Progress",
    label: "In Progress",
  },
  {
    value: "Completed",
    label: "Completed",
  },
  {
    value: "Cancel",
    label: "Cancel",
  },
];

const EditBookingInspection = () => {
  const { id } = useParams();
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  const navigate = useNavigate();
  const [booking, setBooking] = useState({
    order_status: "",
    order_person_contact_no: "",
    order_person_name: "",
    order_payment_type: "",
    order_vendor_id: "",
    order_inspection_status: "",
    order_amount: 0,
  });
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState({});

  const [followup, setFollowUp] = useState([]);
  const [followups, setFollowUps] = useState({
    order_followup_date: moment().format("YYYY-MM-DD"),
    order_followup_description: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);
  const [bookingAssign, setBookingAssign] = useState({});

  const [orderref, setOrderRef] = useState([]);

  const onInputChange1 = (e) => {
    const { name, value } = e.target;
    setFollowUps((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [paymentmode, setPaymentMode] = useState([]);
  const [activeTab, setActiveTab] = useState("bookingDetails");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);
  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      [
        "order_amount",
        "order_advance",
        "order_payment_amount",
        "order_comm",
        "order_comm_percentage",
      ].includes(name)
    ) {
      if (validateOnlyDigits(value)) {
        setBooking((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setBooking((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchBookingData = async () => {
    setFetchLoading(true);
    try {
      const response = await axios({
        url: `${BASE_URL}/api/panel-fetch-booking-by-id/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const bookingData = {
        ...response.data?.booking,
        order_comm: response.data?.booking?.order_comm ?? 0,
        order_amount: response.data?.booking?.order_amount ?? 0,
      };
      setBooking(bookingData);
      setVendor(response.data.vendor);
      setBookingAssign(response.data.bookingAssign);

      setOrderRef(response.data?.booking.order_ref);
      setFollowUp(response.data?.bookingFollowup);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    } finally {
      setFetchLoading(false);
    }
  };
  const fetchpaymentData = async () => {
    try {
      const response = await axios({
        url: `${BASE_URL}/api/panel-fetch-payment-mode`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPaymentMode(response.data?.paymentMode);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  useEffect(() => {
    fetchBookingData();
    fetchpaymentData();
  }, []);
  const [timeslot, setTimeSlot] = useState([]);
  useEffect(() => {
    fetch(BASE_URL + "/api/panel-fetch-timeslot-out")
      .then((response) => response.json())
      .then((data) => setTimeSlot(data.timeslot));
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsButtonDisabled(true);

    const data = {
      order_service_date: booking.order_service_date,
      order_amount: booking.order_amount,
      order_advance: booking.order_advance,
      order_person_contact_no: booking.order_person_contact_no,
      order_person_name: booking.order_person_name,
      order_time: booking.order_time,
      order_status: booking.order_status,
      order_comm: booking.order_comm,
      order_comm_percentage: booking.order_comm_percentage,
      order_comment: booking.order_comment,
      order_payment_amount: booking.order_payment_amount,
      order_payment_type: booking.order_payment_type,
      order_transaction_details: booking.order_transaction_details,
      branch_id: booking.branch_id,
      order_area: booking.order_area,
      order_inspection_status: booking.order_inspection_status,
    };

    axios
      .put(`${BASE_URL}/api/panel-update-booking-inspection/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.code == "200") {
          toast.success(res.data?.msg || "Booking Updated Successfully");
          navigate(-1);
        } else {
          toast.error(res.data?.msg || "Network Error");
        }
      })
      .catch((err) => {
        console.error("Error updating booking", err);
        toast.error("Error updating booking");
      })
      .finally(() => {
        setLoading(false);
        setIsButtonDisabled(false);
      });
  };

  const columns = [
    {
      name: "order_followup_date",
      label: " Date ",
      options: {
        filter: false,
        sort: false,

        customBodyRender: (value) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "order_followup_description",
      label: " Comment ",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
    search: false,
    filter: false,
    setRowProps: () => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
    customToolbar: () => {
      return (
        <>
          <ButtonConfigColor
            type="create"
            label="Follow Up"
            onClick={handleClickOpen}
          />
        </>
      );
    },
  };
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "bookingDetails":
      case "customerInfo":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>ID:</strong> {booking.order_ref} ({booking.order_status}
                )
              </Typography>
              <Typography className="text-black">
                <strong>Name:</strong> {booking.order_customer}
              </Typography>
              <Typography className="text-black">
                <strong>Mobile:</strong> {booking.order_customer_mobile}
              </Typography>
              <Typography className="text-black">
                <strong>Alternative Mobile:</strong>{" "}
                {booking.order_customer_alt_mobile}
              </Typography>
              <Typography className="text-black">
                <strong>Email:</strong> {booking.order_customer_email}
              </Typography>
              <Typography className="text-black">
                <strong>Booking Created By:</strong> {booking.created_by}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Date:</strong>{" "}
                {moment(booking.order_date).format("DD-MM-YYYY")}
              </Typography>
              <Typography className="text-black">
                <strong>Service Date:</strong>{" "}
                {moment(booking.order_service_date).format("DD-MM-YYYY")}
              </Typography>
              <Typography className="text-black">
                <strong>Slot Time:</strong> {booking.order_time}
              </Typography>
              <Typography className="text-black">
                <strong>Service:</strong>{" "}
                {booking.order_custom_price <= "1"
                  ? booking.order_service
                  : booking.order_custom}
              </Typography>
              <Typography className="text-black">
                <strong>Booking Confirmed By:</strong> {booking.updated_by}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Sub-service:</strong>{" "}
                {booking.order_custom_price <= "1"
                  ? booking.order_service_sub
                  : ""}
              </Typography>
              <Typography className="text-black">
                <strong>Booked Price:</strong> {booking.order_service_price_for}{" "}
                -{" "}
                {booking.order_custom_price <= "1"
                  ? booking.order_service_price
                  : booking.order_custom_price}
              </Typography>
              <Typography className="text-black">
                <strong>Current Price:</strong>{" "}
                {booking.order_service_price_for} - {booking.order_amount}
              </Typography>
              {booking.order_vendor_id !== null && (
                <Typography className="text-black">
                  <strong>Vendor:</strong> {vendor.vendor_company}
                </Typography>
              )}
            </div>
          </div>
        );
      case "additionalInfo":
      case "location":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Area:</strong> {booking.order_area}
              </Typography>
              <Typography className="text-black">
                <strong>Branch:</strong> {booking.branch_name}
              </Typography>
              <Typography className="text-black">
                <strong>Address:</strong> {booking.order_flat},{" "}
                {booking.order_building}, {booking.order_landmark},{" "}
                {booking.order_address}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Remarks:</strong> {booking.order_remarks}
              </Typography>
              <Typography className="text-black">
                <strong>Advanced:</strong> {booking.order_advance}
              </Typography>
              <Typography className="text-black">
                <strong>Distance:</strong> {booking.order_km} Km
              </Typography>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmitFollowup = (e) => {
    e.preventDefault();
    if (!followups.order_followup_description.trim()) {
      toast.error("Order Follow-up Description is required");
      return;
    }
    setIsButtonDisabled(true);
    const data = {
      order_ref: orderref,
      order_followup_date: followups.order_followup_date,
      order_followup_description: followups.order_followup_description,
    };
    axios
      .post(`${BASE_URL}/api/panel-create-booking-followup`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.code == "200") {
          toast.success(res.data?.msg || "Followup Created Successfully");
          handleClose();
          fetchBookingData();

          setFollowUps({
            order_followup_description: "",
            order_followup_date: moment().format("YYYY-MM-DD"),
          });
        } else {
          toast.error(res.data?.msg || "Network Error");
        }
      })
      .catch((err) => {
        console.error("Error updating Followup", err);
        toast.error("Error updating Followup");
      });
  };
  const autoCommissionCalc =
    Math.round((booking.order_amount * booking.order_comm_percentage) / 100) ||
    0;
  return (
    <Layout>
      <BookingFilter />
      <PageHeader title={"Edit Inspection"} />
      {fetchloading ? (
        <LoaderComponent />
      ) : (
        <div className="flex gap-4 mt-2">
          <div className="flex-grow">
            <div className="mb-2">
              <div className="flex justify-start space-x-4 ">
                {/* Home Deep Cleaning Button */}
                <button
                  onClick={() => setActiveTab("bookingDetails")}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                    activeTab === "bookingDetails"
                      ? "border-blue-500 bg-blue-100 text-blue-600"
                      : "border-transparent hover:bg-blue-50"
                  }`}
                >
                  <FaHome />
                  {booking?.order_service}
                </button>

                <button
                  onClick={() => setActiveTab("additionalInfo")}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                    activeTab === "additionalInfo"
                      ? "border-red-500 bg-red-100 text-red-600"
                      : "border-transparent hover:bg-red-50"
                  }`}
                >
                  <FaInfoCircle />
                  Other Details
                </button>
              </div>

              {/* Main Content Based on Active Tab */}
              <Card className="mt-2">
                <CardBody>{renderActiveTabContent()}</CardBody>
              </Card>
            </div>
            <div>
              <Card className="mb-6">
                <CardHeader floated={false} className="h-12 p-4">
                  <Typography variant="h6" color="blue-gray">
                    Booking Assign
                  </Typography>
                </CardHeader>
                <CardBody>
                  {bookingAssign.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto border-collapse ">
                        <thead>
                          <tr className="bg-gray-200 text-left ">
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">Full Name</span>
                            </th>
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">Start Time</span>
                            </th>
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">
                                On the Way Time
                              </span>
                            </th>
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">End Time</span>
                            </th>
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">Remarks</span>
                            </th>
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">Status</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingAssign.map((dataSumm, key) => (
                            <tr
                              key={key}
                              className="bg-white border-b hover:bg-gray-50"
                            >
                              <td className="p-3 border border-gray-700">
                                <span className="text-gray-900">
                                  {dataSumm.name}
                                </span>
                              </td>
                              <td className="p-3 border border-gray-700">
                                <span className="text-gray-900">
                                  {dataSumm.order_start_time}
                                </span>
                              </td>
                              <td className="p-3 border border-gray-700">
                                <span className="text-gray-900">
                                  {dataSumm.order_way_time}
                                </span>
                              </td>
                              <td className="p-3 border border-gray-700">
                                <span className="text-gray-900">
                                  {dataSumm.order_end_time}
                                </span>
                              </td>
                              <td className="p-3 border border-gray-700">
                                <span className="text-gray-900">
                                  {dataSumm.order_assign_remarks}
                                </span>
                              </td>
                              <td className="p-3 border border-gray-700">
                                <span
                                  className={`${
                                    dataSumm.order_assign_status === "Completed"
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {dataSumm.order_assign_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <h1 className="text-gray-700 text-lg">
                        No Data Available
                      </h1>
                    </div>
                  )}
                </CardBody>
              </Card>
              <Card className="mb-6">
                <CardBody>
                  <MUIDataTable
                    title={"Followup"}
                    data={followup ? followup : []}
                    columns={columns}
                    options={options}
                  />
                </CardBody>
              </Card>
            </div>
            <div>
              {/* Payment Card */}
              <Card className="mb-6">
                {/* here booking assign table  */}
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <Input
                        label="Person Name"
                        name="order_person_name"
                        value={booking.order_person_name}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <Input
                        label="Person Contact No"
                        name="order_person_contact_no"
                        value={booking.order_person_contact_no}
                        onChange={(e) => onInputChange(e)}
                        minLength={10}
                        maxLength={10}
                        onKeyDown={(e) => {
                          if (
                            [
                              "Backspace",
                              "Delete",
                              "Tab",
                              "Escape",
                              "Enter",
                              "ArrowLeft",
                              "ArrowRight",
                              "Home",
                              "End",
                            ].includes(e.key)
                          ) {
                            return;
                          }

                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormControl fullWidth>
                      <InputLabel id="service-select-label">
                        <span className="text-sm relative bottom-[6px]">
                          Booking Status <span className="text-red-700">*</span>
                        </span>
                      </InputLabel>
                      <Select
                        sx={{ height: "40px", borderRadius: "5px" }}
                        labelId="service-select-label"
                        id="service-select"
                        name="order_status"
                        value={booking.order_status}
                        onChange={(e) => onInputChange(e)}
                        label="Booking Status *"
                        required
                      >
                        {status.map((data) => (
                          <MenuItem key={data.value} value={data.value}>
                            {data.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <div>
                      <FormControl fullWidth>
                        <InputLabel id="service-select-label">
                          <span className="text-sm relative bottom-[6px]">
                            Inspection Status{" "}
                            <span className="text-red-700">*</span>
                          </span>
                        </InputLabel>
                        <Select
                          sx={{ height: "40px", borderRadius: "5px" }}
                          labelId="service-select-label"
                          id="service-select"
                          name="order_inspection_status"
                          value={booking.order_inspection_status}
                          onChange={(e) => onInputChange(e)}
                          label="Inspection Status *"
                          required
                        >
                          {Istatus.map((data) => (
                            <MenuItem key={data.value} value={data.value}>
                              {data.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div>
                      <div className="form-group">
                        <Input
                          fullWidth
                          required
                          id="order_service_date"
                          label="Service Date"
                          type="date"
                          disabled
                          labelProps={{
                            className: "!text-gray-600 ",
                          }}
                          min={today}
                          name="order_service_date"
                          value={booking.order_service_date}
                          onChange={(e) => onInputChange(e)}
                        />
                      </div>
                    </div>

                    <div>
                      <div>
                        <FormControl fullWidth>
                          <InputLabel id="order_time-label">
                            <span className="text-sm relative bottom-[6px]">
                              Time Slot<span className="text-red-700">*</span>
                            </span>
                          </InputLabel>
                          <Select
                            sx={{ height: "40px", borderRadius: "5px" }}
                            labelId="order_time-label"
                            id="order_time"
                            name="order_time"
                            key={booking.order_time}
                            value={booking.order_time}
                            onChange={(e) => onInputChange(e)}
                            label="Time Slot *"
                            required
                          >
                            {timeslot?.map((data) => (
                              <MenuItem
                                key={data.value}
                                value={data?.time_slot}
                              >
                                {data?.time_slot}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>

                    {booking?.order_vendor_id !== null && (
                      <>
                        <div className="form-group relative">
                          <Input
                            fullWidth
                            required={booking.order_vendor_id}
                            label="Commission (%)"
                            name="order_comm_percentage"
                            value={booking.order_comm_percentage}
                            onChange={(e) => onInputChange(e)}
                          />
                          <span
                            className="absolute right-2 bottom-2 text-gray-500 cursor-pointer hover:text-blue-500"
                            onClick={() => {
                              setBooking((prev) => ({
                                ...prev,
                                order_comm: autoCommissionCalc,
                              }));
                            }}
                          >
                            (₹{autoCommissionCalc})
                          </span>
                        </div>
                        <div>
                          <div className="form-group">
                            <Input
                              fullWidth
                              required={booking.order_vendor_id}
                              label="Commission Amount"
                              name="order_comm"
                              value={booking.order_comm}
                              onChange={(e) => onInputChange(e)}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <div className="form-group">
                        <Input
                          fullWidth
                          required
                          label="Amount"
                          name="order_amount"
                          value={booking.order_amount}
                          onChange={(e) => onInputChange(e)}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="form-group">
                        <Input
                          fullWidth
                          label="Advance"
                          name="order_advance"
                          value={booking.order_advance}
                          onChange={(e) => onInputChange(e)}
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="form-group">
                        <Input
                          fullWidth
                          label="Comment"
                          multiline
                          name="order_comment"
                          value={booking.order_comment}
                          onChange={(e) => onInputChange(e)}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="form-group">
                        <Input
                          fullWidth
                          label="Paid Amount"
                          name="order_payment_amount"
                          value={booking.order_payment_amount}
                          onChange={(e) => onInputChange(e)}
                        />
                      </div>
                    </div>

                    <div>
                      <FormControl fullWidth>
                        <InputLabel id="service-select-label">
                          <span className="text-sm relative bottom-[6px]">
                            Payment
                          </span>
                        </InputLabel>
                        <Select
                          sx={{ height: "40px", borderRadius: "5px" }}
                          labelId="service-select-label"
                          id="service-select"
                          name="order_payment_type"
                          value={booking.order_payment_type}
                          onChange={(e) => onInputChange(e)}
                          label="Payment Mode *"
                        >
                          {paymentmode.map((data) => (
                            <MenuItem
                              key={data.payment_mode}
                              value={data.payment_mode}
                            >
                              {data.payment_mode}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div className="col-span-2">
                      <div className="form-group">
                        <Input
                          fullWidth
                          label="Transaction Details"
                          name="order_transaction_details"
                          value={booking.order_transaction_details}
                          onChange={(e) => onInputChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4 my-2">
                    <ButtonConfigColor
                      type="edit"
                      buttontype="submit"
                      label="Update"
                      disabled={isButtonDisabled}
                      loading={loading}
                      onClick={onSubmit}
                    />
                    <ButtonConfigColor  
                      type="submit"
                      buttontype="button"
                      label="Reassign"
                      onClick={() => {
                        navigate(`/add-booking-reassign/${id}`);
                      }}
                    />
                    <ButtonConfigColor
                      type="submit"
                      label="Postponed"
                      onClick={() => navigate(`/booking-reschedule/${id}`)}
                    />

                    <ButtonConfigColor
                      type="back"
                      buttontype="button"
                      label="Back"
                      onClick={() => navigate(-1)}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
            <Card className="mb-6">
              <CardBody>
                {loading ? (
                  <div className="flex justify-center items-center h-screen">
                    <Spinner className="h-10 w-10" color="red" />
                  </div>
                ) : (
                  <div className="mt-5">
                    <MUIDataTable
                      title={"Followup"}
                      data={followup ? followup : []}
                      columns={columns}
                      options={options}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent>
          <div className="mb-5">
            <h1 className="font-bold text-xl"> Create Follow Up</h1>
          </div>
          <div className="space-y-4">
            <div>
              <Input
                fullWidth
                label="Order Follow up Date"
                name="order_followup_date"
                value={followups.order_followup_date}
                onChange={(e) => onInputChange(e)}
                type="date"
                disabled
                labelProps={{
                  className: "!text-gray-900",
                }}
                required
              />
            </div>
            <div>
              <Textarea
                type="text"
                fullWidth
                label="Order Follow up"
                name="order_followup_description"
                value={followups.order_followup_description}
                onChange={onInputChange1}
                required
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            className="btn btn-primary text-center md:text-right text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
            type="sumbit"
            onClick={(e) => onSubmitFollowup(e)}
          >
            Submit
          </button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default EditBookingInspection;
