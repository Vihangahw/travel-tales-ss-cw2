function NewPost({ newPost, onPostChange, onSubmit }) {
  return (
    <div>
      <h2>Create Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={newPost.postTitle}
        onChange={(event) => onPostChange({ ...newPost, postTitle: event.target.value })}
      />
      <input
        type="text"
        placeholder="Content"
        value={newPost.postContent}
        onChange={(event) => onPostChange({ ...newPost, postContent: event.target.value })}
      />
      <input
        type="text"
        placeholder="Country"
        value={newPost.countryVisited}
        onChange={(event) => onPostChange({ ...newPost, countryVisited: event.target.value })}
      />
      <input
        type="date"
        value={newPost.visitDate}
        onChange={(event) => onPostChange({ ...newPost, visitDate: event.target.value })}
      />
      <button onClick={onSubmit}>Create Post</button>
    </div>
  );
}

export default NewPost;