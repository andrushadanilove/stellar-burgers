export function getCookie(name: string): string | undefined {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${escapedName}=([^;]*)`)
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  props: Record<string, string | number | Date | boolean> = {}
) {
  const cookieProps: Record<string, string | number | Date | boolean> = {
    path: '/',
    ...props
  };

  let expires = cookieProps.expires;
  if (expires && typeof expires === 'number') {
    const date = new Date();
    date.setTime(date.getTime() + expires * 1000);
    expires = date;
  }

  if (expires instanceof Date) {
    cookieProps.expires = expires.toUTCString();
  }

  let updatedCookie = `${name}=${encodeURIComponent(value)}`;
  Object.entries(cookieProps).forEach(([propName, propValue]) => {
    updatedCookie += `; ${propName}`;
    if (propValue !== true) {
      updatedCookie += `=${propValue}`;
    }
  });

  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, '', { expires: -1 });
}
