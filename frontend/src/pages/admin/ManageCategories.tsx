import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Edit, X, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../data/ApiUrl';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface Size {
  id: string;
  size: string;
}

const ManageCategories: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, authTokens } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // Category form state
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState<string>('');
  const [isEditCategory, setIsEditCategory] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);

  // Size form state
  const [sizeName, setSizeName] = useState('');
  const [isEditSize, setIsEditSize] = useState(false);
  const [editSizeId, setEditSizeId] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  // Fetch categories and sizes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await fetch(`${API_BASE_URL}api/admin/categories/`, {
          headers: {
            'Authorization': `Bearer ${authTokens?.access}`,
          }
        });
        const categoriesData = await categoriesResponse.json();
        console.log('Categories API Response:', categoriesData);
        if (categoriesData) {
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        }

        // Fetch sizes
        const sizesResponse = await fetch(`${API_BASE_URL}api/admin/sizes/`, {
          headers: {
            'Authorization': `Bearer ${authTokens?.access}`,
          }
        });
        const sizesData = await sizesResponse.json();
        console.log('Sizes API Response:', sizesData);

        // Adjust logic to handle response structure
        if (Array.isArray(sizesData)) {
          setSizes(sizesData);
        } else if (sizesData.data && Array.isArray(sizesData.data)) {
          setSizes(sizesData.data);
        } else {
          setSizes([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (authTokens?.access) {
      fetchData();
    }
  }, [authTokens]);

  // Handle category image change
  const handleCategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCategoryImage(file);
      setCategoryImagePreview(URL.createObjectURL(file));
    }
  };

  // Reset category form
  const resetCategoryForm = () => {
    setCategoryName('');
    setCategoryImage(null);
    setCategoryImagePreview('');
    setIsEditCategory(false);
    setEditCategoryId(null);
    setError('');
  };

  // Reset size form
  const resetSizeForm = () => {
    setSizeName('');
    setIsEditSize(false);
    setEditSizeId(null);
  };

  // Handle category submission
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!categoryName) {
      setError('Please enter a category name');
      return;
    }

    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      if (categoryImage) {
        formData.append('image', categoryImage);
      }

      const url = isEditCategory && editCategoryId
        ? `${API_BASE_URL}api/admin/categories/${editCategoryId}/`
        : `${API_BASE_URL}api/admin/categories/`;

      const response = await fetch(url, {
        method: isEditCategory ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      // Update categories list with the new data
      if (isEditCategory) {
        setCategories(prev => prev.map(cat => 
          cat.id === editCategoryId ? { ...cat, name: data.name, image: data.image } : cat
        ));
      } else {
        setCategories(prev => [...prev, data]);
      }

      resetCategoryForm();
      toast.success(`Category ${isEditCategory ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error instanceof Error ? error.message : 'Failed to save category. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle size submission
  const handleSizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!sizeName) {
      setError('Please enter a size name');
      return;
    }

    setFormLoading(true);

    try {
      const url = isEditSize && editSizeId
        ? `${API_BASE_URL}api/admin/sizes/${editSizeId}/`
        : `${API_BASE_URL}api/admin/sizes/`;

      const response = await fetch(url, {
        method: isEditSize ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size: sizeName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save size');
      }

      // Update sizes list
      if (isEditSize) {
        setSizes(prev => prev.map(s => 
          s.id === editSizeId ? { ...s, size: sizeName } : s
        ));
      } else {
        setSizes(prev => [...prev, data.data]);
      }

      resetSizeForm();
      toast.success(`Size ${isEditSize ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving size:', error);
      setError(error instanceof Error ? error.message : 'Failed to save size. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle category edit
  const handleEditCategory = (category: Category) => {
    setIsEditCategory(true);
    setEditCategoryId(category.id);
    setCategoryName(category.name);
    if (category.image) {
      setCategoryImagePreview(category.image);
    }
  };

  // Handle size edit
  const handleEditSize = (size: Size) => {
    setIsEditSize(true);
    setEditSizeId(size.id);
    setSizeName(size.size);
  };

  // Handle category delete
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}api/admin/categories/${categoryId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete category');
      }

      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };

  // Handle size delete
  const handleDeleteSize = async (sizeId: string) => {
    if (!confirm('Are you sure you want to delete this size?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}api/admin/sizes/${sizeId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete size');
      }

      setSizes(prev => prev.filter(size => size.id !== sizeId));
      toast.success('Size deleted successfully');
    } catch (error) {
      console.error('Error deleting size:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete size');
    }
  };

  return (
    <div className="pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom max-w-6xl">
        <h1 className="text-2xl font-bold text-white mb-6">Manage Categories & Sizes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categories Section */}
          <div className="bg-teal-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>

            {/* Category Form */}
            <form onSubmit={handleCategorySubmit} className="mb-6">
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-gray-300 mb-1">
                  Category Name*
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full p-2 rounded-md bg-teal-800 border border-teal-700 text-white"
                  placeholder="Enter category name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Category Image</label>
                <div className="flex items-center space-x-4">
                  {categoryImagePreview && (
                    <div className="relative w-20 h-20">
                      <img
                        src={categoryImagePreview}
                        alt="Category preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryImage(null);
                          setCategoryImagePreview('');
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                        title="Remove image"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  )}
                  <label className="flex-1">
                    <div className="w-full p-2 rounded-md bg-teal-800 border border-teal-700 text-white text-center cursor-pointer hover:bg-teal-700 transition-colors">
                      {categoryImage ? 'Change Image' : 'Upload Image'}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleCategoryImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn btn-primary flex-1 py-2"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditCategory ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      {isEditCategory ? <Check className="h-5 w-5 mr-2" /> : <PlusCircle className="h-5 w-5 mr-2" />}
                      {isEditCategory ? 'Update Category' : 'Add Category'}
                    </span>
                  )}
                </button>
                {isEditCategory && (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="btn btn-secondary py-2 px-4"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Categories List */}
            <div className="space-y-3">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-teal-800/50 rounded-md"></div>
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center text-gray-400 py-4">
                  No categories found. Add your first category!
                </div>
              ) : (
                categories.map(category => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-teal-800/30 rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      {category.image && (
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-10 h-10 object-cover rounded-md"
                        />
                      )}
                      <span className="text-white">{category.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-teal-300 hover:text-teal-200 transition-colors p-1"
                        title="Edit category"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sizes Section */}
          <div className="bg-teal-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Product Sizes</h2>

            {/* Size Form */}
            <form onSubmit={handleSizeSubmit} className="mb-6">
              <div className="mb-4">
                <label htmlFor="sizeName" className="block text-gray-300 mb-1">
                  Size Name*
                </label>
                <input
                  type="text"
                  id="sizeName"
                  value={sizeName}
                  onChange={(e) => setSizeName(e.target.value)}
                  className="w-full p-2 rounded-md bg-teal-800 border border-teal-700 text-white"
                  placeholder="Enter size name"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn btn-primary flex-1 py-2"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditSize ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      {isEditSize ? <Check className="h-5 w-5 mr-2" /> : <PlusCircle className="h-5 w-5 mr-2" />}
                      {isEditSize ? 'Update Size' : 'Add Size'}
                    </span>
                  )}
                </button>
                {isEditSize && (
                  <button
                    type="button"
                    onClick={resetSizeForm}
                    className="btn btn-secondary py-2 px-4"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Sizes List */}
            <div className="space-y-3">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-teal-800/50 rounded-md"></div>
                  ))}
                </div>
              ) : sizes.length === 0 ? (
                <div className="text-center text-gray-400 py-4">
                  No sizes found. Add your first size!
                </div>
              ) : (
                sizes.map(size => (
                  <div
                    key={size.id}
                    className="flex items-center justify-between p-3 bg-teal-800/30 rounded-md"
                  >
                    <span className="text-white">{size.size}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSize(size)}
                        className="text-teal-300 hover:text-teal-200 transition-colors p-1"
                        title="Edit size"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSize(size.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Delete size"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;