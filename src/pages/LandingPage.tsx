
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCodePopup } from '../components/CreateCodePopup';

export const LandingPage: React.FC = () => {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [enterCode, setEnterCode] = useState('');
  const [showEnterField, setShowEnterField] = useState(false);
  const navigate = useNavigate();

  const handleCreateCode = (code: string) => {
    navigate(`/images/${code}`);
  };

  const handleEnterCode = () => {
    if (enterCode.trim()) {
      navigate(`/images/${enterCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <button
          onClick={() => setShowCreatePopup(true)}
          className="block w-48 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
        >
          Create Code
        </button>
        
        <button
          onClick={() => setShowEnterField(true)}
          className="block w-48 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600"
        >
          Enter Code
        </button>

        {showEnterField && (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={enterCode}
              onChange={(e) => setEnterCode(e.target.value)}
              placeholder="Enter existing code"
              className="w-48 p-2 border rounded"
            />
            <button
              onClick={handleEnterCode}
              className="block w-48 bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              Access Code
            </button>
          </div>
        )}
      </div>

      <CreateCodePopup
        isOpen={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onCreateCode={handleCreateCode}
      />
    </div>
  );
};
