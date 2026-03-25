import {
  IconButton,
  Textarea,
  Typography,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../base/BaseUrl";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import Layout from "../../layout/Layout";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import { OutlinedInput, TextareaAutosize, TextField } from "@mui/material";
const QuotationForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(null);

  const isEdit = mode === "edit";
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    branch_id: "",
    quotation_date: new Date().toISOString().split("T")[0],
    order_ref: "",
    quotation_customer: "",
    quotation_customer_mobile: "",
    quotation_customer_alt_mobile: "",
    quotation_customer_email: "",
    quotation_customer_address: "",
    quotation_payment_terms: "",
    quotation_cgst: "0",
    quotation_sgst: "0",
    quotation_igst: "18",
    sub: [
      {
        id: "",
        quotationSub_heading: "",
        quotationSub_description: "",
        quotationSub_rate: "",
        quotationSub_qnty: "",
        quotationSub_amount: "",
      },
    ],
  });
  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      sub: [
        ...prev.sub,
        {
          id: "",
          quotationSub_heading: "",
          quotationSub_description: "",
          quotationSub_rate: "",
          quotationSub_qnty: "",
          quotationSub_amount: "",
        },
      ],
    }));
  };

  const removeRow = (index) => {
    const row = formData.sub[index];

    if (row.id) {
      setSelectedDeleteIndex(index);
      setOpenDeleteDialog(true);
    } else {
      setFormData((prev) => ({
        ...prev,
        sub: prev.sub.filter((_, i) => i !== index),
      }));
    }
  };
  useEffect(() => {
    if (!id || !mode) return;

    if (isEdit) {
      fetchQuotation();
    } else {
      fetchBooking();
    }
  }, [id, mode]);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-booking-by-id/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const booking = response.data?.booking;

      setFormData((prev) => ({
        ...prev,
        branch_id: booking.branch_id,
        order_ref: booking.order_ref,
        quotation_customer: booking.order_customer,
        quotation_customer_mobile: booking.order_customer_mobile,
        quotation_customer_alt_mobile: booking.order_customer_alt_mobile || "",
        quotation_customer_email: booking.order_customer_email || "",
        quotation_customer_address: booking.order_address,
        quotation_payment_terms: booking.quotation_payment_terms,
        quotation_cgst: booking.quotation_cgst,
        quotation_sgst: booking.quotation_sgst,
        quotation_igst: booking.quotation_igst,
      }));
    } catch (err) {
      toast.error("Failed to load quotation");
    }
  };

  const fetchQuotation = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-quotation-by-id/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data?.quotation;

      setFormData({
        branch_id: data.branch_id,
        quotation_date: data.quotation_date,
        order_ref: data.order_ref,
        quotation_customer: data.quotation_customer,
        quotation_customer_mobile: data.quotation_customer_mobile,
        quotation_customer_alt_mobile: data.quotation_customer_alt_mobile || "",
        quotation_customer_email: data.quotation_customer_email || "",
        quotation_customer_address: data.quotation_customer_address,
        quotation_payment_terms: data.quotation_payment_terms,
        quotation_cgst: data.quotation_cgst,
        quotation_sgst: data.quotation_sgst,
        quotation_igst: data.quotation_igst,
        sub: response?.data?.quotationSub || [],
      });
    } catch (err) {
      toast.error("Failed to load quotation");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "quotation_customer_mobile" ||
      name == "quotation_customer_alt_mobile"
    ) {
      if (!/^\d{0,10}$/.test(value)) return;
    }
    if (
      name === "quotation_cgst" ||
      name === "quotation_sgst" ||
      name === "quotation_igst"
    ) {
      if (!/^\d*\.?\d{0,2}$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData.sub];
    if (name === "quotationSub_rate" || name === "quotationSub_qnty") {
      updated[index][name] = value.replace(/[^0-9.]/g, "");
    } else {
      updated[index][name] = value;
    }
    const rate = Number(updated[index].quotationSub_rate || 0);
    const qty = Number(updated[index].quotationSub_qnty || 0);
    updated[index].quotationSub_amount = rate * qty;

    setFormData({ ...formData, sub: updated });
  };
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    formData.sub.forEach((row, index) => {
      if (!row.quotationSub_heading?.trim()) {
        newErrors[`heading_${index}`] = "Heading is required";
        isValid = false;
      }

      if (!row.quotationSub_qnty || Number(row.quotationSub_qnty) <= 0) {
        newErrors[`qty_${index}`] = "Quantity is required";
        isValid = false;
      }

      if (!row.quotationSub_amount || Number(row.quotationSub_amount) <= 0) {
        newErrors[`rate_${index}`] = "Rate is Required";
        isValid = false;
      }
      if (!row.quotationSub_amount || Number(row.quotationSub_amount) <= 0) {
        newErrors[`amount_${index}`] = "Amount must be greater than 0";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields in items");
      return;
    }
    const payload = {
      branch_id: formData.branch_id,
      quotation_date: formData.quotation_date,
      order_ref: formData.order_ref,
      quotation_customer: formData.quotation_customer,
      quotation_customer_mobile: formData.quotation_customer_mobile,
      quotation_customer_alt_mobile: formData.quotation_customer_alt_mobile,
      quotation_customer_email: formData.quotation_customer_email,
      quotation_customer_address: formData.quotation_customer_address,
      quotation_payment_terms: formData.quotation_payment_terms,
      quotation_cgst: formData.quotation_cgst,
      quotation_sgst: formData.quotation_sgst,
      quotation_igst: formData.quotation_igst,
      sub: formData.sub.map((item) => ({
        id: item.id,
        quotationSub_heading: item.quotationSub_heading,
        quotationSub_description: item.quotationSub_description,
        quotationSub_rate: item.quotationSub_rate,
        quotationSub_qnty: item.quotationSub_qnty,
        quotationSub_amount: item.quotationSub_amount,
      })),
    };

    try {
      const token = localStorage.getItem("token");

      const url = isEdit
        ? `${BASE_URL}/api/panel-update-quotation/${id}`
        : `${BASE_URL}/api/panel-create-quotation`;

      const method = isEdit ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code == 200) {
        toast.success(
          response.data.msg
            ? response.data.msg
            : isEdit
              ? "Quotation Updated uccessfully"
              : "Quotation Created uccessfully",
        );
        navigate("/quotation-list");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const confirmDelete = async () => {
    if (selectedDeleteIndex === null) return;

    const row = formData.sub[selectedDeleteIndex];

    try {
      const token = localStorage.getItem("token");
      if (row.id) {
        const response = await axios.delete(
          `${BASE_URL}/api/panel-delete-quotation-sub/${row.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.code !== 200) {
          toast.error(response.data.msg || "Deleted Sucessfully");
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        sub: prev.sub.filter((_, i) => i !== selectedDeleteIndex),
      }));

      setOpenDeleteDialog(false);
      setSelectedDeleteIndex(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <PageHeader title={isEdit ? "Edit Quotation" : "Create Quotation"} />
      <div className="p-6 bg-white rounded shadow mt-4">
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  gap-4 mb-6">
            <TextField
              label="Quotation Date"
              type="date"
              name="quotation_date"
              value={formData.quotation_date}
              onChange={handleChange}
              required
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Order Ref"
              name="order_ref"
              value={formData.order_ref}
              disabled
              required
              size="small"
              fullWidth
            />

            <TextField
              label="Customer Name"
              name="quotation_customer"
              value={formData.quotation_customer}
              onChange={handleChange}
              required
              size="small"
              fullWidth
            />

            <TextField
              label="Mobile"
              name="quotation_customer_mobile"
              value={formData.quotation_customer_mobile}
              onChange={handleChange}
              required
              size="small"
              fullWidth
              type="number"
              min={0}
              maxLength={10}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <TextField
              label="Alternative Mobile"
              name="quotation_customer_alt_mobile"
              value={formData.quotation_customer_alt_mobile}
              onChange={handleChange}
              size="small"
              fullWidth
            />

            <TextField
              label="Email"
              name="quotation_customer_email"
              value={formData.quotation_customer_email}
              onChange={handleChange}
              size="small"
              type="email"
              fullWidth
            />
            <TextField
              label="CGST"
              name="quotation_cgst"
              value={formData.quotation_cgst}
              onChange={handleChange}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="SGST"
              name="quotation_sgst"
              value={formData.quotation_sgst}
              onChange={handleChange}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="IGST"
              name="quotation_igst"
              value={formData.quotation_igst}
              onChange={handleChange}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Textarea
                label="Address"
                required
                name="quotation_customer_address"
                value={formData.quotation_customer_address}
                onChange={handleChange}
              />
            </div>
            <div>
              <Textarea
                label="Payment Terms"
                name="quotation_payment_terms"
                value={formData.quotation_payment_terms}
                onChange={handleChange}
              />
            </div>
          </div>

          <table className="w-full table-fixed text-left border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 w-[25%]">
                  <Typography variant="small" className="font-bold">
                    Heading
                  </Typography>
                </th>

                <th className="border p-3 w-[35%]">
                  <Typography variant="small" className="font-bold">
                    Description
                  </Typography>
                </th>

                <th className="border p-3 w-[10%] text-center">
                  <Typography variant="small" className="font-bold">
                    Qty
                  </Typography>
                </th>

                <th className="border p-3 w-[10%] text-center">
                  <Typography variant="small" className="font-bold">
                    Rate
                  </Typography>
                </th>

                <th className="border p-3 w-[10%] text-center">
                  <Typography variant="small" className="font-bold">
                    Amount
                  </Typography>
                </th>

                <th className="border p-3 w-[10%] text-center">
                  <Typography variant="small" className="font-bold">
                    Action
                  </Typography>
                </th>
              </tr>
            </thead>

            <tbody>
              {formData.sub.map((item, index) => (
                <tr key={index} className="border-b">
                  {/* Heading */}
                  <td className="border p-2">
                    {/* <Input
                      className="w-full appearance-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                      name="quotationSub_heading"
                      value={item.quotationSub_heading}
                      onChange={(e) => handleSubChange(index, e)}
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    /> */}
                    <OutlinedInput
                      name="quotationSub_heading"
                      value={item.quotationSub_heading}
                      onChange={(e) => handleSubChange(index, e)}
                      size="small"
                      sx={{ width: "100%" }}
                    />
                  </td>

                  {/* Description */}
                  <td className="border p-2">
                    {/* <TextareaAutosize
                      name="quotationSub_description"
                      value={item.quotationSub_description}
                      onChange={(e) => handleSubChange(index, e)}
                      rows={2}
                      className="w-full min-h-[60px] appearance-none !border border-gray-400 rounded-lg"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    /> */}
                    <OutlinedInput
                      name="quotationSub_description"
                      value={item.quotationSub_description}
                      onChange={(e) => handleSubChange(index, e)}
                      multiline
                      minRows={2}
                      fullWidth
                      size="small"
                    />
                  </td>

                  {/* Qty */}
                  <td className="border p-2">
                    {/* <Input
                      name="quotationSub_qnty"
                      value={item.quotationSub_qnty}
                      onChange={(e) => handleSubChange(index, e)}
                      className="!w-24 appearance-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    /> */}
                    <OutlinedInput
                      name="quotationSub_qnty"
                      value={item.quotationSub_qnty}
                      onChange={(e) => handleSubChange(index, e)}
                      size="small"
                      inputProps={{
                        inputMode: "decimal",
                      }}
                    />
                  </td>

                  {/* Rate */}
                  <td className="border p-2 items-center">
                    {/* <Input
                      name="quotationSub_rate"
                      value={item.quotationSub_rate}
                      onChange={(e) => handleSubChange(index, e)}
                      className="!w-28 appearance-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    /> */}

                    <OutlinedInput
                      name="quotationSub_rate"
                      value={item.quotationSub_rate}
                      onChange={(e) => handleSubChange(index, e)}
                      size="small"
                      inputProps={{
                        inputMode: "decimal",
                      }}
                    />
                  </td>

                  {/* Amount */}
                  <td className="border p-2">
                    <Input
                      value={item.quotationSub_amount}
                      disabled
                      className="!w-24"
                    />
                  </td>

                  {/* Action */}
                  <td className="border p-2">
                    <div className="flex gap-2 justify-center">
                      {item.id ? (
                        <>
                          <IconButton
                            type="button"
                            size="sm"
                            color="red"
                            disabled={formData.sub.length <= 1}
                            onClick={() => removeRow(index)}
                          >
                            <FiTrash2 size={18} />
                          </IconButton>

                          {index === formData.sub.length - 1 && (
                            <IconButton
                              type="button"
                              size="sm"
                              color="green"
                              onClick={addRow}
                            >
                              <FiPlus size={18} />
                            </IconButton>
                          )}
                        </>
                      ) : (
                        <>
                          {index === formData.sub.length - 1 && (
                            <IconButton
                              type="button"
                              size="sm"
                              color="green"
                              onClick={addRow}
                            >
                              <FiPlus size={18} />
                            </IconButton>
                          )}

                          {formData.sub.length > 1 && (
                            <IconButton
                              type="button"
                              size="sm"
                              color="red"
                              onClick={() => removeRow(index)}
                            >
                              <FiMinus size={18} />
                            </IconButton>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center space-x-4">
            {isEdit ? (
              <ButtonConfigColor
                type="submit"
                buttontype="edit"
                label="Update"
              />
            ) : (
              <ButtonConfigColor
                type="submit"
                buttontype="submit"
                label="Submit"
              />
            )}

            <ButtonConfigColor
              type="back"
              buttontype="button"
              label="Cancel"
              onClick={() => navigate(-1)}
            />
          </div>
        </form>
      </div>
      <Dialog open={openDeleteDialog} handler={setOpenDeleteDialog}>
        <DialogHeader>Confirm Delete</DialogHeader>

        <DialogBody>Are you sure you want to delete this row?</DialogBody>

        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>

          <Button variant="gradient" color="red" onClick={confirmDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default QuotationForm;
