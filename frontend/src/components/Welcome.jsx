import { useRef, useEffect } from 'react';
import PostList from './PostList';
import AuthForm from './AuthForm';
import './Welcome.css';

function Welcome({ recentPosts, loggedInUserId, onEdit, onDelete, reactions, onLike, onDislike, onFollow, followedUsers, likedPosts, dislikedPosts, isRegistering, userEmail, userPassword, displayName, onEmailChange, onPasswordChange, onDisplayNameChange, onSubmit, showAuthForm, setShowAuthForm }) {
  const authFormRef = useRef(null);

  const handleFormSubmit = () => {
    onSubmit();
    setShowAuthForm(false);
  };

  useEffect(() => {
    if (showAuthForm && authFormRef.current) {
      authFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showAuthForm]);

  return (
    <div className="welcome-container">
      <div className="card shadow-sm welcome">
        <div className="card-body text-center">
          <h1 className="welcome-title card-title">TravelTales: A Global Journey Through Stories</h1>
          <p className="welcome-text card-text">
            Welcome to TravelTales, a vibrant community-driven platform where wanderlust meets storytelling. Our platform seamlessly integrates real-time country data with personal travel experiences, creating a unique space for travellers to share their adventures and connect with fellow explorers worldwide.
          </p>
          <p className="welcome-text card-text">
            TravelTales transforms traditional travel blogging by enriching personal narratives with authentic country information. When you share your story about walking through the bustling streets of Tokyo or experiencing the serene beaches of Bali, our platform automatically enhances your post with accurate details about the country.
          </p>
        </div>
      </div>
      {showAuthForm && (
        <div className="auth-form-section mt-5" ref={authFormRef}>
          <AuthForm
            isRegistering={isRegistering}
            userEmail={userEmail}
            userPassword={userPassword}
            displayName={displayName}
            onEmailChange={onEmailChange}
            onPasswordChange={onPasswordChange}
            onDisplayNameChange={onDisplayNameChange}
            onSubmit={handleFormSubmit}
          />
        </div>
      )}
      {recentPosts.length > 0 ? (
        <PostList
          posts={recentPosts}
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
        />
      ) : (
        <p className="text-muted text-center">No recent posts available.</p>
      )}
    </div>
  );
}

export default Welcome;