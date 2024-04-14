class AuthService {
  public signin(): Promise<string> {
    return new Promise((resolve, reject) => {
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
        return resolve('test')
      }
    });
  }
}

export default new AuthService();
