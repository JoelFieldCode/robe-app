import API from "./Api";

class AuthService {
  public signin(): Promise<any> {
    return new Promise((resolve, reject) => {
      //@ts-ignore
      if (chrome.identity) {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          //@ts-ignore
          chrome.identity.getProfileUserInfo((profile: any) => {
            console.log(token);
            this.authenticate(token)
              .then((accessToken) => resolve(accessToken))
              .catch((err) => {
                reject(err);
              });
          });
        });
      } else {
        this.authenticate("test")
          .then((accessToken) => resolve(accessToken))
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  private async authenticate(googleAccessToken: string) {
    try {
      const response = await API.post<{ auth: boolean, token: string }>("/auth/login", null, {
        headers: {
          "google-access-token": googleAccessToken,
        },
      });
      if (!response.data.auth) {
        throw new Error('Unauthenticated')
      }
      return response.data.token
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
