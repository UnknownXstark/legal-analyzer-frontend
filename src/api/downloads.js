import apiClient from "./axios";

export const downloadDocument = async (id) => {
  return await apiClient.get(`/api/documents/${id}/download/`, {
    responseType: "blob", // REQUIRED for PDF
  });
};
