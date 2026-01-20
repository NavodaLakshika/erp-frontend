// api/invoice.ts
import api from "./axios";

export const getInvoices = () => api.get("/pos/invoices");

// Update this to accept ALL required fields in snake_case
export const createInvoice = (data: {
  customer_id: number;
  created_user_id: number;
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
    product_id: number;
    quantity: number;
    unit_price: number;
  }
) => api.post(`/pos/invoice/${invoiceId}/add-item`, data);

export const sendInvoice = (invoiceId: number) =>
  api.post(`/pos/invoice/${invoiceId}/send`);