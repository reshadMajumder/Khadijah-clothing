import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit, Users } from 'lucide-react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';

// Mock Data - Remove when connecting to Firebase
import { mockStaff } from '../../data/mockData';

interface Staff {
  id: string;
  name: string;
  role: string;
  image: string;
}

const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff>({
    id: '',
    name: '',
    role: '',
    image: ''
  });

  // Fetch staff
  useEffect(() => {
    // In a real implementation, fetch from Firebase
    // const fetchStaff = async () => {
    //   try {
    //     const staffCollection = collection(db, 'staffs');
    //     const staffSnapshot = await getDocs(staffCollection);
    //     const staffList = staffSnapshot.docs.map(doc => ({
    //       id: doc.id,
    //       ...doc.data()
    //     })) as Staff[];
    //     setStaff(staffList);
    //   } catch (error) {
    //     console.error('Error fetching staff:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchStaff();

    // Using mock data for now
    setStaff(mockStaff);
    setLoading(false);
  }, []);

  const deleteStaffMember = async (staffId: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      // In a real implementation, delete from Firebase
      // await deleteDoc(doc(db, 'staffs', staffId));
      
      // Remove locally for demo
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

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentStaff({
      id: '',
      name: '',
      role: '',
      image: ''
    });
    setShowModal(true);
  };

  const openEditModal = (member: Staff) => {
    setIsEditing(true);
    setCurrentStaff({ ...member });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentStaff.name.trim() || !currentStaff.role.trim() || !currentStaff.image.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      if (isEditing) {
        // In a real implementation, update in Firebase
        // await updateDoc(doc(db, 'staffs', currentStaff.id), {
        //   name: currentStaff.name,
        //   role: currentStaff.role,
        //   image: currentStaff.image
        // });
        
        // Update locally for demo
        setStaff(prevStaff => 
          prevStaff.map(member => 
            member.id === currentStaff.id ? { ...currentStaff } : member
          )
        );
        
        toast.success('Staff member updated successfully');
      } else {
        // In a real implementation, add to Firebase
        // const docRef = await addDoc(collection(db, 'staffs'), {
        //   name: currentStaff.name,
        //   role: currentStaff.role,
        //   image: currentStaff.image
        // });
        
        // Add locally for demo
        const newId = `staff${staff.length + 1}`;
        const staffToAdd = {
          id: newId,
          name: currentStaff.name,
          role: currentStaff.role,
          image: currentStaff.image
        };
        
        setStaff(prevStaff => [...prevStaff, staffToAdd]);
        
        toast.success('Staff member added successfully');
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('Error saving staff member:', error);
      toast.error('Failed to save staff member');
    }
  };

  return (
    <div>
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
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">{member.name}</h3>
                <p className="text-orange-400">{member.role}</p>
                <p className="text-gray-400 text-sm mt-1">ID: {member.id}</p>
                
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-teal-900 rounded-lg shadow-lg max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-teal-800">
              <h3 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentStaff.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                
                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-gray-300 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={currentStaff.role}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                
                {/* Image URL */}
                <div>
                  <label htmlFor="image" className="block text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={currentStaff.image}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Enter the URL of the staff member's photo
                  </p>
                </div>
                
                {/* Preview */}
                {currentStaff.image && (
                  <div className="mt-2">
                    <p className="text-gray-300 text-sm mb-2">Image Preview:</p>
                    <div className="w-full h-48 rounded-md overflow-hidden bg-teal-800">
                      <img 
                        src={currentStaff.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image';
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
                  >
                    {isEditing ? 'Update' : 'Add'} Staff Member
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;