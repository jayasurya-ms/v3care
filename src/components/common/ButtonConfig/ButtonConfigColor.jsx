import React from "react";
import { BiLogOut } from "react-icons/bi";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaCheck,
  FaPrint,
  FaRegEye,
  FaEnvelope,
} from "react-icons/fa";
import { FiDownload, FiLoader } from "react-icons/fi";

const ButtonConfigColor = ({
  type,
  label,
  onClick,
  disabled,
  loading,
  className,
  buttontype,
}) => {
  const getButtonStyles = () => {
    switch (type) {
      case "submit":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "back":
        return "bg-gray-500 hover:bg-gray-600 text-white";
      case "create":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "edit":
        return "bg-[#B22222] hover:bg-[#A14141] text-white";
      case "delete":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "print":
        return "bg-blue-600 hover:bg-red-700 text-white";
      case "download":
        return "bg-blue-600 hover:bg-red-700 text-white";
      case "view":
        return "bg-blue-600 hover:bg-red-700 text-white";
      case "logout":
        return "bg-blue-600 hover:bg-red-700 text-white";
      case "email":
        return "bg-green-600 hover:bg-green-700 text-white";
      default:
        return "bg-blue-400 hover:bg-blue-500 text-white";
    }
  };

  const getIcon = () => {
    if (loading) return <FiLoader className="animate-spin text-lg" />;
    switch (type) {
      case "submit":
        return <FaCheck />;
      case "back":
        return <FaArrowLeft />;
      case "create":
        return <FaPlus />;
      case "edit":
        return <FaEdit />;
      case "delete":
        return <FaTrash />;
      case "print":
        return <FaPrint />;
      case "download":
        return <FiDownload />;
      case "view":
        return <FaRegEye />;
      case "logout":
        return <BiLogOut />;
      case "email":
        return <FaEnvelope />;
      default:
        return null;
    }
  };

  return (
    <button
      type={buttontype}
      className={`px-4 py-2 rounded-lg transition-all duration-300 ${getButtonStyles()} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className || ""}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <div className="flex items-center justify-center gap-2 text-sm">
        {getIcon()}
        <span className="whitespace-nowrap">{label}</span>
      </div>
    </button>
  );
};

export default ButtonConfigColor;
