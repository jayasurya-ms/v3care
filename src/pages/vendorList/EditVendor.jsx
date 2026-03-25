import { Input, Textarea } from "@material-tailwind/react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../base/BaseUrl";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../components/common/LoaderComponent";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import Layout from "../../layout/Layout";
import UseEscapeKey from "../../utils/UseEscapeKey";
import CustomInput from "../../components/addVendor/CustomInput";




const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const training = [
  {
    value: "Yes",
    label: "Yes",
  },
  {
    value: "No",
    label: "No",
  },
];



const EditVendor = () => {
  const navigate = useNavigate();

  
  const { id } = useParams();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  UseEscapeKey();

  const [branches, setBranches] = useState([]);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [query, setQuery] = useState("");
  const [localityBook, setLocalityBook] = useState("");
  const [localitySubBook, setLocalitySubBook] = useState("");
  const autoCompleteRef = useRef(null);
  let autoComplete;

 

  
  const loadGoogleMapsScript = (callback) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      callback();
      return;
    }
    window.setupGoogleMaps = () => {
      callback();
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAk4WgZpl2DuYxnfgYLCXEQKvVLK3hJ7S0&libraries=places&loading=async&callback=setupGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  };


  const [vendor, setVendor] = useState({
    vendor_short: "",
    vendor_company: "",
    vendor_members: "",
    vendor_years_experience: "",
    vendor_mobile: "",
    vendor_email: "",
  
    vendor_aadhar_no: "",
    vendor_gst_no: "",
    vendor_images: "",
    vendor_aadhar_front: "",
    vendor_aadhar_back: "",
    vendor_aadhar_gst: "",
    vendor_service_no_count: "",
    vendor_branch_no_count: "",
    vendor_area_no_count: "",
    vendor_status: "",
    branch_id: "",
    vendor_ref_name_1: "",
    vendor_ref_name_2: "",
    vendor_ref_mobile_1: "",
    vendor_ref_mobile_2: "",
    vendor_job_skills: "",
    vendor_training: "",
    vendor_trained_bywhom: "",
    vendor_last_training_date: "",
    vendor_date_of_joining: "",
  });

  const [users, setUsers] = useState([
    {
      id: "",
      vendor_service: "",
      vendor_service_status: "",
    },
  ]);
  const [users1, setUsers1] = useState([
    {
      id: "",
      vendor_branch_flat: "",
      vendor_branch_building: "",
      vendor_branch_landmark: "",
      vendor_branch_location: "",
      vendor_branch_city: "",
      vendor_branch_district: "",
      vendor_branch_state: "",
      vendor_branch_pincode: "",
      vendor_branch_status: "",

vendor_branch_url:"",
vendor_branch_locality:"",
vendor_branch_sub_locality:""
    },
  ]);
  const [users2, setUsers2] = useState([
    {
      id: "",
      vendor_area: "",
      vendor_area_status: "",
    },
  ]);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [selectedFile3, setSelectedFile3] = useState(null);
  const [selectedFile4, setSelectedFile4] = useState(null);
  const [servicess, setServicess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/home");
      return;
    }

    const fetchVendorData = async () => {
      setFetchLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-vendor-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setVendor(response.data.vendor);
        setUsers(response.data.vendorService);
        setUsers1(response.data.vendorbranch);
        setUsers2(response.data.vendorArea);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setServicess(response.data.service);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);
useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    fetch(BASE_URL + "/api/panel-fetch-branch", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const mappedOptions = data.branch.map((item) => ({
          value: item.id,
          label: item.branch_name,
        }));
        setBranches(mappedOptions);
      });
  }, []);

  const validateOnlyDigits = (inputtxt) => {
    const phoneno = /^\d+$/;
    return phoneno.test(inputtxt) || inputtxt.length === 0;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "vendor_mobile" ||
        name === "vendor_gst_no" ||
        name == "vendor_aadhar_no" ||
        name === "vendor_ref_mobile_1" ||
        name === "vendor_years_experience" ||
        name === "vendor_members" ||
        name === "vendor_ref_mobile_2") &&
      !validateOnlyDigits(value)
    ) {
      return;
    }
    setVendor({ ...vendor, [name]: value });
  };

  const onChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      index === i ? { ...user, [e.target.name]: e.target.value } : user
    );
    setUsers(updatedUsers);
  };

  const onChange1 = (e, index) => {
    const updatedUsers = users1.map((user, i) =>
      index === i ? { ...user, [e.target.name]: e.target.value } : user
    );
    setUsers1(updatedUsers);
  };
  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    if (!autoCompleteRef.current) return;
  
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
  
    let subLocality = "";
    let locality = "";
    addressObject.address_components.forEach((component) => {
      if (component.types.includes("sublocality_level_1")) {
        subLocality = component.short_name;
      }
      if (component.types.includes("locality")) {
        locality = component.short_name;
      }
    });
  
    setUsers1((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[0] = {
        ...updatedUsers[0],
        vendor_branch_url: url,
        vendor_branch_locality: locality,
        vendor_branch_sub_locality: subLocality,
      };
      return updatedUsers;
    });
  
    setLocalitySubBook(subLocality);
    setLocalityBook(locality);
  };
  
  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (autoCompleteRef.current) {
        handleScriptLoad(setQuery, autoCompleteRef);
      }
    });
  }, [loadGoogleMapsScript]);
    
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const form = document.getElementById("addIndiv");

    if (!form.checkValidity()) {
      toast.error("Fill all required");
    } else {

      const formData = new FormData();
Object.keys(vendor).forEach((key) => {
  const value = vendor[key] ?? "";
  formData.append(key, value);
});

      if (selectedFile1) formData.append("vendor_images", selectedFile1);
      if (selectedFile2) formData.append("vendor_aadhar_front", selectedFile2);
      if (selectedFile3) formData.append("vendor_aadhar_back", selectedFile3);
      if (selectedFile4) formData.append("vendor_aadhar_gst", selectedFile4);

      users.forEach((user, index) => {
        Object.keys(user).forEach((key) => {
          formData.append(`vendor_service_data[${index}][${key}]`, user[key]);
        });
      });

      users1.forEach((user, index) => {
        Object.keys(user).forEach((key) => {
          formData.append(`vendor_branch_data[${index}][${key}]`, user[key]);
        });
      });

      users2.forEach((user, index) => {
        Object.keys(user).forEach((key) => {
          formData.append(`vendor_area_data[${index}][${key}]`, user[key]);
        });
      });

      try {
        const response = await axios.post(
          `${BASE_URL}/api/panel-update-vendor/${id}?_method=PUT`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.code == "200") {
          toast.success(response.data?.msg || "Data Updated Successfully");
          navigate(`/vendor-list?page=${pageNo}`);
        } else {
          if (response.data.code == "401") {
            toast.error(response.data?.msg || "Company Short Duplicate Entry");
          } else if (response.data.code == "402") {
            toast.error(response.data?.msg || "Mobile No Duplicate Entry");
          } else {
            toast.error(response.data?.msg || "Email Id Duplicate Entry");
          }
        }
      } catch (error) {
        console.error("Error updating vendor:", error);
        toast.error("Error updating vendor");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title={"Edit Vendor"}
          label2={
            <ButtonConfigColor
              type="create"
              label="Add Vendor Service"
              onClick={() => navigate(`/add-vendor-service/${id}`)}
            />
          }
        />
      </div>
      {fetchloading ? (
        <LoaderComponent />
      ) : (
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Personal Details</h2>
          <hr className="mb-4" />

          <form onSubmit={onSubmit} id="addIndiv" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Input
                  label="Nick Name"
                  type="text"
                  name="vendor_short"
                  value={vendor.vendor_short}
                  onChange={onInputChange}
                  className="w-full border border-gray-700 rounded-md p-2"
                />
              </div>

              {/* Company */}
              <div>
                <Input
                  label="Company"
                  type="text"
                  name="vendor_company"
                  value={vendor.vendor_company}
                  onChange={onInputChange}
                  className="w-full border border-gray-700 rounded-md p-2"
                  required
                />
              </div>

              {/* Mobile No */}
              <div>
                <Input
                  label="Mobile No"
                  type="text"
                  name="vendor_mobile"
                  maxLength={10}
                  minLength={10}
                  value={vendor.vendor_mobile}
                  onChange={onInputChange}
                  className="w-full border border-gray-700 rounded-md p-2"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Input
                  label="Email"
                  type="email"
                  name="vendor_email"
                  value={vendor.vendor_email}
                  onChange={onInputChange}
                  className="w-full border border-gray-700 rounded-md p-2"
                  required
                />
              </div>

              {/* Aadhar No */}
              <div>
                <Input
                  label="Aadhar No"
                  type="text"
                  name="vendor_aadhar_no"
                  maxLength={12}
                  minLength={12}
                  value={vendor.vendor_aadhar_no}
                  onChange={onInputChange}
                  className="w-full border border-gray-700 rounded-md p-2"
                  required
                />
              </div>

              {/* GST No */}
              <div>
                <Input
                  label="Gst No"
                  type="text"
                  name="vendor_gst_no"
                  maxLength={15}
                  value={vendor.vendor_gst_no}
                  onChange={onInputChange}
                  className="w-full border border-gray-700 rounded-md p-2"
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <Input
                  label="Photo"
                  type="file"
                  name="vendor_images"
                  onChange={(e) => setSelectedFile1(e.target.files[0])}
                  className="w-full border border-gray-700 rounded-md p-2"
                />
                <small>{vendor.vendor_images}</small>
              </div>

              <div>
                <Input
                  label="  Aadhar Card Front Side"
                  type="file"
                  name="vendor_documents"
                  onChange={(e) => setSelectedFile2(e.target.files[0])}
                  className="w-full border border-gray-700 rounded-md p-2"
                />
                <small>{vendor.vendor_aadhar_front}</small>
              </div>

              <div>
                <label className="block text-gray-700 mb-1"></label>
                <Input
                  label=" Aadhar Card Back Side"
                  type="file"
                  name="vendor_certificates"
                  onChange={(e) => setSelectedFile3(e.target.files[0])}
                  className="w-full border border-gray-700 rounded-md p-2"
                />
                <small>{vendor.vendor_aadhar_back}</small>
              </div>

              <div>
                <Input
                  label="GST Certificate"
                  type="file"
                  name="vendor_license"
                  onChange={(e) => setSelectedFile4(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <small>{vendor.vendor_aadhar_gst}</small>
              </div>
            </div>

            {/* Reference Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <Input
                  label="Reference Name 1"
                  type="text"
                  name="vendor_ref_name_1"
                  value={vendor.vendor_ref_name_1}
                  onChange={(e) => onInputChange(e)}
                  className="w-full border border-gray-700 rounded-md p-2"
                  maxLength={80}
                />
              </div>

              <div>
                <Input
                  label="Reference Mobile 1"
                  type="text"
                  name="vendor_ref_mobile_1"
                  value={vendor.vendor_ref_mobile_1}
                  onChange={(e) => onInputChange(e)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  maxLength={10}
                />
              </div>

              <div>
                <Input
                  label="Reference Name 2"
                  type="text"
                  name="vendor_ref_name_2"
                  value={vendor.vendor_ref_name_2}
                  onChange={(e) => onInputChange(e)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  maxLength={80}
                />
              </div>

              <div>
                <Input
                  label="Reference Mobile 2"
                  type="text"
                  name="vendor_ref_mobile_2"
                  maxLength={10}
                  value={vendor.vendor_ref_mobile_2}
                  onChange={(e) => onInputChange(e)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>



            <div className="my-3 grid grid-cols-4 gap-4">
            <div className=" col-span-1 md:col-span-3">
              <Textarea
                label="Job Skills"
                name="vendor_job_skills"
                value={vendor.vendor_job_skills}
                onChange={(e) => onInputChange(e)}
              />
</div>
<div className="flex flex-col   justify-between">
<Input
                 label="Members"
                  type="text"
                  name="vendor_members"
                  value={vendor.vendor_members}
                  onChange={onInputChange}
                  className="w-full border border-gray-700 rounded-md p-2"
                  required
                />

<Input
                label="Vendor Experience (in Yrs)"
                  type="text"
                  name="vendor_years_experience"
                  value={vendor.vendor_years_experience}
                  onChange={onInputChange}
                  className="w-full border border-gray-700 rounded-md p-2"
                  required
                />
            </div>
            </div>



            <div className="my-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              <FormControl fullWidth>
                <InputLabel id="vendor_training-label">
                  <span className="text-sm relative bottom-[6px]">
                    Training Completed
                    <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="vendor_training-label"
                  id="vendor_training"
                  name="vendor_training"
                  value={vendor.vendor_training}
                  onChange={(e) => onInputChange(e)}
                  label="Training Completed"
                >
                  {training.map((item) => (
                    <MenuItem key={item.value} value={String(item.value)}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>{" "}
              <Input
                label="Trained By whom"
                name="vendor_trained_bywhom"
                value={vendor.vendor_trained_bywhom}
                onChange={(e) => onInputChange(e)}
              />
              <Input
                type="date"
                label="Training Date"
                name="vendor_last_training_date"
                value={vendor.vendor_last_training_date}
                onChange={(e) => onInputChange(e)}
              />
              <Input
                type="date"
                label="Date of joining"
                name="vendor_date_of_joining"
                value={vendor.vendor_date_of_joining}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            {/* Status */}
<div className="flex flex-row items-center gap-4">
            <FormControl fullWidth >
              <InputLabel id="service-select-label">
                <span className="text-sm relative bottom-[6px]">
                  Status cc <span className="text-red-700">*</span>
                </span>
              </InputLabel>
              <Select
                sx={{ height: "40px", borderRadius: "5px" }}
                labelId="service-select-label"
                id="service-select"
                name="vendor_status"
                value={vendor.vendor_status}
                onChange={onInputChange}
                label="Status *"
                required
              >
                {statusOptions.map((data) => (
                  <MenuItem key={data.value} value={data.value}>
                    {data.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth >
              <InputLabel id="branch-id-label">
                <span className="text-sm relative bottom-[6px]">
                  Branch <span className="text-red-700">*</span>
                </span>
              </InputLabel>
              <Select
                sx={{ height: "40px", borderRadius: "5px" }}
                labelId="branch-id-label"
                id="branch-id-label"
                name="branch_id"
                value={vendor.branch_id}
                onChange={(e) => {
                  setVendor((prevVendor) => ({
                    ...prevVendor,
                    branch_id: e.target.value || "",
                  }));
                }}
                label="Status *"
                required
              >
                {branches.map((data) => (
                  <MenuItem key={data.value} value={data.value}>
                    {data.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </div>
            {/* service details and adress details  */}
            <h1 className="text-xl font-semibold mb-4 mt-3">Service Details</h1>
            <hr className="border-gray-300 mb-4" />
            {users.map((user, index) => (
              <div
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
                key={index}
              >
                <div className="col-span-3">
                  <FormControl fullWidth>
                    <InputLabel id="service-select-label">
                      <span className="text-sm relative bottom-[6px]">
                        Service <span className="text-red-700">*</span>
                      </span>
                    </InputLabel>
                    <Select
                      sx={{ height: "40px", borderRadius: "5px" }}
                      labelId="service-select-label"
                      id="service-select"
                      name="vendor_service"
                      value={user.vendor_service}
                      onChange={(e) => onChange(e, index)}
                      label="Service *"
                      required
                    >
                      {servicess.map((servicessdata, key) => (
                        <MenuItem key={key} value={servicessdata.service}>
                          {servicessdata.service}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <input
                    type="hidden"
                    name="id"
                    value={user.id}
                    onChange={(e) => onChange(e, index)}
                  />
                </div>
                <div>
                  <FormControl fullWidth>
                    <InputLabel id="service-select-label">
                      <span className="text-sm relative bottom-[6px]">
                        Status <span className="text-red-700">*</span>
                      </span>
                    </InputLabel>
                    <Select
                      sx={{ height: "40px", borderRadius: "5px" }}
                      labelId="service-select-label"
                      id="service-select"
                      name="vendor_service_status"
                      required
                      value={user.vendor_service_status}
                      onChange={(e) => onChange(e, index)}
                      label="Status *"
                    >
                      {statusOptions.map((data) => (
                        <MenuItem key={data.value} value={data.value}>
                          {data.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            ))}
            <h1 className="text-xl font-semibold mb-4">Address Details</h1>
            <hr className="border-gray-300 mb-4" />
            {users1.map((user, index) => (
              <div
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
                key={index}
              >
                <div>
                  <Input
                    label="House/Flat/Plot"
                    type="text"
                    name="vendor_branch_flat"
                    value={user.vendor_branch_flat}
                    onChange={(e) => onChange1(e, index)}
                    className="w-full border border-gray-700 rounded-md p-2"
                    maxLength={500}
                  />
                  <input
                    type="hidden"
                    name="id"
                    value={user.id}
                    onChange={(e) => onChange1(e, index)}
                  />
                </div>
                <div>
                  <Input
                    label="Apartment Building"
                    type="text"
                    name="vendor_branch_building"
                    value={user.vendor_branch_building}
                    onChange={(e) => onChange1(e, index)}
                    className="w-full border border-gray-700 rounded-md p-2"
                    maxLength={500}
                  />
                </div>
                <div>
                  <Input
                    label="Landmark"
                    type="text"
                    name="vendor_branch_landmark"
                    value={user.vendor_branch_landmark}
                    onChange={(e) => onChange1(e, index)}
                    className="w-full border border-gray-700 rounded-md p-2"
                    maxLength={500}
                  />
                </div>
                <div>
                  <Input
                    label="Street/Location/Village"
                    type="text"
                    name="vendor_branch_location"
                    value={user.vendor_branch_location}
                    required
                    disabled
                    onChange={(e) => onChange1(e, index)}
                    className="w-full border border-gray-700 rounded-md p-2"
                    labelProps={{
                      className: "!text-gray-600 ",
                    }}
                  />
                </div>
                <div>
                  <Input
                    label="City"
                    type="text"
                    name="vendor_branch_city"
                    required
                    disabled
                    value={user.vendor_branch_city}
                    onChange={(e) => onChange1(e, index)}
                    className="w-full border border-gray-700 rounded-md p-2"
                    labelProps={{
                      className: "!text-gray-600 ",
                    }}
                  />
                </div>
                <div>
                  <Input
                    label="District"
                    type="text"
                    name="vendor_branch_district"
                    required
                    disabled
                    value={user.vendor_branch_district}
                    onChange={(e) => onChange1(e, index)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    labelProps={{
                      className: "!text-gray-600 ",
                    }}
                  />
                </div>
                <div>
                  <Input
                    label="State"
                    type="text"
                    name="vendor_branch_state"
                    required
                    disabled
                    value={user.vendor_branch_state}
                    onChange={(e) => onChange1(e, index)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    labelProps={{
                      className: "!text-gray-600 ",
                    }}
                  />
                </div>
                <div>
                  <Input
                    label="Pincode"
                    type="text"
                    name="vendor_branch_pincode"
                    required
                    disabled
                    value={user.vendor_branch_pincode}
                    onChange={(e) => onChange1(e, index)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    labelProps={{
                      className: "!text-gray-600 ",
                    }}
                  />
                </div>
                <div>
                  <FormControl fullWidth>
                    <InputLabel id="service-select-label">
                      <span className="text-sm relative bottom-[6px]">
                        Status <span className="text-red-700">*</span>
                      </span>
                    </InputLabel>
                    <Select
                      sx={{ height: "40px", borderRadius: "5px" }}
                      labelId="service-select-label"
                      id="service-select"
                      name="vendor_branch_status"
                      value={user.vendor_branch_status}
                      onChange={(e) => onChange1(e, index)}
                      label="Status *"
                      required
                    >
                      {statusOptions.map((data) => (
                        <MenuItem key={data.value} value={String(data.value)}>
                          {data.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            ))}
                      


<div>
  <h1 className="text-xl font-semibold mb-4">Location</h1>
  {users1[0]?.vendor_branch_url && !showLocationInput && (
    <div className="mb-4 flex items-center gap-2">
      <a
        href={users1[0]?.vendor_branch_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        View Location on Map
      </a>
      <ButtonConfigColor
        type="edit"
        label="Change Location"
        onClick={() => setShowLocationInput(true)}
      />
    </div>
  )}
  {showLocationInput && (
    <div className="mb-4">
      <CustomInput
     label="Search Place..."
  type="text"
  ref={autoCompleteRef}
  placeholder="Search Place..."
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  className="w-full border border-gray-700 rounded-md p-2"
/>
      <div className="mt-2">
        <ButtonConfigColor
          type="back"
          label="Cancel"
          onClick={() => setShowLocationInput(false)}
        />
      </div>
    </div>
  )}
</div>

            <div className="flex justify-center space-x-4 my-2">
              <ButtonConfigColor
                type="edit"
                buttontype="submit"
                label="Update"
                loading={loading}
              />

              <ButtonConfigColor
                type="back"
                buttontype="button"
                label="Cancel"
                onClick={() => navigate(-1)}
              />
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default EditVendor;
