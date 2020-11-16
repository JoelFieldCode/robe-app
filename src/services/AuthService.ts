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
            this.authenticate(token).then((accessToken) =>
              resolve(accessToken)
            );
          });
        });
      } else {
        this.authenticate("test").then((accessToken) => resolve(accessToken));
      }
    });
  }

  private async authenticate(googleAccessToken: string) {
    try {
      const response = await API.post("/auth/login", null, {
        headers: {
          "google-access-token": googleAccessToken,
        },
      });
      return response.data.token;
    } catch (err) {}
  }
}

export default new AuthService();
