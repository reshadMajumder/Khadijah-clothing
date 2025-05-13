import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../data/ApiUrl';
import toast from 'react-hot-toast';
import { PlusCircle, X, Upload, Check, AlertCircle } from 'lucide-react';

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

const EditProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authTokens } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  useEffect(() => {
    // Fetch product data
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/admin/products/${id}/`, {
          headers: { 'Authorization': `Bearer ${authTokens?.access}` },
        });
        const data = await response.json();
        if (response.ok && data) {
          setOriginalProduct(data);
          setTitle(data.title || '');
          setDescription(data.description || '');
          setPrice(data.price ? data.price.toString() : '');
          setCategoryId(data.category ? data.category.id : '');
          setSelectedSizes(data.size ? data.size.map((s: Size) => s.id) : []);
          // Images
          if (data.images && data.images.length > 0) {
            const fileImages = data.images
              .filter((img: ProductImage) => img.image && !img.image_url)
              .map((img: ProductImage) => `${API_BASE_URL}${img.image}`);
            const urlImages = data.images
              .filter((img: ProductImage) => img.image_url)
              .map((img: ProductImage) => img.image_url || '');
            setImagePreviewUrls(fileImages);
            setImageUrls(urlImages.length > 0 ? urlImages : ['']);
          } else {
            setImagePreviewUrls([]);
            setImageUrls(['']);
          }
        } else {
          setError('Failed to load product data');
        }
      } catch (err) {
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, authTokens]);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/categories/`);
        const data = await response.json();
        if (data.status === 'success' && data.categories) {
          setCategories(data.categories);
        }
      } catch {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch sizes
    const fetchSizes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/sizes/`);
        const data = await response.json();
        if (data.status === 'success' && data.sizes) {
          setAvailableSizes(data.sizes);
        }
      } catch {}
    };
    fetchSizes();
  }, []);

  // Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setImages([...images, ...fileList]);
      setImagePreviewUrls([...imagePreviewUrls, ...fileList.map(file => URL.createObjectURL(file))]);
    }
  };
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
  const toggleSize = (sizeId: string) => {
    setSelectedSizes(prev => prev.includes(sizeId) ? prev.filter(id => id !== sizeId) : [...prev, sizeId]);
  };

  // Submit logic (same as in ManageProducts)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !description || !price || selectedSizes.length === 0 || !categoryId) {
      setError('Please fill in all fields and select at least one size');
      return;
    }

    // Validate image URLs
    const invalidUrls = imageUrls.filter(url => url.trim() !== '' && !isValidUrl(url));
    if (invalidUrls.length > 0) {
      setError('Please enter valid image URLs');
      return;
    }

    setFormLoading(true);
    try {
      const formData = new FormData();
      let hasChanges = false;
      if (!originalProduct || title !== originalProduct.title) { formData.append('title', title); hasChanges = true; }
      if (!originalProduct || description !== originalProduct.description) { formData.append('description', description); hasChanges = true; }
      if (!originalProduct || price !== originalProduct.price.toString()) { formData.append('price', price); hasChanges = true; }
      if (!originalProduct || categoryId !== originalProduct.category.id) { formData.append('category', categoryId); hasChanges = true; }
      
      // Sizes
      const origSizes = originalProduct ? originalProduct.size.map(s => s.id).sort() : [];
      const newSizes = selectedSizes.slice().sort();
      if (!originalProduct || JSON.stringify(origSizes) !== JSON.stringify(newSizes)) {
        selectedSizes.forEach(sizeId => formData.append('size', sizeId));
        hasChanges = true;
      }

      // Handle images
      // Get original image URLs
      const originalUrls = originalProduct?.images
        ?.filter(img => img.image_url)
        .map(img => img.image_url) || [];
      
      // Get current image URLs (excluding empty ones)
      const currentUrls = imageUrls.filter(url => url.trim() !== '');
      
      // Check if URLs have changed
      const urlsChanged = JSON.stringify(originalUrls.sort()) !== JSON.stringify(currentUrls.sort());
      
      if (urlsChanged) {
        // Add all current URLs
        currentUrls.forEach((url, idx) => {
          formData.append(`images[${idx}][image_url]`, url);
        });
        hasChanges = true;
      }

      // Add new image files
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

      const url = `${API_BASE_URL}api/admin/products/${id}/`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authTokens?.access}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Failed to update product';
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.success('Product updated successfully!');
        navigate('/admin/products');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // Helper function to validate URLs
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

  return (
    <div className="pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="bg-teal-900 rounded-lg shadow-lg p-6">
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-300 mb-1">Product Title*</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded-md bg-teal-800 border border-teal-700 text-white" placeholder="Enter product title" />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-300 mb-1">Description*</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full p-2 rounded-md bg-teal-800 border border-teal-700 text-white" placeholder="Enter product description"></textarea>
          </div>
          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-300 mb-1">Price*</label>
            <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 rounded-md bg-teal-800 border border-teal-700 text-white" placeholder="Enter price" min="0" step="0.01" />
          </div>
          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-300 mb-1">Category*</label>
            <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-2 rounded-md bg-teal-800 border border-teal-700 text-white">
              {categories.length === 0 ? <option value="">Loading categories...</option> : categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </div>
          {/* Sizes */}
          <div className="mb-4">
            <span className="block text-gray-300 mb-2">Available Sizes*</span>
            <div className="flex flex-wrap gap-2">
              {availableSizes.length === 0 ? <div className="text-gray-400 text-sm">Loading sizes...</div> : availableSizes.map(size => (
                <button key={size.id} type="button" onClick={() => toggleSize(size.id)} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${selectedSizes.includes(size.id) ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white' : 'bg-teal-800 text-white hover:bg-teal-700'}`}>{size.size}</button>
              ))}
            </div>
          </div>
          {/* Images */}
          <div className="mb-6">
            <span className="block text-gray-300 mb-2">Product Images</span>
            {/* Existing Images */}
            {(imagePreviewUrls.length > 0 || imageUrls.some(url => url.trim() !== '')) && (
              <div className="mb-4">
                <h4 className="text-sm text-gray-400 mb-2">Existing Images:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={`existing-preview-${index}`} className="relative group">
                      <img 
                        src={url} 
                        alt={`Existing image ${index + 1}`} 
                        className="h-28 w-full object-cover rounded-md" 
                        onError={e => (e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image')} 
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
                  {imageUrls.filter(url => url.trim() !== '').map((url, index) => (
                    <div key={`existing-url-${index}`} className="relative group">
                      <img 
                        src={url} 
                        alt={`Existing URL image ${index + 1}`} 
                        className="h-28 w-full object-cover rounded-md" 
                        onError={e => (e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image')} 
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((file, index) => (
                    <div key={`new-image-${index}`} className="relative group">
                      <img src={URL.createObjectURL(file)} alt={`New image ${index + 1}`} className="h-28 w-full object-cover rounded-md" onError={e => (e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image')} />
                      <button type="button" onClick={() => { const updatedImages = [...images]; updatedImages.splice(index, 1); setImages(updatedImages); }} className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image"><X size={16} className="text-white" /></button>
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
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" multiple />
            </label>
          </div>
          {/* Image URLs */}
          <div className="mb-6">
            <span className="block text-gray-300 mb-2">Product Image URLs (Optional)</span>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex items-center mb-2">
                <input type="url" value={url} onChange={e => { const updatedUrls = [...imageUrls]; updatedUrls[index] = e.target.value; setImageUrls(updatedUrls); }} className="flex-1 p-2 rounded-md bg-teal-800 border border-teal-700 text-white" placeholder="https://example.com/image.jpg" />
                <button type="button" onClick={() => removeImage(index, 'url')} className="ml-2 text-red-400 hover:text-red-300 transition-colors p-2" aria-label="Remove URL"><X size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} className="text-teal-400 hover:text-teal-300 text-sm mt-1 flex items-center"><PlusCircle size={16} className="mr-1" />Add another URL</button>
          </div>
          {/* Submit and Cancel Buttons */}
          <div className="flex space-x-3">
            <button type="submit" className="btn btn-primary flex-1 py-3 flex items-center justify-center" disabled={formLoading}>
              {formLoading ? (<span className="flex items-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Updating...</span>) : (<span className="flex items-center"><Check className="h-5 w-5 mr-2" />Update Product</span>)}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-secondary py-3 px-6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct; 