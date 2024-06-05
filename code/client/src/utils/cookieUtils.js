export function getCookie(name) {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
}

export function setCookie(name, value, options) {
  options = options || {};

  let expires = options.expires;

  if (typeof expires === 'number' && expires) {
      const date = new Date();
      date.setTime(date.getTime() + expires * 1000);
      expires = options.expires = date;
  }

  if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (const key in options) {
      if (options.hasOwnProperty(key)) {
          updatedCookie += '; ' + key;
          const optionValue = options[key];
          if (optionValue !== true) {
              updatedCookie += '=' + optionValue;
          }
      }
  }

  document.cookie = updatedCookie;
}

export function deleteCookie(name) {
  setCookie(name, '', {
      expires: -1
  });
}
