import api from "./axios";

export const getInvoices = () => api.get("/pos/invoices");

export const createInvoice = (data: {
  customer_id: number;
  status?: string;
  previous_invoice_id?: number | null;
  paid_amount?: number;
  total_amount: number;
  discount_type?: string;
  discount_amount?: number;
  box_quantity?: number;
}) => api.post("/pos/invoice", data);



export const addInvoiceItem = (
  invoiceId: number,
  data: {
    stock_id: number;
    quantity: number;
    selling_price?: number;
    discount_type?: string;
    discount_amount?: number;
  }
) => api.post(`/pos/invoice/${invoiceId}/item`, data);

export const sendInvoice = (invoiceId: number) =>
  api.patch(`/pos/invoice/${invoiceId}`, {
    status: "SENT"
  });

export const getInvoiceById = (id: number) => {
  return api.get(`/pos/invoice/${id}`);
};

