import React from 'react';
import { X, Upload, Camera, Video } from 'lucide-react';

const ProjectProgressModal = ({ 
  isOpen, 
  onClose, 
  projectId, 
  newUpdate, 
  setNewUpdate, 
  onSubmit, 
  onFileUpload 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Add Progress Update</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Progress Note</label>
            <textarea
              value={newUpdate.note}
              onChange={(e) => setNewUpdate({...newUpdate, note: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Describe the current progress..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Photos/Videos</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => onFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Click to upload photos and videos</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, MP4, MOV up to 10MB each</p>
              </label>
            </div>
          </div>

          {newUpdate.files.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Selected Files:</p>
              <div className="space-y-2">
                {newUpdate.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center">
                      {file.type === 'photo' ? (
                        <Camera className="w-4 h-4 text-blue-500 mr-2" />
                      ) : (
                        <Video className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm text-slate-700">{file.name}</span>
                    </div>
                    <button
                      onClick={() => setNewUpdate(prev => ({
                        ...prev,
                        files: prev.files.filter((_, i) => i !== index)
                      }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onSubmit}
              disabled={!newUpdate.note && newUpdate.files.length === 0}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Add Update
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressModal;