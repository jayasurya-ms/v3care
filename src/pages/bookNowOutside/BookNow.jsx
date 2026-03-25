import { useEffect, useRef, useState } from "react";

import {
  CurrencyRupee,
  Email,
  MiscellaneousServices,
  PinDrop,
  Place
} from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import styles from "../booking/addBooking/AddBooking.module.css";

import { Input } from "@material-tailwind/react";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../public/img/v3logo.png";
import { BASE_URL } from "../../base/BaseUrl";
import Fields from "../../components/addBooking/TextField";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../components/common/PageHeader/PageHeader";

// const REACT_APP_GOOGLE_MAPS_KEY = "AIzaSyB9fQG7AbrrZaqICDY_4E5Prkabmhc-MRo";
const REACT_APP_GOOGLE_MAPS_KEY = "AIzaSyAk4WgZpl2DuYxnfgYLCXEQKvVLK3hJ7S0";

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

const BookNow = () => {
  const autoCompleteRef = useRef(null);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [query1, setQuery1] = useState("");
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;

  const [currentYear, setCurrentYear] = useState("");
  const [booking, setBooking] = useState({
    order_date: todayback,
    order_year: currentYear,
    order_refer_by: "",
    order_customer: "",
    order_customer_mobile: "",
    order_customer_email: "",
    order_service_date: todayback,
    order_service: "",
    order_service_sub: "",
    order_service_price_for: "",
    order_service_price: "",
    order_custom: "",
    order_custom_price: "",
    order_discount: "",
    order_amount: "",
    order_flat: "",
    order_building: "",
    order_landmark: "",
    order_advance: "",
    order_km: "",
    order_time: "",
    order_remarks: "",
    order_comment: "",
    branch_id: "",
    order_area: "",
    order_address: query,
    order_url: query1,
  });
  const [serdata, setSerData] = useState([]);
  const [serdatasub, setSerDataSub] = useState([]);
  const [pricedata, setPriceData] = useState([]);
  const [branch, setBranch] = useState([]);
  const [referby, setReferby] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/fetch-year`, {});

        setCurrentYear(response.data.year.current_year);
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };
    fetchYearData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-out`
        );
        setSerData(response.data.service);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-sub-out/${booking.order_service}`
        );
        setSerDataSub(response.data.servicesub);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchData();
  }, [booking.order_service]);

  const HalfA = (selectedValue) => {
    localStorage.setItem("tempService", selectedValue.target.value);
    let data = {
      order_service: selectedValue.target.value,
      order_service_sub: booking.order_service_sub,
    };

    axios({
      url: BASE_URL + "/api/panel-fetch-service-price-out",
      method: "POST",
      data,
    }).then((res) => {
      setPriceData(res.data.serviceprice);
    });
  };

  const HalfB = (selectedValue) => {
    let data = {
      order_service: localStorage.getItem("tempService"),
      order_service_sub: selectedValue.target.value,
    };
    axios({
      url: BASE_URL + "/api/panel-fetch-service-price-out",
      method: "POST",
      data,
    }).then((res) => {
      setPriceData(res.data.serviceprice);
    });
  };

  const HalfC = (selectedValue) => {
    let data = {
      order_service_price_for: selectedValue.target.value,
    };
    axios({
      url: BASE_URL + "/api/panel-fetch-services-prices-out",
      method: "POST",
      data,
    }).then((res) => {
      setBooking((booking) => ({
        ...booking,
        order_service_price: res.data.serviceprice.service_price_amount,
      }));
      setBooking((booking) => ({
        ...booking,
        order_amount: res.data.serviceprice.service_price_amount,
      }));
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-branch-out`
        );
        setBranch(response.data.branch);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-referby-out`
        );
        setReferby(response.data.referby);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchData();
  }, []);

  const validateOnlyDigits = (input) => /^\d*$/.test(input);
  const validateOnlyNumber = (input) => /^\d*\.?\d*$/.test(input);

  const handleValidatedInputChange = (name, value, validator) => {
    if (validator(value)) {
      setBooking((prevBooking) => {
        if (name === "order_custom_price") {
          return {
            ...prevBooking,
            order_custom_price: value,
            order_amount: value,
          };
        } else {
          return {
            ...prevBooking,
            [name]: value,
          };
        }
      });
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "order_customer_mobile":
      case "order_service_price":
      case "order_amount":
      case "order_advance":
      case "order_pincode":
        handleValidatedInputChange(name, value, validateOnlyDigits);
        break;

      case "order_custom_price":
        handleValidatedInputChange(name, value, validateOnlyDigits);
        break;

      case "order_km":
        handleValidatedInputChange(name, value, validateOnlyNumber);
        break;

      default:
        setBooking((prevBooking) => ({
          ...prevBooking,
          [name]: value,
        }));
    }
  };

  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      {
        componentRestrictions: { country: "IN" },
      }
    );

    autoComplete.addListener("place_changed", () => {
      handlePlaceSelect(updateQuery);
    });
  };

  const handlePlaceSelect = async (updateQuery) => {
    const addressObject = await autoComplete.getPlace();

    const query = addressObject.formatted_address;
    const url = addressObject.url;
    updateQuery(query);

    // var addressComponents = addressObject.address_components;
    // var city = addressComponents.find((component) =>
    //   component.types.includes("locality")
    // );

    // const latLng = {
    //   lat: addressObject?.geometry?.location?.lat(),
    //   lng: addressObject?.geometry?.location?.lng(),
    // };

    setQuery1(url);
    // setSelectedLocation(latLng);
  };

  useEffect(() => {
    window.setupGoogleMaps = () => {
      handleScriptLoad(setQuery, autoCompleteRef);
    };
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_KEY}&libraries=places&loading=async&callback=setupGoogleMaps`,
      () => {} // callback no longer needed via onload if using callback param
    );
  }, []);
  const [timeslot, setTimeSlot] = useState([]);
  useEffect(() => {
    fetch(BASE_URL + "/api/panel-fetch-timeslot-out")
      .then((response) => response.json())
      .then((data) => setTimeSlot(data.timeslot));
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIdniv");

    if (!form.checkValidity()) {
      toast.error("Fill all the fields");
      return;
    }

    setIsButtonDisabled(true);
    setLoading(true); 

    const formData = new FormData();

    Object.keys(booking).forEach((key) => {
      formData.append(key, booking[key]);
    });

    formData.append("order_address", query);
    formData.append("order_url", query1);
    formData.append("order_year", currentYear);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-booking-out`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code == "200") {
        toast.success("Order created Successfully");
        navigate("/");
      } else {
        toast.error("Duplicate Entry");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data");
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 ">
      <div className={styles["main-container-out"]}>
        <div className={styles["sub-container-out"]}>
          <PageHeader title={"Book Now"} />

          <div className="flex justify-center mb-4">
            <img src={logo} alt="logo" className="w-24" />
          </div>
          <form id="addIdniv" onSubmit={onSubmit}>
            <div className={styles["form-container"]}>
              <div>
                <div className="form-group">
                  <Fields
                    title="Refer By"
                    type="dropdown"
                    name="order_refer_by"
                    autoComplete="Name"
                    value={booking.order_refer_by}
                    onChange={(e) => onInputChange(e)}
                    options={referby}
                  />
                </div>
                <div className="form-group">
                  <Fields
                    required="required"
                    title="Customer"
                    type="textField"
                    autoComplete="Name"
                    name="order_customer"
                    value={booking.order_customer}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div>
                  <Input
                    maxLength={10}
                    label="Mobile No"
                    required
                    pattern="^\d{10}$"
                    type="tel"
                    title="Please enter a valid 10-digit mobile number"
                    name="order_customer_mobile"
                    value={booking.order_customer_mobile}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div>
                  <Fields
                    types="email"
                    title="Email"
                    type="textField"
                    autoComplete="Name"
                    name="order_customer_email"
                    value={booking.order_customer_email}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<Email sx={{ color: "red" }} />}
                  />
                </div>
              </div>
              <div className={styles["second-div"]}>
                <div>
                  <Input
                    fullWidth
                    label="Service Date"
                    required
                    id="order_service_date"
                    min={today}
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    autoComplete="Name"
                    name="order_service_date"
                    value={booking.order_service_date}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div>
                  <Fields
                    title="Service"
                    type="serviceDropdown"
                    autoComplete="Name"
                    name="order_service"
                    value={booking.order_service}
                    onChange={(e) => {
                      onInputChange(e), HalfA(e);
                    }}
                    options={serdata}
                  />
                </div>
                {booking.order_service == "23" ? (
                  ""
                ) : serdatasub.length > 0 ? (
                  <div>
                    <Fields
                      title="Service Sub"
                      type="subServiceDropdown"
                      autoComplete="Name"
                      name="order_service_sub"
                      value={booking.order_service_sub}
                      onChange={(e) => {
                        onInputChange(e), HalfB(e);
                      }}
                      options={serdatasub}
                    />
                  </div>
                ) : (
                  ""
                )}
                {booking.order_service == "23" ? (
                  ""
                ) : (
                  <div>
                    <Fields
                      required="required"
                      title="Price For"
                      type="priceforDropdown"
                      autoComplete="Name"
                      name="order_service_price_for"
                      value={booking.order_service_price_for}
                      onChange={(e) => {
                        onInputChange(e), HalfC(e);
                      }}
                      options={pricedata}
                    />
                  </div>
                )}
              </div>
              <div className={styles["custom-service-dev"]}>
                {booking.order_service == "23" && (
                  <>
                    <div>
                      <Fields
                        types="text"
                        title="Custom Service"
                        type="textField"
                        autoComplete="Name"
                        name="order_custom"
                        value={booking.order_custom}
                        onChange={(e) => onInputChange(e)}
                        startIcon={
                          <MiscellaneousServices sx={{ color: "red" }} />
                        }
                      />
                    </div>

                    <div>
                      <Fields
                        types="text"
                        title="Custom Price"
                        type="textField"
                        autoComplete="Name"
                        name="order_custom_price"
                        value={booking.order_custom_price}
                        onChange={(e) => onInputChange(e)}
                        startIcon={<CurrencyRupee sx={{ color: "red" }} />}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className={styles["third-div"]}>
                <div>
                  <Fields
                    required="required"
                    types="text"
                    title="Amount"
                    type="textField"
                    autoComplete="Name"
                    name="order_amount"
                    value={booking.order_amount}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div className="form-group">
                  {/* <Input
                    label="Time Slot"
                    fullWidth
                    required
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    autoComplete="Name"
                    name="order_time"
                    value={booking.order_time}
                    onChange={(e) => onInputChange(e)}
                  /> */}
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
                          <MenuItem key={data.value} value={data?.time_slot}>
                            {data?.time_slot}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>

                <div>
                  <Fields
                    required="required"
                    title="Branch"
                    type="branchDropdown"
                    autoComplete="Name"
                    name="branch_id"
                    value={booking.branch_id}
                    onChange={(e) => onInputChange(e)}
                    options={branch}
                  />
                </div>
                <div>
                  <Fields
                    types="number"
                    title="KM"
                    type="textField"
                    autoComplete="Name"
                    name="order_km"
                    value={booking.order_km}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<PinDrop sx={{ color: "orange" }} />}
                  />
                </div>
              </div>
              <div className="flex justify-center m-4">
                <h1 className="text-2xl font-bold"> Address</h1>
              </div>
              <hr />
              <div className={styles["address-div"]}>
                <div>
                  <Typography variant="small" className={styles["heading"]}>
                    Search Place .. <span style={{ color: "red" }}> *</span>
                  </Typography>
                  <input
                    className={styles["search-div"]}
                    ref={autoCompleteRef}
                    id="order_address"
                    required
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search Places ..."
                    value={query}
                  />
                </div>
              </div>
              <div className={styles["address-first-div"]}>
                <div>
                  <Fields
                    required="required"
                    types="text"
                    title="House #/Flat #/ Plot #"
                    type="textField"
                    autoComplete="Name"
                    name="order_flat"
                    value={booking.order_flat}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<HomeIcon sx={{ color: "green" }} />}
                  />
                </div>
                <div>
                  <Fields
                    required="required"
                    types="text"
                    title="Landmark"
                    type="textField"
                    autoComplete="Name"
                    name="order_landmark"
                    value={booking.order_landmark}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<Place sx={{ color: "green" }} />}
                  />
                </div>
              </div>
              <div className={styles["address-div"]}>
                <div>
                  <Fields
                    types="text"
                    title="Remarks"
                    multiline="multiline"
                    type="textField"
                    autoComplete="Name"
                    fullWidth
                    name="order_remarks"
                    value={booking.order_remarks}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<Place sx={{ color: "green" }} />}
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-6">
                <ButtonConfigColor
                  type="submit"
                  buttontype="submit"
                  label="Submit"
                  disabled={isButtonDisabled}
                  loading={loading}
                />

                <ButtonConfigColor
                  type="back"
                  buttontype="button"
                  label="Cancel"
                  onClick={() => navigate(-1)}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookNow;
