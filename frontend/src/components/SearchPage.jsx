import { useState } from 'react';
import SearchBar from './SearchBar';
import PostList from './PostList';
import './SearchPage.css';

function SearchPage({ searchCountry, searchUser, onCountryChange, onUserChange, onSearch, searchResults, loggedInUserId, onEdit, onDelete, reactions, onLike, onDislike, onFollow, followedUsers, likedPosts, dislikedPosts }) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const totalPosts = searchResults.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchResults.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div className="search-page-container">
      <h2 className="section-title mb-4">Search Posts</h2>
      <div className="search-bar-section mb-4">
        <SearchBar
          searchCountry={searchCountry}
          searchUser={searchUser}
          onCountryChange={onCountryChange}
          onUserChange={onUserChange}
          onSearch={onSearch}
        />
      </div>
      {totalPosts > 0 ? (
        <>
          <PostList
            posts={currentPosts}
            loggedInUserId={loggedInUserId}
            onEdit={onEdit}
            onDelete={onDelete}
            reactions={reactions}
            onLike={onLike}
            onDislike={onDislike}
            onFollow={onFollow}
            followedUsers={followedUsers}
            likedPosts={likedPosts}
            dislikedPosts={dislikedPosts}
            showTitle={false}
          />
          <div className="pagination-container mt-4">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`btn btn-pagination ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-muted text-center">No search results found.</p>
      )}
    </div>
  );
}

export default SearchPage;