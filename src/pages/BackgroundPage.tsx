
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, ArrowLeft, ArrowRight } from 'lucide-react';
import { TemplateCreatePopup } from '../components/TemplateCreatePopup';
import { TextImagePopup } from '../components/TextImagePopup';
import { getProjectData, updateProjectTemplates } from '../services/firestore';
import { Template } from '../types';

export const BackgroundPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<number | null>(null);
  const [selectedTemplateForImages, setSelectedTemplateForImages] = useState<number | null>(null);

  useEffect(() => {
    if (code) {
      loadProjectData();
    }
  }, [code]);

  const loadProjectData = async () => {
    if (!code) return;
    try {
      const data = await getProjectData(code);
      setTemplates(data.templates);
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  };

  const saveTemplate = (texts: string[], selectedIndex: number) => {
    if (editingTemplate !== null) {
      // Edit existing template
      const newTemplates = [...templates];
      newTemplates[editingTemplate] = {
        ...newTemplates[editingTemplate],
        texts,
        selectedIndex
      };
      setTemplates(newTemplates);
      updateProjectTemplates(code!, newTemplates);
    } else {
      // Create new template
      const newTemplate: Template = {
        id: templates.length + 1,
        texts,
        selectedIndex,
        images: []
      };
      const newTemplates = [...templates, newTemplate];
      setTemplates(newTemplates);
      updateProjectTemplates(code!, newTemplates);
    }
    setEditingTemplate(null);
  };

  const deleteTemplate = (index: number) => {
    const newTemplates = templates.filter((_, i) => i !== index);
    // Renumber templates
    const renumberedTemplates = newTemplates.map((template, i) => ({
      ...template,
      id: i + 1
    }));
    setTemplates(renumberedTemplates);
    updateProjectTemplates(code!, renumberedTemplates);
  };

  const navigateText = (templateIndex: number, direction: 'prev' | 'next') => {
    const template = templates[templateIndex];
    let newIndex = template.selectedIndex;
    
    if (direction === 'prev') {
      newIndex = newIndex > 0 ? newIndex - 1 : template.texts.length - 1;
    } else {
      newIndex = newIndex < template.texts.length - 1 ? newIndex + 1 : 0;
    }

    const newTemplates = [...templates];
    newTemplates[templateIndex] = { ...template, selectedIndex: newIndex };
    setTemplates(newTemplates);
    updateProjectTemplates(code!, newTemplates);
  };

  const editTemplate = (index: number) => {
    setEditingTemplate(index);
    setShowCreatePopup(true);
  };

  const openImageManager = (templateIndex: number) => {
    setSelectedTemplateForImages(templateIndex);
    setShowImagePopup(true);
  };

  const saveTemplateImages = (images: string[]) => {
    if (selectedTemplateForImages !== null) {
      const newTemplates = [...templates];
      newTemplates[selectedTemplateForImages] = {
        ...newTemplates[selectedTemplateForImages],
        images
      };
      setTemplates(newTemplates);
      updateProjectTemplates(code!, newTemplates);
    }
    setSelectedTemplateForImages(null);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Background Templates - Code: {code}</h1>
          <button
            onClick={() => navigate(`/images/${code}`)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Back to Images
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <button
              onClick={() => {
                setEditingTemplate(null);
                setShowCreatePopup(true);
              }}
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600"
            >
              <Plus size={24} />
            </button>
          </div>

          {templates.map((template, index) => (
            <div key={template.id} className="space-y-2">
              <div className="flex items-center space-x-4 p-4 border rounded bg-gray-50">
                <span className="font-bold">#{template.id}</span>
                <button
                  onClick={() => openImageManager(index)}
                  className="flex-1 text-left p-2 bg-white border rounded hover:bg-gray-100"
                >
                  {template.texts[template.selectedIndex] || 'Empty text'}
                </button>
                <button
                  onClick={() => navigateText(index, 'prev')}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={() => navigateText(index, 'next')}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => deleteTemplate(index)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => editTemplate(index)}
                  className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  <Edit size={16} />
                </button>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => {
                    setEditingTemplate(null);
                    setShowCreatePopup(true);
                  }}
                  className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TemplateCreatePopup
        isOpen={showCreatePopup}
        onClose={() => {
          setShowCreatePopup(false);
          setEditingTemplate(null);
        }}
        onSave={saveTemplate}
        existingTexts={editingTemplate !== null ? templates[editingTemplate]?.texts : []}
        existingSelectedIndex={editingTemplate !== null ? templates[editingTemplate]?.selectedIndex : -1}
      />

      <TextImagePopup
        isOpen={showImagePopup}
        onClose={() => {
          setShowImagePopup(false);
          setSelectedTemplateForImages(null);
        }}
        onSave={saveTemplateImages}
        existingImages={selectedTemplateForImages !== null ? templates[selectedTemplateForImages]?.images || [] : []}
      />
    </div>
  );
};
