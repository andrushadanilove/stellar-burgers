import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '@selectors';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  const { pathname } = useLocation();

  const constructorActive =
    pathname === '/' || pathname.startsWith('/ingredients/');
  const feedActive = pathname === '/feed' || pathname.startsWith('/feed/');
  const profileActive = pathname.startsWith('/profile');

  return (
    <AppHeaderUI
      userName={user?.name}
      constructorActive={constructorActive}
      feedActive={feedActive}
      profileActive={profileActive}
    />
  );
};
