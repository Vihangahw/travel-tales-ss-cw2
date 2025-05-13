import { useState } from 'react';
import './NewPost.css';

function NewPost({ newPost, onPostChange, onSubmit }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="new-post-container">
      <button onClick={() => setShowForm(!showForm)} className="btn btn-create-post mb-3">
        {showForm ? 'Cancel' : 'Create Post'}
      </button>
      {showForm && (
        <div className={`card shadow-sm new-post ${showForm ? 'expanded' : ''}`}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Create Post</h2>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Title"
                value={newPost.postTitle}
                onChange={(event) => onPostChange({ ...newPost, postTitle: event.target.value })}
                className="form-control new-post-input"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Content"
                value={newPost.postContent}
                onChange={(event) => onPostChange({ ...newPost, postContent: event.target.value })}
                className="form-control new-post-input"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Country"
                value={newPost.countryVisited}
                onChange={(event) => onPostChange({ ...newPost, countryVisited: event.target.value })}
                className="form-control new-post-input"
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                value={newPost.visitDate}
                onChange={(event) => onPostChange({ ...newPost, visitDate: event.target.value })}
                className="form-control new-post-input"
              />
            </div>
            <button onClick={onSubmit} className="btn btn-create w-100">
              Create Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewPost;