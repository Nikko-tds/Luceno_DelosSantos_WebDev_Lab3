export interface Customer {
  customer_id: string;
  customer_name: string;
  city: string | null;
  membership_level: string | null;
}

export interface Product {
  product_id: string;
  product_name: string;
  category: string | null;
  unit_price: number;
}

export interface Order {
  order_id: string;
  customer_id: string;
  order_date: string;
  shipping_city: string | null;
}

export interface OrderItem {
  order_id: string;
  product_id: string;
  quantity: number;
  discount: number;
}

export interface Vendor {
  vendor_id: string;
  vendor_name: string;
  city: string | null;
}

export interface Supply {
  vendor_id: string;
  product_id: string;
  stock_quantity: number;
}