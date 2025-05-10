function UpdatePost({ post, onPostChange, onSubmit, onCancel }) {
  return (
    <div>
      <h2>Edit Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={post.postTitle}
        onChange={(event) => onPostChange({ ...post, postTitle: event.target.value })}
      />
      <input
        type="text"
        placeholder="Content"
        value={post.postContent}
        onChange={(event) => onPostChange({ ...post, postContent: event.target.value })}
      />
      <input
        type="text"
        placeholder="Country"
        value={post.countryVisited}
        onChange={(event) => onPostChange({ ...post, countryVisited: event.target.value })}
      />
      <input
        type="date"
        value={post.visitDate}
        onChange={(event) => onPostChange({ ...post, visitDate: event.target.value })}
      />
      <button onClick={onSubmit}>Update Post</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default UpdatePost;