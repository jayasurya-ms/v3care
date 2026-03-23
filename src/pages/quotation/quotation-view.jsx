import axios from "axios";
import { Mail, Phone, Printer } from "lucide-react";
import moment from "moment";
import { toWords } from "number-to-words";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import stamplogo from "../../../public/stamplogo.png";
import { BASE_URL } from "../../base/BaseUrl";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import Layout from "../../layout/Layout";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";

const QuatationView = () => {
  const containerRef = useRef();
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");
  const [showLogo, setShowLogo] = useState(true);
  const [emailLoading, setEmailLoading] = useState(false);
  const fetchBooking = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-quotation-by-id/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFormData(response.data);
    } catch (err) {
      toast.error("Failed to load booking");
    }
  };
  useEffect(() => {
    fetchBooking();
  }, [id]);
  const quotation = formData?.quotation || {};
  const quotationSub = formData?.quotationSub || [];
  const company = formData?.company || {};
  const subTotal = quotationSub.reduce(
    (sum, item) => sum + Number(item?.quotationSub_amount || 0),
    0,
  );

  const cgst = Number(quotation.quotation_cgst) || 0;
  const sgst = Number(quotation.quotation_sgst) || 0;
  const igst = Number(quotation.quotation_igst) || 0;

  const cgstAmount = (subTotal * cgst) / 100;
  const sgstAmount = (subTotal * sgst) / 100;
  const igstAmount = (subTotal * igst) / 100;

  const grandTotal = subTotal + cgstAmount + sgstAmount + igstAmount;

  const amountInWords =
    toWords(Math.round(grandTotal)).replace(/\b\w/g, (c) => c.toUpperCase()) +
    " Rupees Only";

  const sendQuotationEmail = async () => {
    try {
      if (!id) {
        toast.error("Invalid quotation ID");
        return;
      }

      const email = quotation?.quotation_customer_email;

      if (!email) {
        toast.error("Customer email is missing");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format");
        return;
      }

      setEmailLoading(true);

      const response = await axios.get(
        `${BASE_URL}/api/panel-send-quotation-email/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // ✅ Check API custom response
      if (response?.data?.code === 200) {
        toast.success(response?.data?.msg || "Email sent successfully");
      } else {
        toast.error(response?.data?.msg || "Failed to send email");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while sending email");
    } finally {
      setEmailLoading(false);
    }
  };
  return (
    <Layout>
      <div className="relative">
        <PageHeader
          title="Quotation View"
          label2={
            <div className="flex gap-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  className="w-4 h-4"
                />
                Show Stamp
              </label>

              <ReactToPrint
                trigger={() => <ButtonConfigColor type="print" label="Print" />}
                content={() => containerRef.current}
                documentTitle="Quatation"
                pageStyle={`
  @page {
    size: A4;
    margin: 4mm;
  }

  @media print {
    body {
      margin: 4mm;
      -webkit-print-color-adjust: exact;
    }

    table {
      page-break-inside: avoid;
    }

    tr {
      page-break-inside: avoid;
    }
  }
`}
              />
              <ButtonConfigColor
                type="email"
                label="Send Email"
                onClick={sendQuotationEmail}
                loading={emailLoading}
              />
            </div>
          }
        />

        <div className="relative mt-4">
          <div className="bg-gray-100 max-w-4xl mx-auto px-4 py-2 rounded-md">
            <div ref={containerRef}>
              <div className="grid grid-cols-3 items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    {company?.company_name || ""}
                  </h1>
                  <p className="text-sm"></p>
                  <p className="text-xs">{company?.company_address || ""}</p>
                  <p className="flex items-center gap-4 text-xs flex-wrap">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {company?.company_mobile || ""}
                    </span>

                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {company?.company_other_email || ""}
                    </span>
                  </p>
                </div>
                <div className="flex justify-center">
                  <h2 className="text-xl font-bold">Quotation</h2>
                </div>
                <div className="flex flex-col items-end text-xs">
                  <p className="font-semibold">PAN No: BVHPK7881A</p>
                  <p className="font-semibold">GST No: 29AAQFG1234A1Z5</p>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold">To,</p>
                  <p className="text-sm font-bold">
                    {quotation.quotation_customer || ""}
                  </p>
                  <p className="text-xs max-w-[15rem] break-all whitespace-pre-wrap">
                    {quotation.quotation_customer_address || ""}
                  </p>
                  <p className="text-xs">
                    {quotation.quotation_customer_mobile || ""}
                    {quotation.quotation_customer_alt_mobile
                      ? `,${quotation.quotation_customer_alt_mobile}`
                      : ""}
                    {quotation.quotation_customer_email
                      ? `,${quotation.quotation_customer_email}`
                      : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <span className="font-semibold">Quotation No:</span>{" "}
                    {quotation.quotation_no || ""}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Ref:</span>{" "}
                    {quotation.quotation_ref || ""}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Date:</span>{" "}
                    {quotation.quotation_date
                      ? moment(quotation.quotation_date).format("DD-MM-YYYY")
                      : ""}
                  </p>
                  {quotation.quotation_valid_date && (
                    <p className="text-sm">
                      <span className="font-semibold">Valid Until:</span>{" "}
                      {/* {formatDate(quotation.quotation_valid_date)} */}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm mb-2">Dear Sir/Mam,</p>
              <p className="text-sm mb-6">
                Thank you for your valuable inquiry. We are pleased to quote as
                below:
              </p>

              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left py-2 px-2 text-sm font-bold">
                      SL
                    </th>
                    <th className="text-left py-2 px-2 text-sm font-bold">
                      DESCRIPTION
                    </th>
                    <th className="text-right py-2 px-2 text-sm font-bold">
                      PRICE
                    </th>
                    <th className="text-right py-2 px-2 text-sm font-bold">
                      QTY
                    </th>

                    <th className="text-right py-2 px-2 text-sm font-bold">
                      TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quotationSub?.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b border-gray-300"
                    >
                      <td className="py-3 px-2 text-sm align-top">
                        {index + 1}
                      </td>
                      <td className="py-3 px-2 text-sm align-top">
                        <div className="font-semibold">
                          {item.quotationSub_heading || "N/A"}
                        </div>
                        <div className="text-xs text-gray-600">
                          {item.quotationSub_description}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-right align-top">
                        <div>{item.quotationSub_rate}</div>
                      </td>
                      <td className="py-3 px-2 text-sm text-right align-top">
                        {item.quotationSub_qnty || "0"}
                      </td>
                      <td className="py-3 px-2 text-sm text-right align-top">
                        {item.quotationSub_amount || "0"}{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between mb-6">
                <div>
                  <div className="flex">
                    <p className="font-bold text-sm mb-2">Amount In Words :</p>
                    <p className="text-sm mb-2 ml-2">{amountInWords || ""}</p>
                  </div>
                  <div className="mb-8">
                    <p className="font-bold text-sm mb-2">
                      Terms & Conditions:
                    </p>
                    <p className="text-xs mb-3">
                      {quotation.quotation_payment_terms
                        ?.split(".")
                        .filter((line) => line.trim() !== "")
                        .map((line, index) => (
                          <span key={index} className="block">
                            {index + 1}) {line.trim()}.
                          </span>
                        ))}
                    </p>

                    <p className="font-bold text-sm mb-2">Bank Details:</p>
                    <p className="text-xs mb-1">{company.company_name || ""}</p>
                    <p className="text-xs mb-1">
                      A/C : {company.company_account_no || ""}
                    </p>
                    <p className="text-xs mb-1">
                      IFSC: {company.company_ifsc_code || ""}
                    </p>
                  </div>
                </div>
                <div className="w-64 ml-auto">
                  {/* TOTAL */}
                  <div className="flex justify-between py-2 border-t-2 border-black">
                    <span className="font-bold text-sm">TOTAL</span>
                    <span className="font-bold text-sm">
                      ₹ {subTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 text-sm">
                    <span>CGST ({cgst}%)</span>
                    <span>₹ {cgstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between py-1 text-sm">
                    <span>SGST ({sgst}%)</span>
                    <span>₹ {sgstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between py-1 text-sm">
                    <span>IGST ({igst}%)</span>
                    <span>₹ {igstAmount.toFixed(2)}</span>
                  </div>

                  {/* GRAND TOTAL */}
                  <div className="flex justify-between py-2 border-t border-black mt-1">
                    <span className="font-bold text-sm">GRAND TOTAL</span>
                    <span className="font-bold text-sm">
                      ₹ {grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end mt-12 mb-4 text-right">
                <p className="text-sm font-semibold mb-6">
                  For, {company?.company_name || ""}
                </p>
                <div className="min-h-[120px]  flex justify-end items-center">
                  {showLogo && (
                    <img
                      src={stamplogo}
                      alt="Company Stamp"
                      className="w-28 h-auto object-contain"
                    />
                  )}
                </div>
                <p className="text-xs font-medium tracking-wide">
                  AUTHORIZED SIGNATURE
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </Layout>
  );
};

export default QuatationView;
