import React, { useState, useEffect, useRef } from 'react';
import { Check, Trash2, CalendarClock, ShoppingBag, Edit, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../data/ApiUrl';
import { useAuth } from '../../context/AuthContext';

interface Size {
  id: string;
  size: string;
}

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  image: string;
  image_url: string | null;
}

interface Product {
  id: string;
  title: string;
  images: ProductImage[];
  price: number;
  category: Category;
  size: Size[];
}

interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  size?: Size;
}

interface Order {
  id: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  items: OrderItem[];
  total_price: number;
  is_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

const OrdersPage: React.FC = () => {
  const { authTokens } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    is_confirmed: false
  });
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, [authTokens]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/orders/`, {
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      if (data.status && data.data) {
        setOrders(data.data);
      } else {
        console.error('Unexpected API response:', data);
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (order: Order) => {
    setEditingOrder(order);
    setEditForm({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address,
      is_confirmed: order.is_confirmed
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditForm(prev => ({ ...prev, [name]: checked }));
  };

  const closeModal = () => {
    setShowEditModal(false);
    setEditingOrder(null);
  };

  const updateOrder = async () => {
    if (!editingOrder) return;
    
    setIsUpdating(editingOrder.id);
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/orders/${editingOrder.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
      
      const data = await response.json();
      
      // Update the order in state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === editingOrder.id ? { ...order, ...editForm } : order
        )
      );
      
      closeModal();
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setIsUpdating(null);
    }
  };

  const toggleOrderConfirmation = async (orderId: string, currentStatus: boolean) => {
    setIsUpdating(orderId);
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/orders/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_confirmed: !currentStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      // Update the order in state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, is_confirmed: !currentStatus } : order
        )
      );
      
      toast.success(`Order ${!currentStatus ? 'confirmed' : 'marked as pending'} successfully`);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    setIsUpdating(orderId);
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/orders/${orderId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      
      // Remove from state
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      setExpandedOrder(null);
      
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    } finally {
      setIsUpdating(null);
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

  const printOrder = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order.id.slice(0, 8)} - Khadijah</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #333;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .customer-info {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 20px;
            }
            .product-list {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .product-list th {
              background-color: #f5f5f5;
              text-align: left;
              padding: 10px;
              border-bottom: 2px solid #ddd;
            }
            .product-list td {
              padding: 10px;
              border-bottom: 1px solid #ddd;
            }
            .total {
              text-align: right;
              font-size: 18px;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Khadijah</h1>
            <p>Order Invoice</p>
          </div>

          <div class="section">
            <div class="section-title">Order Information</div>
            <div class="customer-info">
              <div>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${formatDate(order.created_at)}</p>
                <p><strong>Status:</strong> ${order.is_confirmed ? 'Confirmed' : 'Pending'}</p>
              </div>
              <div>
                <p><strong>Customer:</strong> ${order.customer_name}</p>
                <p><strong>Phone:</strong> ${order.customer_phone}</p>
                <p><strong>Address:</strong> ${order.customer_address}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Order Items</div>
            <table class="product-list">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.product.title}</td>
                    <td>${item.size ? item.size.size : 'N/A'}</td>
                    <td>${item.quantity}</td>
                    <td>৳ ${item.product.price.toLocaleString()}</td>
                    <td>৳ ${(item.product.price * item.quantity).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="total">
            Total Amount: ৳ ${order.total_price.toLocaleString()}
          </div>

          <div class="footer">
            <p>Thank you for shopping with Khadijah!</p>
            <p>This is a computer-generated invoice, no signature required.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Manage Orders</h1>
          <button
            onClick={() => fetchOrders()}
            className="btn btn-primary text-sm"
          >
            Refresh Orders
          </button>
        </div>
        
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
                      <th className="text-right py-3 px-4 text-gray-300 font-medium">Total</th>
                      <th className="text-center py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
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
                          <td className="py-3 px-4 text-white">{order.customer_name}</td>
                          <td className="py-3 px-4 text-gray-300">{formatDate(order.created_at)}</td>
                          <td className="py-3 px-4 text-white text-right">৳ {order.total_price.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOrderConfirmation(order.id, order.is_confirmed);
                              }}
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                !order.is_confirmed 
                                  ? 'bg-amber-900/30 text-amber-400 hover:bg-amber-900/50' 
                                  : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                              }`}
                              disabled={isUpdating === order.id}
                            >
                              {order.is_confirmed ? 'Confirmed' : 'Pending'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex space-x-2 justify-end" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => handleEditClick(order)}
                                className="p-1.5 bg-blue-900/30 text-blue-400 rounded-md hover:bg-blue-900/50 transition-colors"
                                title="Edit Order"
                                disabled={isUpdating === order.id}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="p-1.5 bg-red-900/30 text-red-400 rounded-md hover:bg-red-900/50 transition-colors"
                                title="Delete Order"
                                disabled={isUpdating === order.id}
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
                                  <p className="text-white">{order.customer_name}</p>
                                  <p className="text-gray-300">{order.customer_address}</p>
                                  <p className="text-gray-300">{order.customer_phone}</p>
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
                                    !order.is_confirmed 
                                      ? 'bg-amber-900/30 text-amber-400' 
                                      : 'bg-green-900/30 text-green-400'
                                  }`}>
                                    {order.is_confirmed ? 'Confirmed' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                              
                              <h4 className="text-sm font-medium text-gray-300 mb-2">Products</h4>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center bg-teal-800/30 p-2 rounded-md">
                                    <div className="w-12 h-12 bg-teal-800 rounded-md overflow-hidden flex-shrink-0">
                                      {item.product.images && item.product.images.length > 0 ? (
                                        <img 
                                          src={`${API_BASE_URL}${item.product.images[0].image}`} 
                                          alt={item.product.title} 
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "https://via.placeholder.com/100x100?text=No+Image";
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-teal-700 text-xs text-teal-300">
                                          No Image
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-3 flex-grow">
                                      <p className="text-white">{item.product.title}</p>
                                      <div className="flex items-center text-sm text-gray-300">
                                        <span>Qty: {item.quantity}</span>
                                        <span className="mx-2">•</span>
                                        <span>Price: ৳ {item.product.price.toLocaleString()}</span>
                                        <span className="mx-2">•</span>
                                        <span>Size: {item.size ? item.size.size : 'N/A'}</span>
                                      </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-white font-medium">
                                        ৳ {(item.product.price * item.quantity).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex justify-between items-center mt-4">
                                <button
                                  onClick={() => printOrder(order)}
                                  className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm text-white"
                                  title="Print Order Invoice"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                                  </svg>
                                  Print Invoice
                                </button>
                                <div className="text-right">
                                  <p className="text-gray-300">Order Total</p>
                                  <p className="text-xl font-bold text-white">
                                    ৳ {order.total_price.toLocaleString()}
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
        
        {/* Edit Order Modal */}
        {showEditModal && editingOrder && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-teal-900 rounded-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Edit Order</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={editForm.customer_name}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-teal-800 border border-teal-700 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="customer_phone"
                    value={editForm.customer_phone}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-teal-800 border border-teal-700 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Address</label>
                  <textarea
                    name="customer_address"
                    value={editForm.customer_address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 rounded bg-teal-800 border border-teal-700 text-white"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_confirmed"
                    name="is_confirmed"
                    checked={editForm.is_confirmed}
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="is_confirmed" className="text-white">
                    Mark as Confirmed
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={updateOrder}
                    className="btn btn-primary flex-1 py-2"
                    disabled={isUpdating === editingOrder.id}
                  >
                    {isUpdating === editingOrder.id ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </span>
                    )}
                  </button>
                  <button
                    onClick={closeModal}
                    className="btn btn-secondary py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;