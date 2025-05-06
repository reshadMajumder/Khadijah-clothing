import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Mail, ExternalLink, Search, AlertCircle, Check, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../data/ApiUrl';
import toast from 'react-hot-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, authTokens } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/admin/contact-us/`, {
          headers: {
            'Authorization': `Bearer ${authTokens?.access}`,
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        
        // Sort messages by created_at in descending order if available
        const sortedMessages = data.sort((a: ContactMessage, b: ContactMessage) => {
          if (a.created_at && b.created_at) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return 0;
        });
        
        setMessages(sortedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages. Please try again later.');
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    if (authTokens?.access) {
      fetchMessages();
    }
  }, [authTokens]);

  // Filter messages based on search term
  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open message detail modal
  const handleOpenModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // Close message detail modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/contact-us/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
        },
      });

      if (response.ok) {
        // Remove message from state
        setMessages(prev => prev.filter(message => message.id !== id));
        
        // Close modal if the deleted message is currently selected
        if (selectedMessage && selectedMessage.id === id) {
          handleCloseModal();
        }
        
        toast.success('Message deleted successfully');
      } else {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get message preview (first 60 characters)
  const getMessagePreview = (message: string) => {
    return message.length > 60 ? `${message.substring(0, 60)}...` : message;
  };

  return (
    <div className="pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Customer Messages</h1>
          
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-teal-900 border border-teal-800 rounded-md text-white focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-md p-4 mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        {/* Messages List */}
        <div className="bg-teal-900 rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-6 animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-teal-800/50 h-20 rounded-md"></div>
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-6 text-center">
              <Mail className="h-12 w-12 mx-auto text-teal-700 mb-3" />
              <h3 className="text-xl font-medium text-white mb-2">No messages found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search term' : 'You haven\'t received any customer messages yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-teal-800">
                <thead className="bg-teal-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-400 uppercase tracking-wider">
                      Message
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-teal-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-teal-900 divide-y divide-teal-800">
                  {filteredMessages.map((message) => (
                    <tr 
                      key={message.id} 
                      className="hover:bg-teal-800/30 transition-colors cursor-pointer"
                      onClick={() => handleOpenModal(message)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-lg">
                              {message.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{message.name}</div>
                            <div className="text-sm text-gray-400">{message.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 max-w-xs truncate">
                          {getMessagePreview(message.message)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(message.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(message);
                          }}
                          className="text-teal-400 hover:text-teal-300 mr-3"
                          title="View details"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(message.id);
                          }}
                          className="text-red-400 hover:text-red-300"
                          title="Delete message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Message Detail Modal */}
        {isModalOpen && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-teal-900 rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden border border-teal-800">
              <div className="flex justify-between items-center p-4 border-b border-teal-800">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-teal-400" />
                  Message Details
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Close"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm text-teal-400 mb-1">From</h3>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center mr-3">
                      <span className="text-white font-medium text-xl">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{selectedMessage.name}</p>
                      <p className="text-gray-400">
                        <a 
                          href={`mailto:${selectedMessage.email}`} 
                          className="hover:text-teal-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {selectedMessage.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm text-teal-400 mb-1">Date</h3>
                  <p className="text-gray-300">{formatDate(selectedMessage.created_at)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-teal-400 mb-1">Message</h3>
                  <div className="bg-teal-800/30 p-4 rounded-md border border-teal-800">
                    <p className="text-gray-300 whitespace-pre-line">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="btn btn-primary py-2 flex-1 flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Reply via Email
                  </a>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="btn btn-secondary py-2 flex items-center justify-center"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Message
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

export default Messages;
