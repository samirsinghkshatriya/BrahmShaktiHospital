import PurchaseOrder from '../models/PurchaseOrder.js';
import { isMongoConnected } from '../config/db.js';
import { purchaseOrdersData } from '../data/seedData.js';

let inMemoryOrders = [...purchaseOrdersData];

export const getPurchaseOrders = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (isMongoConnected) {
      let filter = {};
      if (status && status !== 'all') filter.status = status;
      if (req.user && req.user.role === 'supplier') {
        filter.supplierEmail = req.user.email;
      }

      const orders = await PurchaseOrder.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: orders.length, data: orders });
    }

    let filtered = [...inMemoryOrders];
    if (status && status !== 'all') filtered = filtered.filter(o => o.status === status);
    if (req.user && req.user.role === 'supplier') {
      filtered = filtered.filter(o => o.supplierEmail === req.user.email);
    }

    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

export const createPurchaseOrder = async (req, res, next) => {
  try {
    const { supplierName, supplierEmail, items = [], expectedDelivery } = req.body;

    if (!supplierName || !items.length) {
      return res.status(400).json({ success: false, message: 'Supplier name and at least one item are required.' });
    }

    const totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitCost)), 0);
    const orderNumber = `PO-BSH-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = {
      orderNumber,
      supplierId: `SUP-${Math.floor(10 + Math.random() * 90)}`,
      supplierName,
      supplierEmail: supplierEmail || 'supplier@brahmshaktihospital.com',
      items: items.map(i => ({
        productName: i.productName,
        quantity: Number(i.quantity),
        unitCost: Number(i.unitCost),
        totalCost: Number(i.quantity) * Number(i.unitCost)
      })),
      totalAmount,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: expectedDelivery || '2026-11-15',
      deliveryAddress: 'Central Medical Stores, Brahm Shakti Hospital, Budh Vihar, New Delhi - 110085',
      status: 'Pending',
      paymentTerms: '30 Days Net from Delivery'
    };

    if (isMongoConnected) {
      const created = await PurchaseOrder.create(newOrder);
      return res.status(201).json({ success: true, message: 'Purchase order created', data: created });
    }

    inMemoryOrders.unshift({ ...newOrder, _id: `po-${Date.now()}` });
    return res.status(201).json({ success: true, message: 'Purchase order created', data: inMemoryOrders[0] });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isMongoConnected) {
      const updated = await PurchaseOrder.findOneAndUpdate(
        { $or: [{ orderNumber: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { status },
        { new: true }
      );
      if (updated) return res.status(200).json({ success: true, message: 'Order status updated', data: updated });
    }

    const idx = inMemoryOrders.findIndex(o => o.orderNumber === id || o._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Order not found' });
    inMemoryOrders[idx].status = status;
    return res.status(200).json({ success: true, message: 'Order status updated', data: inMemoryOrders[idx] });
  } catch (error) {
    next(error);
  }
};
