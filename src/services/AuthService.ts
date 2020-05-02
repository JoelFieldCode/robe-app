import API from "./Api";

class AuthService {
  private profile: any = null;
  private googleAccessToken: string | null = null;
  private accessToken: string | null = null;

  public signin(): Promise<any> {
    return new Promise((resolve, reject) => {
      //@ts-ignore
      if (chrome.identity) {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          //@ts-ignore
          chrome.identity.getProfileUserInfo((profile: any) => {
            this.profile = profile;
            this.googleAccessToken = token;
            this.authenticate().then(() => resolve());
            console.log(this.googleAccessToken);
          });
        });
      } else {
        // not in google extension
        this.googleAccessToken = "test";
        this.profile = {
          email: "test-email@email.com",
          id: "test",
        };
        this.authenticate().then(() => resolve());
      }
    });
  }

  private async authenticate() {
    try {
      const response = await API.post("/auth/login", null, {
        headers: {
          "google-access-token": this.googleAccessToken,
        },
      });
      this.accessToken = response.data.token;
    } catch (err) {
      console.log(err);
    }
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.getAccessToken()}`,
    };
  }
}

export default new AuthService();
