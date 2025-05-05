import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ChevronLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

interface OrderForm {
  fullName: string;
  address: string;
  phoneNumber: string;
}

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [formData, setFormData] = useState<OrderForm>({
    fullName: '',
    address: '',
    phoneNumber: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<OrderForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof OrderForm]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<OrderForm> = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number should contain only digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, save to Firebase
      // const orderData = {
      //   name: formData.fullName,
      //   address: formData.address,
      //   phone_number: formData.phoneNumber,
      //   products: cartItems.map(item => ({
      //     product_id: item.id,
      //     size: item.size,
      //     quantity: item.quantity
      //   })),
      //   total_price_bdt: getTotalPrice(),
      //   status: 'Pending',
      //   created_at: serverTimestamp()
      // };
      
      // const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // For demo, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart and show success
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="pt-24 pb-12 bg-teal-950 min-h-screen">
        <div className="container-custom max-w-4xl">
          <div className="bg-teal-900 rounded-lg p-8 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">🎉 Order Confirmed!</h1>
            <p className="text-gray-300 text-lg mb-8">
              Our sales representative will contact you soon.
            </p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom">
        <div className="mb-6">
          <Link to="/" className="text-gray-400 hover:text-orange-400 flex items-center text-sm">
            <ChevronLeft size={16} className="mr-1" />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-10">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length > 0 ? (
              <div className="bg-teal-900 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Cart Items ({cartItems.length})</h2>
                  
                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <div key={`${item.id}-${item.size}`} className={`flex flex-col sm:flex-row gap-4 ${
                        index < cartItems.length - 1 ? 'pb-6 border-b border-teal-800' : ''
                      }`}>
                        {/* Product Image */}
                        <div className="sm:w-24 h-24 bg-teal-800 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-grow">
                          <h3 className="text-lg font-medium text-white">{item.title}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-300">
                            <p>Size: {item.size}</p>
                            <p>Price: ৳ {item.price.toLocaleString()}</p>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                className="h-8 w-8 rounded-l-md bg-teal-800 text-white flex items-center justify-center hover:bg-teal-700 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <div className="h-8 w-10 bg-teal-800/80 flex items-center justify-center text-white text-sm">
                                {item.quantity}
                              </div>
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                className="h-8 w-8 rounded-r-md bg-teal-800 text-white flex items-center justify-center hover:bg-teal-700 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-teal-900 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
                <p className="text-gray-400 mb-6">Explore our collection and add items to your cart.</p>
                <Link to="/" className="btn btn-primary">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary & Form */}
          <div className="lg:col-span-1">
            <div className="bg-teal-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>৳ {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-teal-800 pt-3 flex justify-between">
                  <span className="font-medium text-white">Total</span>
                  <span className="font-bold text-white">৳ {getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="bg-teal-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Buyer Information</h2>
                
                <form onSubmit={handleSubmitOrder}>
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-gray-300 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                      {formErrors.fullName && (
                        <p className="mt-1 text-sm text-red-400">{formErrors.fullName}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label htmlFor="address" className="block text-gray-300 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input-field min-h-[80px]"
                        required
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-red-400">{formErrors.address}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label htmlFor="phoneNumber" className="block text-gray-300 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                      {formErrors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-400">{formErrors.phoneNumber}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-primary w-full py-3 mt-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Confirm Order'
                      )}
                    </button>

                    <p className="text-sm text-gray-400 mt-4">
                      By placing your order, you agree to our <Link to="/terms" className="text-orange-400 hover:text-orange-300">Terms and Conditions</Link>.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;