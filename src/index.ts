import express from 'express';
import dotenv from 'dotenv';

import customersRouter from './customersRoutes';
import productsRouter from './productsRoutes';
import ordersRouter from './ordersRoutes';
import orderItemsRouter from './orderItemsRoutes';
import vendorsRouter from './vendorsRoutes';
import suppliesRouter from './suppliesRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/order-items', orderItemsRouter);
app.use('/api/v1/vendors', vendorsRouter);
app.use('/api/v1/supplies', suppliesRouter);

app.get('/', (req, res) => {
  res.send('E-Commerce & Logistics API is running');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});