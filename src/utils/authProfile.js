// The session credential belongs only in the server's HttpOnly cookie.
export const safeAuthProfile = (profile) => {
  if (!profile || typeof profile !== 'object' || typeof profile._id !== 'string') return null;
  return {
    _id: profile._id,
    name: typeof profile.name === 'string' ? profile.name : '',
    email: typeof profile.email === 'string' ? profile.email : '',
    role: profile.role === 'admin' ? 'admin' : 'customer',
  };
};

export const persistAuthProfile = (profile) => {
  const safeProfile = safeAuthProfile(profile);
  try {
    if (safeProfile) localStorage.setItem('ace_user', JSON.stringify(safeProfile));
    else localStorage.removeItem('ace_user');
  } catch {
    // Cookie authentication still works when browser storage is unavailable.
  }
  return safeProfile;
};

export const readAuthProfile = () => {
  try {
    const saved = localStorage.getItem('ace_user');
    // Rewrite legacy records to remove tokens or any other unexpected fields.
    return persistAuthProfile(saved ? JSON.parse(saved) : null);
  } catch {
    return persistAuthProfile(null);
  }
};
