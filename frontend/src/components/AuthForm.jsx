import './AuthForm.css';

function AuthForm({ isRegistering, userEmail, userPassword, displayName, onEmailChange, onPasswordChange, onDisplayNameChange, onSubmit }) {
  return (
    <div className="auth-form-container">
      <div className="card shadow-sm auth-form">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">{isRegistering ? 'Register' : 'Login'}</h2>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              value={userEmail}
              onChange={(event) => onEmailChange(event.target.value)}
              className="form-control auth-input"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              value={userPassword}
              onChange={(event) => onPasswordChange(event.target.value)}
              className="form-control auth-input"
            />
          </div>
          {isRegistering && (
            <div className="mb-3">
              <input
                type="text"
                placeholder="Username"
                value={displayName}
                onChange={(event) => onDisplayNameChange(event.target.value)}
                className="form-control auth-input"
              />
            </div>
          )}
          <button onClick={onSubmit} className="btn btn-auth w-100">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;