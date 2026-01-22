 let token: string | null = null;

export const setToken = (newToken: string) => {
  if (!token) {  // BUG: Only sets if token is null!
    token = newToken;
    console.log("Token set first time:", token);
  }
};

export const getToken = () => token;