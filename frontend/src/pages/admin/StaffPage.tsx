import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Edit, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../data/ApiUrl';
import { useAuth } from '../../context/AuthContext';

interface Staff {
  id: string;
  name: string;
  position: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

const StaffPage: React.FC = () => {
  const { authTokens } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff>({
    id: '',
    name: '',
    position: '',
    image: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch staff
  useEffect(() => {
    fetchStaff();
  }, [authTokens]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/stuff/`, {
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      
      const data = await response.json();
      console.log('Staff data:', data);
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const deleteStaffMember = async (staffId: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/stuff/${staffId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete staff member');
      }
      
      // Remove locally
      setStaff(prevStaff => prevStaff.filter(member => member.id !== staffId));
      toast.success('Staff member deleted successfully');
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast.error('Failed to delete staff member');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentStaff({
      id: '',
      name: '',
      position: '',
      image: ''
    });
    setSelectedImage(null);
    setImagePreview('');
    setShowModal(true);
  };

  const openEditModal = (member: Staff) => {
    setIsEditing(true);
    setCurrentStaff({ ...member });
    setSelectedImage(null);
    setImagePreview(member.image || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentStaff.name.trim() || !currentStaff.position.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!isEditing && !selectedImage) {
      toast.error('Please select an image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', currentStaff.name);
      formData.append('position', currentStaff.position);
      
      if (selectedImage) {
        formData.append('image', selectedImage, selectedImage.name);
      }
      
      // Log the FormData to check if it contains the image
      console.log('FormData entries:');
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      let response;
      
      if (isEditing) {
        response = await fetch(`${API_BASE_URL}api/admin/stuff/${currentStaff.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authTokens?.access}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}api/admin/stuff/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authTokens?.access}`,
          },
          body: formData,
        });
      }
      
      // Log the response for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Try to get response text first for debugging
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      // If not JSON, handle appropriately
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${responseText}`);
      }
      
      // Parse the text as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      if (isEditing) {
        setStaff(prevStaff => 
          prevStaff.map(member => 
            member.id === currentStaff.id ? data : member
          )
        );
        toast.success('Staff member updated successfully');
      } else {
        setStaff(prevStaff => [...prevStaff, data]);
        toast.success('Staff member added successfully');
      }
      
      // Close modal and reset state
      setShowModal(false);
      setSelectedImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error saving staff member:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Manage Staff</h1>
          <button
            onClick={openAddModal}
            className="btn btn-primary text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add Staff
          </button>
        </div>
        
        {loading ? (
          <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-teal-900 rounded-lg overflow-hidden">
                <div className="h-48 bg-teal-800"></div>
                <div className="p-4">
                  <div className="h-6 bg-teal-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-teal-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : staff.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {staff.map(member => (
              <div key={member.id} className="bg-teal-900 rounded-lg overflow-hidden shadow-md">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white">{member.name}</h3>
                  <p className="text-orange-400">{member.position}</p>
                  
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-1.5 bg-teal-800 text-white rounded-md hover:bg-teal-700 transition-colors flex-1 flex items-center justify-center"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStaffMember(member.id)}
                      className="p-1.5 bg-red-900/30 text-red-400 rounded-md hover:bg-red-900/50 transition-colors"
                      title="Delete Staff"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-teal-900 rounded-lg p-8 text-center">
            <div className="mb-4">
              <Users className="h-16 w-16 text-gray-600 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No staff members yet</h2>
            <p className="text-gray-400 mb-6">
              Add staff members to display them on your about page.
            </p>
            <button
              onClick={openAddModal}
              className="btn btn-primary"
            >
              <Plus size={16} className="mr-1" />
              Add First Staff Member
            </button>
          </div>
        )}

        {/* Add/Edit Staff Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-teal-900 rounded-lg shadow-lg max-w-md w-full overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-teal-800">
                <h3 className="text-lg font-bold text-white">
                  {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={currentStaff.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  {/* Position */}
                  <div>
                    <label htmlFor="position" className="block text-gray-300 mb-1">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={currentStaff.position}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g. Senior Designer"
                      required
                    />
                  </div>
                  
                  {/* Image Upload */}
                  <div>
                    <label htmlFor="image" className="block text-gray-300 mb-1">
                      Profile Image <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-2 bg-teal-800 rounded text-white hover:bg-teal-700 transition-colors"
                    >
                      {selectedImage ? 'Change Image' : isEditing ? 'Change Image' : 'Select Image'}
                    </button>
                    <p className="text-gray-400 text-xs mt-1">
                      {selectedImage ? selectedImage.name : 'JPEG, PNG or GIF (max. 2MB)'}
                    </p>
                  </div>
                  
                  {/* Preview */}
                  {(imagePreview || currentStaff.image) && (
                    <div className="mt-2">
                      <p className="text-gray-300 text-sm mb-2">Image Preview:</p>
                      <div className="w-full h-48 rounded-md overflow-hidden bg-teal-800">
                        <img 
                          src={imagePreview || currentStaff.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/150?text=Invalid+Image";
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-6 space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-teal-800 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isEditing ? 'Updating...' : 'Adding...'}
                        </span>
                      ) : (
                        <>{isEditing ? 'Update' : 'Add'} Staff Member</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffPage;