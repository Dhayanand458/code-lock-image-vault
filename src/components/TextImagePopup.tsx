
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { ImageArea } from './ImageArea';

interface TextImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (images: string[]) => void;
  existingImages: string[];
}

export const TextImagePopup: React.FC<TextImagePopupProps> = ({
  isOpen,
  onClose,
  onSave,
  existingImages
}) => {
  const [images, setImages] = useState<string[]>(existingImages);

  if (!isOpen) return null;

  const addImage = () => {
    setImages([...images, '']);
  };

  const updateImage = (index: number, image: string) => {
    const newImages = [...images];
    newImages[index] = image;
    setImages(newImages);
  };

  const deleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSave = () => {
    onSave(images.filter(img => img.trim()));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-4/5 max-h-4/5 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Manage Images for Text</h2>
          <div className="flex space-x-2">
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
              Done
            </button>
            <button onClick={onClose} className="p-1">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <button
            onClick={addImage}
            className="flex items-center justify-center mx-auto p-2 bg-blue-500 text-white rounded"
          >
            <Plus size={16} className="mr-1" />
            Create Image
          </button>
        </div>

        <div className="space-y-4">
          {images.map((image, index) => (
            <ImageArea
              key={index}
              image={image}
              onImageChange={(newImage) => updateImage(index, newImage)}
              onDelete={() => deleteImage(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
