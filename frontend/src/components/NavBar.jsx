function NavBar({ isLoggedIn, onLogout, onLoginClick, onRegisterClick }) {
  return (
    <nav>
      <a href="/">Home</a> | <a href="/search">Search</a> | 
      {isLoggedIn ? (
        <>
          <a href="/profile">Profile</a> | <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={onLoginClick}>Login</button> | 
          <button onClick={onRegisterClick}>Register</button>
        </>
      )}
    </nav>
  );
}

export default NavBar;