import { FC, PropsWithChildren } from 'react';
import { Location, Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { selectIsAuthChecked, selectUser, selectUserLoading } from '@selectors';

type TProtectedRouteProps = PropsWithChildren<{
  onlyUnAuth?: boolean;
}>;

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isLoading = useSelector(selectUserLoading);
  const location = useLocation();

  if (!isAuthChecked || isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const state = location.state as TLocationState | null;
    const from = state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
