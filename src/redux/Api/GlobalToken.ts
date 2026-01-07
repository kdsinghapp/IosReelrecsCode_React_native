// GlobalToken.ts
let token: string | null = null;

export const setToken = (newToken: string) => {
  if (!token) {  
    token = newToken;
    console.log("Token set first time:", token);
  }
};

export const getToken = () => token;
