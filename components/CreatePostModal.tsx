'use client';

import { useState } from 'react';

export default function CreatePostModal({ createPostAction }: { createPostAction: (formData: FormData) => Promise<void> }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Right Sponsor Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-emerald-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-emerald-900 transition-colors font-medium z-40"
      >
        + Create Project
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Post New Project</h2>
            
            <form 
              action={async (formData) => {
                await createPostAction(formData);
                setIsOpen(false);
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  name="title"
                  required
                  placeholder="Title"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}