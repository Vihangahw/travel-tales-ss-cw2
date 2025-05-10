function AuthForm({ isRegistering, userEmail, userPassword, displayName, onEmailChange, onPasswordChange, onDisplayNameChange, onSubmit }) {
  return (
    <div>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={userEmail}
        onChange={(event) => onEmailChange(event.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={userPassword}
        onChange={(event) => onPasswordChange(event.target.value)}
      />
      {isRegistering && (
        <input
          type="text"
          placeholder="Username"
          value={displayName}
          onChange={(event) => onDisplayNameChange(event.target.value)}
        />
      )}
      <button onClick={onSubmit}>
        {isRegistering ? 'Register' : 'Login'}
      </button>
    </div>
  );
}

export default AuthForm;