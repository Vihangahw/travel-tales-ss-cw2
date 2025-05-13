import './UpdatePost.css';

function UpdatePost({ post, onPostChange, onSubmit, onCancel }) {
  return (
    <div className="update-post-container">
      <div className="card shadow-sm update-post">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Edit Post</h2>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Title"
              value={post.postTitle}
              onChange={(event) => onPostChange({ ...post, postTitle: event.target.value })}
              className="form-control update-post-input"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Content"
              value={post.postContent}
              onChange={(event) => onPostChange({ ...post, postContent: event.target.value })}
              className="form-control update-post-input"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Country"
              value={post.countryVisited}
              onChange={(event) => onPostChange({ ...post, countryVisited: event.target.value })}
              className="form-control update-post-input"
            />
          </div>
          <div className="mb-3">
            <input
              type="date"
              value={post.visitDate}
              onChange={(event) => onPostChange({ ...post, visitDate: event.target.value })}
              className="form-control update-post-input"
            />
          </div>
          <div className="d-flex gap-2">
            <button onClick={onSubmit} className="btn btn-update w-50">
              Update Post
            </button>
            <button onClick={onCancel} className="btn btn-cancel w-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;