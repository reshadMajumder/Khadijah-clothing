import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../data/ApiUrl';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<ContactForm>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof ContactForm]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<ContactForm> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Send data to backend API
      const response = await fetch(`${API_BASE_URL}api/contact-us/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        
        // Show warning if email notification failed
        if (data.warning) {
          toast.error(data.warning);
        }
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about our products, need styling advice, or want to provide feedback, we're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-3">
            <div className="bg-teal-900 rounded-lg overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-gray-300 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                      )}
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-gray-300 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                      )}
                    </div>
                    
                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-gray-300 mb-1">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="input-field min-h-[150px]"
                        required
                      />
                      {formErrors.message && (
                        <p className="mt-1 text-sm text-red-400">{formErrors.message}</p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      className="btn btn-primary w-full py-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send size={18} className="mr-2" />
                          Send Message
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="md:col-span-2">
            <div className="bg-teal-900 rounded-lg overflow-hidden h-full">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">Address</h3>
                      <p className="text-gray-300 mt-1">
                        Sadiq Tower (2nd Floor of the Lift)<br />
                        Nayasarak Road<br />
                        Sylhet 3100, Bangladesh
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">Phone</h3>
                      <p className="text-gray-300 mt-1">
                        <a href="tel:+880298837165" className="hover:text-orange-400 transition-colors">
                          +880 298 837 165
                        </a>
                      </p>
                      <p className="text-gray-300">
                        <a href="tel:+880298837166" className="hover:text-orange-400 transition-colors">
                          +880 298 837 166
                        </a>
                      </p>
                      <p className="text-gray-300">
                        <a href="tel:+880198643225" className="hover:text-orange-400 transition-colors">
                          +880 198 643 225
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">Email</h3>
                      <p className="text-gray-300 mt-1">
                        <a href="mailto:admin@khadijahclothing.com" className="hover:text-orange-400 transition-colors">
                          admin@khadijahclothing.com
                        </a>
                      </p>
                      <p className="text-gray-300 mt-1">
                        <a href="mailto:khadijah.clothingbrand@gmail.com" className="hover:text-orange-400 transition-colors">
                        khadijah.clothingbrand@gmail.com
                       </a>
                      </p>
                      <p className="text-gray-300 mt-1">
                        <a href="mailto:hello@khadijahclothing.com" className="hover:text-orange-400 transition-colors">
                          hello@khadijahclothing.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="text-lg font-medium text-white mb-3">Opening Hours</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>10:00 AM - 8:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday</span>
                      <span>11:00 AM - 7:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-12">
          <div className="bg-teal-900 rounded-lg overflow-hidden">
            <div className="p-4">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.7023!2d91.8667!3d24.8976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3751ab3b4220c2bd%3A0x1a3c3b1c3b1c3b1c!2sSadiq%20Tower%2C%20Nayasarak%20Road%2C%20Sylhet%203100%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1622299950957!5m2!1sen!2sbd" 
                className="w-full h-[400px] border-0"
                title="Khadijah Store Location"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;