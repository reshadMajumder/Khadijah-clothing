import React from 'react';
import { RefreshCw, Clock, Truck, CreditCard } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Terms and Conditions</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-teal-900 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <RefreshCw className="h-10 w-10 text-orange-400 mr-4" />
              <h2 className="text-xl font-semibold text-white">Return Policy</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                At Khadijah Women's Fashion, we want you to be completely satisfied with your purchase. If you're not, you may be eligible to return or exchange it.
              </p>
              <h3 className="text-white font-medium">Return Eligibility:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Items must be returned within 7 days of delivery</li>
                <li>Products must be unworn, unwashed, and with original tags attached</li>
                <li>Original receipt or proof of purchase is required</li>
                <li>Sale items and intimate wear cannot be returned</li>
              </ul>
              <h3 className="text-white font-medium">How to Return:</h3>
              <p>
                Please contact our customer service team at <a href="mailto:returns@khadijah.com" className="text-orange-400 hover:underline">returns@khadijah.com</a> with your order number and reason for return. Our team will guide you through the return process.
              </p>
            </div>
          </div>

          <div className="bg-teal-900 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Truck className="h-10 w-10 text-orange-400 mr-4" />
              <h2 className="text-xl font-semibold text-white">Delivery Information</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                We strive to deliver your products in the fastest and most reliable way possible.
              </p>
              <h3 className="text-white font-medium">Delivery Times:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dhaka City: 1-2 business days</li>
                <li>Other Major Cities: 2-3 business days</li>
                <li>Remote Areas: 3-5 business days</li>
              </ul>
              <h3 className="text-white font-medium">Shipping Fees:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Free shipping on orders over ৳5,000</li>
                <li>Dhaka City: ৳80</li>
                <li>Outside Dhaka: ৳120-150</li>
              </ul>
              <p>
                You will receive a tracking number once your order is dispatched. For any delivery inquiries, please contact <a href="mailto:delivery@khadijah.com" className="text-orange-400 hover:underline">delivery@khadijah.com</a>.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-teal-900 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-10 w-10 text-orange-400 mr-4" />
              <h2 className="text-xl font-semibold text-white">Payment Methods</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                We offer various payment options for your convenience and security.
              </p>
              <h3 className="text-white font-medium">Accepted Payment Methods:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Cash on Delivery (COD)</li>
                <li>bKash, Nagad, Rocket mobile banking</li>
                <li>Credit/Debit Cards (Visa, Mastercard)</li>
                <li>Bank Transfer</li>
              </ul>
              <h3 className="text-white font-medium">Payment Security:</h3>
              <p>
                All online transactions are processed through secure and trusted payment gateways. We do not store credit card details nor have access to your payment information.
              </p>
              <p>
                For assistance with payments, please contact <a href="mailto:billing@khadijah.com" className="text-orange-400 hover:underline">billing@khadijah.com</a>.
              </p>
            </div>
          </div>

          <div className="bg-teal-900 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-10 w-10 text-orange-400 mr-4" />
              <h2 className="text-xl font-semibold text-white">Refund Policy</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                We process refunds for eligible returns in a timely manner.
              </p>
              <h3 className="text-white font-medium">Refund Process:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Refunds will be processed within 7 business days of receiving the returned item</li>
                <li>Original payment method will be refunded when possible</li>
                <li>Shipping costs are non-refundable</li>
                <li>For COD orders, refunds will be processed via bank transfer or mobile banking</li>
              </ul>
              <h3 className="text-white font-medium">Exchanges:</h3>
              <p>
                If you wish to exchange an item for a different size or color, please indicate this in your return request. Exchanges are subject to availability.
              </p>
              <p>
                For questions about refunds, please contact <a href="mailto:refunds@khadijah.com" className="text-orange-400 hover:underline">refunds@khadijah.com</a>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-teal-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Additional Terms</h2>
          <div className="space-y-4 text-gray-300">
            <h3 className="text-white font-medium">Privacy Policy:</h3>
            <p>
              We respect your privacy and are committed to protecting your personal data. Information collected during the ordering process is used solely for processing orders and improving our services.
            </p>
            
            <h3 className="text-white font-medium">Product Information:</h3>
            <p>
              We strive to display our products as accurately as possible. However, colors may appear slightly different due to screen settings. All measurements are approximate and may vary slightly.
            </p>
            
            <h3 className="text-white font-medium">Order Cancellation:</h3>
            <p>
              Orders can be cancelled within 2 hours of placement by contacting our customer service team. Once an order has been dispatched, it cannot be cancelled.
            </p>
            
            <h3 className="text-white font-medium">Disclaimer:</h3>
            <p>
              Khadijah Women's Fashion reserves the right to modify these terms and conditions at any time without prior notice. Please check back regularly for updates.
            </p>
            
            <p className="mt-6">
              Last updated: May 1, 2023
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;