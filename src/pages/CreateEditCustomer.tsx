import { useEffect, useState } from "react";
import {
  createCustomer,
  getCustomers,
  type Customer,
  getUserId,
} from "../api/customers";
import api from "../api/axios";

interface CreateEditCustomerProps {
  goBack: () => void;
}

const CreateEditCustomer = ({ goBack }: CreateEditCustomerProps) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    address: "",
    telephone: "",
    email: "",
    description: "",
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD CUSTOMERS ---------------- */
  const loadCustomers = async () => {
    try {
      const res = await getCustomers(1, 10);
      setCustomers(res.data.data);
    } catch (err) {
      console.error("Failed to load customers", err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  /* ---------------- INPUT HANDLER ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- CREATE / UPDATE ---------------- */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (editingId) {
        // UPDATE
        await api.patch(`/pos/customer/${editingId}`, {
          first_name: form.first_name,
          last_name: form.last_name,
          address: form.address,
          telephone: form.telephone,
          description: form.description,
          updated_by: getUserId(),
        });
      } else {
        // CREATE
        await createCustomer({
          first_name: form.first_name,
          last_name: form.last_name,
          address: form.address,
          telephone: form.telephone,
          description: form.description,
        });
      }

      setForm({
        first_name: "",
        last_name: "",
        address: "",
        telephone: "",
        email: "",
        description: "",
      });
      setEditingId(null);
      loadCustomers();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EDIT CUSTOMER ---------------- */
  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setForm({
      first_name: customer.first_name,
      last_name: customer.last_name,
      address: customer.address || "",
      telephone: customer.telephone || "",
      email: "",
      description: customer.description || "",
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">

      {/* TOP BAR */}
      <div className="w-full max-w-2xl bg-[#D0D0D0] rounded-full flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
        <button onClick={goBack} className="flex items-center gap-2 font-medium">
          <img src="/Polygon.png" className="w-4 h-4" />
          POS
        </button>

        <span className="font-bold text-xl">Create / Edit Customer</span>

        <button className="opacity-50 flex items-center gap-2">
          POS <img src="/Polygon 2.png" className="w-4 h-4" />
        </button>
      </div>

      {/* FORM */}
      <div className="w-full max-w-2xl bg-[#D0D0D0] rounded-2xl p-6 mb-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="h-9 rounded-full px-4"
          />
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="h-9 rounded-full px-4"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            rows={5}
            className="rounded-xl px-4 py-3"
          />
          <div className="flex flex-col gap-4">
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="h-9 rounded-full px-4"
            />
            <input
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              placeholder="Phone"
              className="h-9 rounded-full px-4"
            />
          </div>
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full rounded-xl px-4 py-3 mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-32 h-10 bg-gradient-to-b from-[#0E7A2A] to-[#064C18] text-white rounded-full ml-auto block"
        >
          {editingId ? "UPDATE" : "ADD"}
        </button>
      </div>

      {/* TABLE */}
      <div className="w-full max-w-2xl bg-[#2F2F2F] rounded-xl p-6">
        <div className="overflow-y-auto max-h-80">
          <table className="min-w-full text-gray-200 text-sm">
            <thead className="bg-[#3A3A3A] sticky top-0">
              <tr>
                <th className="px-4 py-2">First</th>
                <th className="px-4 py-2">Last</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Credit</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => handleEdit(c)}
                  className="hover:bg-[#3B3B3B] cursor-pointer"
                >
                  <td className="px-4 py-2">{c.first_name}</td>
                  <td className="px-4 py-2">{c.last_name}</td>
                  <td className="px-4 py-2">{c.address}</td>
                  <td className="px-4 py-2">{c.telephone}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">{c.description}</td>
                  <td className="px-4 py-2">
                    {c.created_at
                      ? new Date(c.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-right">0.00</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateEditCustomer;
