import { useAuth } from '../hooks/useAuth.js';
import { useLogout } from '../hooks/useAuthMutations.js';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="user-info">
        <h3>Welcome, {user.name || user.email}!</h3>
        <p>Email: {user.email}</p>
        {user.name && <p>Name: {user.name}</p>}
      </div>
      
      <button 
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
        className="logout-button"
      >
        {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
};

export default UserProfile;
