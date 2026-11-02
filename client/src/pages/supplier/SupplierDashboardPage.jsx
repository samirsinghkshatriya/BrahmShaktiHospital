import React, { useState, useEffect } from 'react';
import {
  Truck,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  IndianRupee,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const SupplierDashboardPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/suppliers/orders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderNumber, status) => {
    try {
      const res = await api.put(`/suppliers/orders/${orderNumber}/status`, { status });
      if (res.data.success) {
        toast.success(`Purchase order ${orderNumber} updated to ${status}`);
        fetchOrders();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-secondary to-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs text-accent font-bold uppercase tracking-wider">
            Hospital Procurement & Supply Chain
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Supplier Portal ({user?.name || 'MedEquip Supplies'})
          </h2>
          <p className="text-xs text-slate-200">
            Track purchase orders, confirm dispatch, and monitor delivery to Brahm Shakti Central Medical Stores.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20">
          <Truck className="w-5 h-5 text-accent" />
          <div className="text-xs">
            <span className="text-slate-300 block text-[10px]">Vendor Code</span>
            <strong className="text-white">SUP-BSH-018</strong>
          </div>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-medical-border">
          <div>
            <h3 className="text-base font-bold text-secondary">Assigned Hospital Purchase Orders</h3>
            <p className="text-xs text-medical-muted">Purchase requisitions authorized by Brahm Shakti Hospital Administration.</p>
          </div>
          <span className="text-xs font-bold text-primary">{orders.length} Orders</span>
        </div>

        {loading ? (
          <div className="h-48 rounded-xl bg-medical-coolgray animate-shimmer"></div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-xs text-medical-muted">No purchase orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">PO Number</th>
                  <th className="py-3 px-4 font-bold">Items & Quantities</th>
                  <th className="py-3 px-4 font-bold">Total Order Value</th>
                  <th className="py-3 px-4 font-bold">Order / Expected Date</th>
                  <th className="py-3 px-4 font-bold">Shipment Status</th>
                  <th className="py-3 px-4 font-bold text-right">Update Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {orders.map((po) => (
                  <tr key={po.orderNumber} className="hover:bg-medical-coolgray/50">
                    <td className="py-3 px-4 font-bold text-primary">
                      {po.orderNumber}
                      <span className="block text-[10px] text-medical-muted font-normal">{po.supplierName}</span>
                    </td>
                    <td className="py-3 px-4">
                      {po.items?.map((item, i) => (
                        <div key={i} className="text-xs font-medium text-secondary">
                          • {item.productName} ({item.quantity} units)
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 font-black text-secondary text-sm">
                      ₹{po.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-medical-muted">
                      <div>Issued: {po.orderDate}</div>
                      <div className="text-primary font-semibold">Due: {po.expectedDelivery}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          po.status === 'Delivered'
                            ? 'bg-green-100 text-status-success'
                            : po.status === 'Dispatched'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {po.status === 'Pending' && (
                        <button
                          onClick={() => handleUpdateStatus(po.orderNumber, 'Confirmed')}
                          className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold hover:bg-blue-600 hover:text-white"
                        >
                          Confirm Order
                        </button>
                      )}
                      {po.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(po.orderNumber, 'Dispatched')}
                          className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-bold hover:bg-amber-600 hover:text-white"
                        >
                          Dispatch
                        </button>
                      )}
                      {po.status === 'Dispatched' && (
                        <button
                          onClick={() => handleUpdateStatus(po.orderNumber, 'Delivered')}
                          className="px-2.5 py-1 rounded bg-green-50 text-status-success font-bold hover:bg-status-success hover:text-white"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboardPage;
