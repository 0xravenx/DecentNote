import React, { useState } from 'react';
import { uploadToIPFS } from '../utils/ipfs';
import './NoteEditor.css';

const NoteEditor = ({ onSave }) => {
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');

  const handleSave = async () => {
    if (!content.trim() && !title.trim()) return;

    setIsSaving(true);
    try {
      const noteData = {
        title: title || 'Untitled',
        content,
        createdAt: new Date().toISOString(),
      };

      const ipfsHash = await uploadToIPFS(JSON.stringify(noteData));
      await onSave(ipfsHash, isPrivate);

      setContent('');
      setTitle('');
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="note-editor">
      <div className="editor-header">
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
        <div className="privacy-toggle">
          <label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            Private note
          </label>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your decentralized note here..."
        className="content-textarea"
        rows="10"
      />

      <button
        onClick={handleSave}
        disabled={isSaving || (!content.trim() && !title.trim())}
        className="save-btn"
      >
        {isSaving ? 'Saving to IPFS...' : 'Save to Blockchain'}
      </button>
    </div>
  );
};

export default NoteEditor;