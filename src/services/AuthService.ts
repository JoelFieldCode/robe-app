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
      await API.get("/sanctum/csrf-cookie");
      const response = await API.post("/api/login", null, {
        headers: {
          "google-access-token": googleAccessToken,
        },
      });
      return response.data.plainTextToken;
    } catch (err) {}
  }
}

export default new AuthService();
