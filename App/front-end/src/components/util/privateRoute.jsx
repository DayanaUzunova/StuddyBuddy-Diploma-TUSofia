import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAllowed, redirectPath = '/', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PrivateRoute;
