class AuthService {
  public signin(): Promise<string> {
    return new Promise((resolve, _reject) => {
      //@ts-ignore
      if (chrome.identity) {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          //@ts-ignore
          chrome.identity.getProfileUserInfo((profile: any) => {
            console.log(token);
            return resolve(token)
          });
        });
      } else {
        return resolve(import.meta.env.VITE_DEV_TOKEN)
      }
    });
  }
}

export default new AuthService();
