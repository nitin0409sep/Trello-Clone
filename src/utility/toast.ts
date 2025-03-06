import toast from "react-hot-toast";

export const showToast = (type: string, msg: string) => {
  switch (type) {
    case "success":
      toast.success(msg);
      return;
    case "error":
      toast.error(msg);
      return;
    default:
      toast.error(msg);
  }
};
