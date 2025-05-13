import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Edit, X, Upload, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../data/ApiUrl';
import toast from 'react-hot-toast';

interface CategoryData {
  id: string;
  name: string;
  image?: string;
}

interface Size {
  id: string;
  size: string;
}

interface ProductImage {
  id: string;
  image: string;
  image_url: string | null;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: CategoryData;
  size: Size[];
  images: ProductImage[];
}

const ManageProducts: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, authTokens } = useAuth();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Product form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  // Add state to track original image URLs
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);
  
  // Edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Add state for available sizes
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);

  // Add a useRef for the description field in the edit modal
  const descriptionFieldRef = React.useRef<HTMLTextAreaElement>(null);

  // Add this state near the top of your component after other state declarations
  const [directDescription, setDirectDescription] = useState<string>('');

  // Add state to track the original product for edit
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);

  // Debug console logging for API responses
  useEffect(() => {
    console.log("Current product being edited:", editProductId);
    if (editProductId) {
      const product = products.find(p => p.id === editProductId);
      console.log("Editing product data:", product);
    }
  }, [editProductId, products]);

  // Check if user is authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/categories/`);
        const data = await response.json();
        
        if (data.status === 'success' && data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0 && !categoryId) {
            setCategoryId(data.categories[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, [categoryId]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/products/`, {
          headers: {
            'Authorization': `Bearer ${authTokens?.access}`,
          }
        });
        
        const data = await response.json();
        
        if (data.status === 'success' && data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    if (authTokens?.access) {
      fetchProducts();
    }
  }, [authTokens]);

  // Add effect to fetch sizes from API
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/sizes/`);
        const data = await response.json();
        
        if (data.status === 'success' && data.sizes) {
          setAvailableSizes(data.sizes);
        }
      } catch (error) {
        console.error('Error fetching sizes:', error);
      }
    };

    fetchSizes();
  }, []);

  // Add useEffect to ensure form data is properly set when modal opens
  useEffect(() => {
    if (showModal && isEditMode && editProductId) {
      const product = products.find(p => p.id === editProductId);
      if (product) {
        console.log("Modal opened, ensuring form data is set", product);
        
        // Directly set the description field value if the ref is available
        if (descriptionFieldRef.current) {
          descriptionFieldRef.current.value = product.description;
          setDescription(product.description);
        }
      }
    }
  }, [showModal, isEditMode, editProductId, products]);

  // Modify the useEffect that updates description in the modal
  useEffect(() => {
    if (showModal && isEditMode && descriptionFieldRef.current) {
      // Force the description value into the input field
      if (descriptionFieldRef.current.value !== description) {
        descriptionFieldRef.current.value = description || '';
        console.log("Force updated description field value:", description);
      }
      
      // Add a focus and blur event to ensure updates
      const textareaEl = descriptionFieldRef.current;
      const onFocus = () => {
        console.log("Description field focused");
      };
      const onBlur = () => {
        const newValue = textareaEl.value;
        if (description !== newValue) {
          setDescription(newValue);
          console.log("Description updated on blur:", newValue);
        }
      };
      
      textareaEl.addEventListener('focus', onFocus);
      textareaEl.addEventListener('blur', onBlur);
      
      return () => {
        textareaEl.removeEventListener('focus', onFocus);
        textareaEl.removeEventListener('blur', onBlur);
      };
    }
  }, [showModal, description, isEditMode]);

  // Add a new useEffect to monitor API data loading
  useEffect(() => {
    if (products.length > 0 && editProductId) {
      const product = products.find(p => p.id === editProductId);
      if (product && descriptionFieldRef.current && showModal) {
        // Make sure description field is updated when products data changes
        const descriptionValue = product.description || '';
        if (descriptionFieldRef.current.value !== descriptionValue) {
          console.log("Updating description from product data change:", descriptionValue);
          descriptionFieldRef.current.value = descriptionValue;
          setDescription(descriptionValue);
        }
      }
    }
  }, [products, editProductId, showModal]);

  // Handle multiple image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      
      // Add new files to existing ones
      const newImages = [...images, ...fileList];
      setImages(newImages);
      
      // Generate preview URLs
      const newPreviews = fileList.map(file => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviews]);
    }
  };

  // Remove an image by index
  const removeImage = (index: number, type: 'preview' | 'url') => {
    if (type === 'preview') {
      const updatedPreviews = [...imagePreviewUrls];
      URL.revokeObjectURL(updatedPreviews[index]);
      updatedPreviews.splice(index, 1);
      setImagePreviewUrls(updatedPreviews);
    } else {
      const updatedUrls = [...imageUrls];
      updatedUrls.splice(index, 1);
      setImageUrls(updatedUrls.length > 0 ? updatedUrls : ['']);
    }
  };

  // Handle size toggle
  const toggleSize = (sizeId: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(sizeId)) {
        return prev.filter(id => id !== sizeId);
      } else {
        return [...prev, sizeId];
      }
    });
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setSelectedSizes([]);
    setCategoryId(categories.length > 0 ? categories[0].id : '');
    setImages([]);
    setImagePreviewUrls([]);
    setImageUrls(['']);
    setIsEditMode(false);
    setEditProductId(null);
    setError('');
    setOriginalProduct(null);
  };

  // Get description directly from API
  const getProductDescription = (productId: string) => {
    if (!productId) return;
    
    console.log("Getting product description directly from API");
    
    fetch(`${API_BASE_URL}api/admin/products/${productId}/`, {
      headers: {
        'Authorization': `Bearer ${authTokens?.access}`,
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to fetch product details');
    })
    .then(data => {
      console.log("Raw product data from API:", data);
      
      // Try different ways to get the description
      const descriptionFromData = data.description || (data.product && data.product.description) || '';
      console.log("Extracted description:", descriptionFromData);
      
      // Update both the React state and the DOM element directly
      setDirectDescription(descriptionFromData);
      setDescription(descriptionFromData);
      
      if (descriptionFieldRef.current) {
        descriptionFieldRef.current.value = descriptionFromData;
      }
    })
    .catch(error => {
      console.error("Error fetching product description:", error);
    });
  };

  // Load product data for editing
  const loadProductForEdit = (product: Product) => {
    setOriginalProduct(product); // Store the original for comparison
    console.log("Loading product for edit (full object):", product);
    
    // Set all form fields from product data
    setIsEditMode(true);
    setEditProductId(product.id);
    
    // Get description directly from API
    getProductDescription(product.id);
    
    // Set all other form fields with safe values
    setTitle(product.title || '');
    setPrice(product.price ? product.price.toString() : '');
    setSelectedSizes(product.size ? product.size.map(s => s.id) : []);
    setCategoryId(product.category ? product.category.id : '');
    
    // Reset previous state for images
    setImages([]);
    setImagePreviewUrls([]);
    
    // Handle existing images
    if (product.images && product.images.length > 0) {
      const fileImages = product.images
        .filter(img => img.image && !img.image_url)
        .map(img => img.image);
      
      const urlImages = product.images
        .filter(img => img.image_url)
        .map(img => img.image_url || '');
      
      // Set file image previews
      if (fileImages.length > 0) {
        setImagePreviewUrls(fileImages);
      } else {
        setImagePreviewUrls([]);
      }
      
      // Set image URLs
      if (urlImages.length > 0) {
        setImageUrls(urlImages);
        setOriginalImageUrls([...urlImages]); // Store original URLs
      } else {
        setImageUrls(['']);
        setOriginalImageUrls([]);
      }
    } else {
      setImageUrls(['']);
      setOriginalImageUrls([]);
    }
    
    // Show modal after setting all data
    setShowModal(true);
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/products/${productId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
        },
      });

      if (response.ok) {
        toast.success('Product deleted successfully');
        // Remove product from state
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title || !description || !price || selectedSizes.length === 0 || !categoryId) {
        setError('Please fill in all fields and select at least one size');
        return;
    }

    // For new products, require at least one image or image URL
    if (!isEditMode && images.length === 0 && imageUrls.every(url => url.trim() === '')) {
        setError('Please upload or provide at least one product image or image URL');
        return;
    }

    setFormLoading(true);

    try {
        const formData = new FormData();
        let hasChanges = false;
        // Only send changed fields
        if (!originalProduct || title !== originalProduct.title) {
          formData.append('title', title);
          hasChanges = true;
        }
        if (!originalProduct || description !== originalProduct.description) {
          formData.append('description', description);
          hasChanges = true;
        }
        if (!originalProduct || price !== originalProduct.price.toString()) {
          formData.append('price', price);
          hasChanges = true;
        }
        if (!originalProduct || categoryId !== originalProduct.category.id) {
          formData.append('category', categoryId);
          hasChanges = true;
        }
        // Sizes (compare arrays)
        const origSizes = originalProduct ? originalProduct.size.map(s => s.id).sort() : [];
        const newSizes = selectedSizes.slice().sort();
        if (!originalProduct || JSON.stringify(origSizes) !== JSON.stringify(newSizes)) {
          selectedSizes.forEach(sizeId => formData.append('size', sizeId));
          hasChanges = true;
        }
        // Image URLs (compare arrays)
        const origUrls = originalProduct ? (originalProduct.images || []).filter(img => img.image_url).map(img => img.image_url).sort() : [];
        const newUrls = imageUrls.filter(url => url.trim() !== '').sort();
        if (!originalProduct || JSON.stringify(origUrls) !== JSON.stringify(newUrls)) {
          // Only send the new URLs, not the old ones
          newUrls.forEach((url, idx) => {
            formData.append(`images[${idx}][image_url]`, url);
          });
          hasChanges = true;
        }
        // New image files
        if (images.length > 0) {
          images.forEach((file, idx) => {
            formData.append(`images[${idx}][image]`, file);
          });
          hasChanges = true;
        }
        if (!hasChanges) {
          toast('No changes detected.');
          setFormLoading(false);
          return;
        }
        let url = `${API_BASE_URL}api/admin/products/`;
        let method = 'POST';
        if (isEditMode && editProductId) {
          url = `${API_BASE_URL}api/admin/products/${editProductId}/`;
          method = 'PUT';
        }
        const response = await fetch(url, {
          method,
          headers: { 'Authorization': `Bearer ${authTokens?.access}` },
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || data.error || `Failed to ${isEditMode ? 'update' : 'create'} product`);
          toast.error(`Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`);
        } else {
          // Refresh products list
          const productsResponse = await fetch(`${API_BASE_URL}api/products/`, {
            headers: { 'Authorization': `Bearer ${authTokens?.access}` },
          });
          const productsData = await productsResponse.json();
          if (productsData.status === 'success' && productsData.products) {
            setProducts(productsData.products);
          }
          resetForm();
          setShowModal(false);
          toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully!`);
        }
    } catch (error) {
        console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        toast.error(`Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`);
    } finally {
        setFormLoading(false);
    }
};

  // Add a specific handler for description changes
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    console.log("Description changed to:", newValue);
    setDescription(newValue);
  };

  return (
    <div className="pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Manage Products</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="btn btn-primary text-sm"
          >
            {showForm ? 'Hide Form' : (
              <span className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Product
              </span>
            )}
          </button>
        </div>
        
        {/* Add/Edit Product Form */}
        {showForm && !isEditMode && (
          <div className="bg-teal-900 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            {error && (
              <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Product Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-300 mb-1">
                  Product Title*
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded-md bg-teal-800 border border-teal-700 text-white"
                  placeholder="Enter product title"
                />
              </div>
              
              {/* Product Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-300 mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  rows={4}
                  className="w-full p-2 rounded-md bg-teal-800 border border-teal-700 text-white"
                  placeholder="Enter product description"
                ></textarea>
              </div>
              
              {/* Price */}
              <div className="mb-4">
                <label htmlFor="price" className="block text-gray-300 mb-1">
                  Price*
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 rounded-md bg-teal-800 border border-teal-700 text-white"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
              </div>
              
              {/* Category Selection */}
              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-300 mb-1">
                  Category*
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2 rounded-md bg-teal-800 border border-teal-700 text-white"
                >
                  {categories.length === 0 ? (
                    <option value="">Loading categories...</option>
                  ) : (
                    categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              {/* Size Selection */}
              <div className="mb-4">
                <span className="block text-gray-300 mb-2">Available Sizes*</span>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.length === 0 ? (
                    <div className="text-gray-400 text-sm">Loading sizes...</div>
                  ) : (
                    availableSizes.map(size => (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => toggleSize(size.id)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          selectedSizes.includes(size.id)
                            ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white'
                            : 'bg-teal-800 text-white hover:bg-teal-700'
                        }`}
                      >
                        {size.size}
                      </button>
                    ))
                  )}
                </div>
              </div>
              
              {/* Image Upload */}
              <div className="mb-6">
                <span className="block text-gray-300 mb-2">
                  Product Images
                  {!isEditMode && '*'}
                  {isEditMode && ' (Optional - leave empty to keep existing images)'}
                </span>
                
                {/* Existing Images */}
                {isEditMode && (imagePreviewUrls.length > 0 || imageUrls.some(url => url.trim() !== '')) && (
                  <div className="mb-4">
                    <h4 className="text-sm text-gray-400 mb-2">Existing Images:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {/* Show existing uploaded images */}
                      {imagePreviewUrls.map((url, index) => (
                        <div key={`existing-preview-${index}`} className="relative group">
                          <img 
                            src={url} 
                            alt={`Existing image ${index + 1}`} 
                            className="h-28 w-full object-cover rounded-md"
                            onError={(e) => {
                              // Fallback if the image fails to load
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(index, 'preview')}
                              className="bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove image"
                            >
                              <X size={16} className="text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Show existing image URLs */}
                      {imageUrls.filter(url => url.trim() !== '').map((url, index) => (
                        <div key={`existing-url-${index}`} className="relative group">
                          <img 
                            src={url} 
                            alt={`Existing URL image ${index + 1}`} 
                            className="h-28 w-full object-cover rounded-md"
                            onError={(e) => {
                              // Fallback if the image fails to load
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(index, 'url')}
                              className="bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove image"
                            >
                              <X size={16} className="text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New Images Preview */}
                {images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm text-gray-400 mb-2">New Images:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {images.map((file, index) => (
                        <div key={`new-image-${index}`} className="relative group">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`New image ${index + 1}`} 
                            className="h-28 w-full object-cover rounded-md"
                            onError={(e) => {
                              // Fallback if the image fails to load
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedImages = [...images];
                              updatedImages.splice(index, 1);
                              setImages(updatedImages);
                            }}
                            className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <X size={16} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-teal-700 rounded-md cursor-pointer bg-teal-800/50 hover:bg-teal-800 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-teal-500 mb-2" />
                    <p className="text-sm text-gray-300">Click to upload additional product images</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, or WEBP (max 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                  />
                </label>
              </div>
              
              {/* Image URLs */}
              <div className="mb-6">
                <span className="block text-gray-300 mb-2">
                  Product Image URLs (Optional)
                </span>
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const updatedUrls = [...imageUrls];
                        updatedUrls[index] = e.target.value;
                        setImageUrls(updatedUrls);
                      }}
                      className="flex-1 p-2 rounded-md bg-teal-800 border border-teal-700 text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, 'url')}
                      className="ml-2 text-red-400 hover:text-red-300 transition-colors p-2"
                      aria-label="Remove URL"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setImageUrls([...imageUrls, ''])}
                  className="text-teal-400 hover:text-teal-300 text-sm mt-1 flex items-center"
                >
                  <PlusCircle size={16} className="mr-1" />
                  Add another URL
                </button>
              </div>
              
              {/* Submit and Cancel Buttons */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn btn-primary flex-1 py-3 flex items-center justify-center"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      {isEditMode ? <Check className="h-5 w-5 mr-2" /> : <PlusCircle className="h-5 w-5 mr-2" />}
                      {isEditMode ? 'Update Product' : 'Create Product'}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    if (isEditMode) {
                      setShowForm(false);
                    }
                  }}
                  className="btn btn-secondary py-3 px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all duration-300">
            <div className="bg-gradient-to-b from-teal-900 to-teal-950 rounded-lg shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-teal-800">
              <div className="flex justify-between items-center mb-6 border-b border-teal-800 pb-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <Edit className="h-5 w-5 mr-3 text-teal-400" />
                  Edit Product
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors bg-teal-800/50 hover:bg-teal-800 rounded-full p-2"
                  title="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-md flex items-start animate-pulse">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Title */}
                  <div className="col-span-1">
                    <label htmlFor="modal-title" className="block text-gray-300 mb-2 font-medium">
                      Product Title*
                    </label>
                    <input
                      type="text"
                      id="modal-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 rounded-md bg-teal-800/50 border border-teal-700 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                      placeholder="Enter product title"
                    />
                  </div>
                  
                  {/* Price */}
                  <div className="col-span-1">
                    <label htmlFor="modal-price" className="block text-gray-300 mb-2 font-medium">
                      Price*
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        id="modal-price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 pl-7 rounded-md bg-teal-800/50 border border-teal-700 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Product Description */}
                <div>
                  <label htmlFor="modal-description" className="block text-gray-300 mb-2 font-medium">
                    Description*
                  </label>
                  <textarea
                    id="modal-description"
                    ref={descriptionFieldRef}
                    className="w-full p-3 rounded-md bg-teal-800/50 border border-teal-700 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    placeholder="Enter product description"
                    defaultValue={directDescription || description || ''}
                    rows={4}
                    onChange={handleDescriptionChange}
                  ></textarea>
                  <div className="mt-1 text-xs flex justify-between">
                    <span className="text-gray-400">
                      {directDescription ? `Current description: ${directDescription}` : 'Loading description...'}
                    </span>
                    {directDescription !== description && (
                      <button 
                        type="button" 
                        className="text-teal-400 hover:text-teal-300"
                        onClick={() => {
                          if (descriptionFieldRef.current) {
                            descriptionFieldRef.current.value = directDescription;
                            setDescription(directDescription);
                          }
                        }}
                      >
                        Reset to original
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Selection */}
                  <div>
                    <label htmlFor="modal-category" className="block text-gray-300 mb-2 font-medium">
                      Category*
                    </label>
                    <select
                      id="modal-category"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-3 rounded-md bg-teal-800/50 border border-teal-700 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    >
                      {categories.length === 0 ? (
                        <option value="">Loading categories...</option>
                      ) : (
                        categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  {/* Size Selection */}
                  <div>
                    <span className="block text-gray-300 mb-2 font-medium">Available Sizes*</span>
                    <div className="p-3 bg-teal-800/30 border border-teal-700 rounded-md">
                      <div className="flex flex-wrap gap-2">
                        {availableSizes.length === 0 ? (
                          <div className="text-gray-400 text-sm">Loading sizes...</div>
                        ) : (
                          availableSizes.map(size => (
                            <button
                              key={size.id}
                              type="button"
                              onClick={() => toggleSize(size.id)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                selectedSizes.includes(size.id)
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md'
                                  : 'bg-teal-800 text-white hover:bg-teal-700'
                              }`}
                            >
                              {size.size}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Image Upload */}
                <div className="border-t border-teal-800 pt-6">
                  <span className="block text-gray-300 mb-4 font-medium text-lg">
                    Product Images
                    {isEditMode && ' (Optional - leave empty to keep existing images)'}
                  </span>
                  
                  {/* Existing Images */}
                  {isEditMode && (imagePreviewUrls.length > 0 || imageUrls.some(url => url.trim() !== '')) && (
                    <div className="mb-6">
                      <h4 className="text-sm text-gray-400 mb-3 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mr-2"></span> 
                        Existing Images
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {/* Show existing uploaded images */}
                        {imagePreviewUrls.map((url, index) => (
                          <div key={`existing-preview-${index}`} className="relative group rounded-md overflow-hidden shadow-md">
                            <img 
                              src={url} 
                              alt={`Existing image ${index + 1}`} 
                              className="h-28 w-full object-cover rounded-md transition-transform group-hover:scale-105"
                              onError={(e) => {
                                // Fallback if the image fails to load
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeImage(index, 'preview')}
                                className="bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform scale-90 group-hover:scale-100"
                                aria-label="Remove image"
                              >
                                <X size={16} className="text-white" />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {/* Show existing image URLs */}
                        {imageUrls.filter(url => url.trim() !== '').map((url, index) => (
                          <div key={`existing-url-${index}`} className="relative group rounded-md overflow-hidden shadow-md">
                            <img 
                              src={url} 
                              alt={`Existing URL image ${index + 1}`} 
                              className="h-28 w-full object-cover rounded-md transition-transform group-hover:scale-105"
                              onError={(e) => {
                                // Fallback if the image fails to load
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeImage(index, 'url')}
                                className="bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform scale-90 group-hover:scale-100"
                                aria-label="Remove image"
                              >
                                <X size={16} className="text-white" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* New Images Preview */}
                  {images.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm text-gray-400 mb-3 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>
                        New Images
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {images.map((file, index) => (
                          <div key={`new-image-${index}`} className="relative group rounded-md overflow-hidden shadow-md">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`New image ${index + 1}`} 
                              className="h-28 w-full object-cover rounded-md transition-transform group-hover:scale-105"
                              onError={(e) => {
                                // Fallback if the image fails to load
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedImages = [...images];
                                updatedImages.splice(index, 1);
                                setImages(updatedImages);
                              }}
                              className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform scale-90 group-hover:scale-100"
                              aria-label="Remove image"
                            >
                              <X size={16} className="text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block mb-3 text-sm text-gray-400">Upload New Images</label>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-teal-700 rounded-md cursor-pointer bg-teal-800/20 hover:bg-teal-800/30 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-8 w-8 text-teal-500 mb-2" />
                          <p className="text-sm text-gray-300">Click to upload images</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, or WEBP (max 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleImageChange}
                          accept="image/png, image/jpeg, image/webp"
                          multiple
                        />
                      </label>
                    </div>
                    
                    <div>
                      <label className="block mb-3 text-sm text-gray-400">Image URLs (Optional)</label>
                      <div className="space-y-2">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => {
                                const updatedUrls = [...imageUrls];
                                updatedUrls[index] = e.target.value;
                                setImageUrls(updatedUrls);
                              }}
                              className="flex-1 p-2 rounded-md bg-teal-800/50 border border-teal-700 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                              placeholder="https://example.com/image.jpg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, 'url')}
                              className="ml-2 text-red-400 hover:text-red-300 transition-colors p-2"
                              aria-label="Remove URL"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setImageUrls([...imageUrls, ''])}
                          className="text-teal-400 hover:text-teal-300 text-sm mt-1 flex items-center"
                        >
                          <PlusCircle size={16} className="mr-1" />
                          Add another URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Submit and Cancel Buttons */}
                <div className="border-t border-teal-800 pt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium rounded-md shadow-lg flex items-center justify-center transition-all transform hover:scale-[1.02]"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Check className="h-5 w-5 mr-2" />
                        Update Product
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="py-3 px-6 bg-transparent border border-teal-600 text-teal-400 hover:text-white hover:bg-teal-800/50 font-medium rounded-md transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Products List */}
        <div className="bg-teal-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Product List</h2>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-teal-800/50 h-40 rounded-md"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-teal-800/30 rounded-md p-8 text-center">
                <p className="text-gray-300">No products found. Add your first product!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-teal-800/30 rounded-md overflow-hidden flex flex-col">
                    {/* Product Image */}
                    <div className="h-48 bg-teal-700/30 relative">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].image_url || product.images[0].image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if the image fails to load
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-800/50">
                          <p className="text-gray-400 text-sm">No image</p>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-2 left-2 bg-teal-900/80 px-2 py-1 rounded text-xs font-medium text-white">
                        {product.category.name}
                      </div>
                      
                      {/* Price Badge */}
                      <div className="absolute bottom-2 right-2 bg-amber-500 px-2 py-1 rounded text-xs font-bold text-white">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4 flex-grow">
                      <h3 className="font-medium text-white truncate">{product.title}</h3>
                      
                      {/* Sizes */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.size.map(size => (
                          <span key={size.id} className="bg-teal-700/50 px-2 py-0.5 rounded-full text-xs text-gray-300">
                            {size.size}
                          </span>
                        ))}
                      </div>
                      
                      {/* Description */}
                      <p className="mt-2 text-gray-400 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="border-t border-teal-700/50 p-3 flex justify-between">
                      <button
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                        className="flex items-center text-teal-300 hover:text-teal-200 transition-colors"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;