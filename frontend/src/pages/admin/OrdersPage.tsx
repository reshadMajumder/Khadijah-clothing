import React, { useState, useEffect } from 'react';
import { Check, Trash2, CalendarClock } from 'lucide-react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';

// Mock Data - Remove when connecting to Firebase
import { mockOrders, mockProducts } from '../../data/mockData';

interface Order {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  products: {
    product_id: string;
    size: string;
    quantity: number;
  }[];
  total_price_bdt: number;
  status: string;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<{[id: string]: Product}>({});
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Fetch orders and products
  useEffect(() => {
    // In a real implementation, fetch from Firebase
    // const fetchOrders = async () => {
    //   try {
    //     const ordersCollection = collection(db, 'orders');
    //     const ordersSnapshot = await getDocs(ordersCollection);
    //     const ordersList = ordersSnapshot.docs.map(doc => ({
    //       id: doc.id,
    //       ...doc.data()
    //     })) as Order[];
    //     setOrders(ordersList);
    //   } catch (error) {
    //     console.error('Error fetching orders:', error);
    //   }
    // };
    
    // const fetchProducts = async () => {
    //   try {
    //     const productsCollection = collection(db, 'products');
    //     const productsSnapshot = await getDocs(productsCollection);
    //     const productsMap: {[id: string]: Product} = {};
    //     productsSnapshot.docs.forEach(doc => {
    //       productsMap[doc.id] = {
    //         id: doc.id,
    //         title: doc.data().title,
    //         image: doc.data().image,
    //         price: doc.data().price
    //       };
    //     });
    //     setProducts(productsMap);
    //   } catch (error) {
    //     console.error('Error fetching products:', error);
    //   }
    // };
    
    // Promise.all([fetchOrders(), fetchProducts()])
    //   .finally(() => setLoading(false));

    // Using mock data for now
    setOrders(mockOrders);
    
    const productsMap: {[id: string]: Product} = {};
    mockProducts.forEach(product => {
      productsMap[product.id] = {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price
      };
    });
    setProducts(productsMap);
    
    setLoading(false);
  }, []);

  const markAsSold = async (orderId: string) => {
    try {
      // In a real implementation, update in Firebase
      // await updateDoc(doc(db, 'orders', orderId), {
      //   status: 'Sold'
      // });
      
      // Update locally for demo
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'Sold' } : order
        )
      );
      
      toast.success('Order marked as sold');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      // In a real implementation, delete from Firebase
      // await deleteDoc(doc(db, 'orders', orderId));
      
      // Remove locally for demo
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Manage Orders</h1>
      
      {loading ? (
        <div className="bg-teal-900 rounded-lg p-6 animate-pulse">
          <div className="h-8 bg-teal-800 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-24 bg-teal-800 rounded"></div>
            ))}
          </div>
        </div>
      ) : orders.length > 0 ? (
        <div className="bg-teal-900 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-teal-800">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Order ID</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Total</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <React.Fragment key={order.id}>
                      <tr 
                        className="border-b border-teal-800/50 hover:bg-teal-800/20 cursor-pointer"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <td className="py-3 px-4 text-white">{order.id.slice(0, 8)}...</td>
                        <td className="py-3 px-4 text-white">{order.name}</td>
                        <td className="py-3 px-4 text-gray-300">{formatDate(order.created_at)}</td>
                        <td className="py-3 px-4 text-white">৳ {order.total_price_bdt.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            order.status === 'Pending' 
                              ? 'bg-amber-900/30 text-amber-400' 
                              : 'bg-green-900/30 text-green-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                            {order.status === 'Pending' && (
                              <button
                                onClick={() => markAsSold(order.id)}
                                className="p-1.5 bg-green-900/30 text-green-400 rounded-md hover:bg-green-900/50 transition-colors"
                                title="Mark as Sold"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="p-1.5 bg-red-900/30 text-red-400 rounded-md hover:bg-red-900/50 transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Order Details */}
                      {expandedOrder === order.id && (
                        <tr>
                          <td colSpan={6} className="py-3 px-4 bg-teal-800/20">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-1">Customer Details</h4>
                                <p className="text-white">{order.name}</p>
                                <p className="text-gray-300">{order.address}</p>
                                <p className="text-gray-300">{order.phone_number}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-1">Order Date</h4>
                                <div className="flex items-center text-gray-300">
                                  <CalendarClock size={16} className="mr-1" />
                                  {formatDate(order.created_at)}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-1">Order Status</h4>
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  order.status === 'Pending' 
                                    ? 'bg-amber-900/30 text-amber-400' 
                                    : 'bg-green-900/30 text-green-400'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Products</h4>
                            <div className="space-y-3">
                              {order.products.map((item, index) => {
                                const product = products[item.product_id];
                                return product ? (
                                  <div key={index} className="flex items-center bg-teal-800/30 p-2 rounded-md">
                                    <div className="w-12 h-12 bg-teal-800 rounded-md overflow-hidden flex-shrink-0">
                                      <img 
                                        src={product.image} 
                                        alt={product.title} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="ml-3 flex-grow">
                                      <p className="text-white">{product.title}</p>
                                      <div className="flex items-center text-sm text-gray-300">
                                        <span>Size: {item.size}</span>
                                        <span className="mx-2">•</span>
                                        <span>Qty: {item.quantity}</span>
                                        <span className="mx-2">•</span>
                                        <span>Price: ৳ {product.price.toLocaleString()}</span>
                                      </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-white font-medium">
                                        ৳ {(product.price * item.quantity).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div key={index} className="flex items-center bg-teal-800/30 p-2 rounded-md">
                                    <p className="text-gray-400">Product not found (ID: {item.product_id})</p>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="flex justify-end mt-4">
                              <div className="text-right">
                                <p className="text-gray-300">Order Total</p>
                                <p className="text-xl font-bold text-white">
                                  ৳ {order.total_price_bdt.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-teal-900 rounded-lg p-8 text-center">
          <div className="mb-4">
            <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
          <p className="text-gray-400">
            When customers place orders, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;