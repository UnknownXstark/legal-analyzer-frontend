export const formatDate = (iso) => {
  if (!iso) return "N/A";

  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
