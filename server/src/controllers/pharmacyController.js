import PharmacyProduct from '../models/PharmacyProduct.js';
import { isMongoConnected } from '../config/db.js';
import { pharmacyProductsData } from '../data/seedData.js';

let inMemoryPharmacy = [...pharmacyProductsData];

export const getPharmacyProducts = async (req, res, next) => {
  try {
    const { category, search, stockStatus, requiresPrescription, sortBy, sortOrder = 'asc' } = req.query;

    if (isMongoConnected) {
      let filter = {};
      if (category && category !== 'all') filter.category = category;
      if (stockStatus) filter.status = stockStatus;
      if (requiresPrescription !== undefined) {
        filter.requiresPrescription = requiresPrescription === 'true';
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { genericName: { $regex: search, $options: 'i' } },
          { manufacturer: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }

      let sort = { name: 1 };
      if (sortBy === 'price') {
        sort = { price: sortOrder === 'desc' ? -1 : 1 };
      } else if (sortBy === 'stock') {
        sort = { stock: sortOrder === 'desc' ? -1 : 1 };
      }

      const products = await PharmacyProduct.find(filter).sort(sort);
      return res.status(200).json({ success: true, count: products.length, data: products });
    }

    let filtered = [...inMemoryPharmacy];
    if (category && category !== 'all') filtered = filtered.filter(p => p.category === category);
    if (stockStatus) filtered = filtered.filter(p => p.status === stockStatus);
    if (requiresPrescription !== undefined) {
      filtered = filtered.filter(p => String(p.requiresPrescription) === requiresPrescription);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.genericName.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price') {
      filtered.sort((a, b) => sortOrder === 'desc' ? b.price - a.price : a.price - b.price);
    } else if (sortBy === 'stock') {
      filtered.sort((a, b) => sortOrder === 'desc' ? b.stock - a.stock : a.stock - b.stock);
    }

    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

export const getPharmacyProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const product = await PharmacyProduct.findOne({
        $or: [{ productId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (product) return res.status(200).json({ success: true, data: product });
    }

    const product = inMemoryPharmacy.find(p => p.productId === id || p._id === id);
    if (!product) return res.status(404).json({ success: false, message: 'Medicine product not found' });
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createPharmacyProduct = async (req, res, next) => {
  try {
    const { name, genericName, category, manufacturer, dosage, price, stock, requiresPrescription, batchNo, expiryDate, description } = req.body;

    if (!name || !genericName || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, generic name, category, and price are required.' });
    }

    const productId = `MED-${Math.floor(100 + Math.random() * 900)}`;
    const newProduct = {
      productId,
      name,
      genericName,
      category,
      manufacturer: manufacturer || 'Standard Pharmaceuticals',
      dosage: dosage || 'Standard Formulation',
      price: Number(price),
      stock: Number(stock) || 0,
      minThreshold: req.body.minThreshold || 20,
      requiresPrescription: requiresPrescription !== undefined ? Boolean(requiresPrescription) : true,
      batchNo: batchNo || `BATCH-${Date.now().toString().slice(-4)}`,
      expiryDate: expiryDate || '2028-12-31',
      description: description || '',
      image: req.body.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
      status: Number(stock) > 20 ? 'In Stock' : (Number(stock) > 0 ? 'Low Stock' : 'Out of Stock')
    };

    if (isMongoConnected) {
      const created = await PharmacyProduct.create(newProduct);
      return res.status(201).json({ success: true, message: 'Pharmacy product added', data: created });
    }

    inMemoryPharmacy.unshift({ ...newProduct, _id: `med-${Date.now()}` });
    return res.status(201).json({ success: true, message: 'Pharmacy product added', data: inMemoryPharmacy[0] });
  } catch (error) {
    next(error);
  }
};

export const updatePharmacyProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const updated = await PharmacyProduct.findOneAndUpdate(
        { $or: [{ productId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        req.body,
        { new: true }
      );
      if (updated) return res.status(200).json({ success: true, message: 'Product updated', data: updated });
    }

    const idx = inMemoryPharmacy.findIndex(p => p.productId === id || p._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
    inMemoryPharmacy[idx] = { ...inMemoryPharmacy[idx], ...req.body };
    return res.status(200).json({ success: true, message: 'Product updated', data: inMemoryPharmacy[idx] });
  } catch (error) {
    next(error);
  }
};

export const recordDispenseSale = async (req, res, next) => {
  try {
    const { items, patientName, prescriptionVerified } = req.body;
    // items: [{ productId, quantity }]

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'At least one item is required for dispense.' });
    }

    if (isMongoConnected) {
      for (const item of items) {
        await PharmacyProduct.findOneAndUpdate(
          { productId: item.productId },
          { $inc: { stock: -Number(item.quantity) } }
        );
      }
    } else {
      items.forEach(item => {
        const prod = inMemoryPharmacy.find(p => p.productId === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - Number(item.quantity));
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Medication dispensed successfully and stock adjusted.',
      patientName,
      prescriptionVerified: Boolean(prescriptionVerified)
    });
  } catch (error) {
    next(error);
  }
};

export const getPharmacyAlerts = async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const alerts = await PharmacyProduct.find({ stock: { $lte: 25 } }).sort({ stock: 1 });
      return res.status(200).json({ success: true, count: alerts.length, data: alerts });
    }

    const alerts = inMemoryPharmacy.filter(p => p.stock <= 25).sort((a, b) => a.stock - b.stock);
    return res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    next(error);
  }
};
