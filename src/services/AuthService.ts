class AuthService {
  private profile: any = null;
  private token: any = null;

  public signin(): Promise<any> {
    return new Promise((resolve, reject) => {
      //@ts-ignore
      if (chrome.identity) {
        chrome.identity.getAuthToken({ interactive: true }, token => {
          //@ts-ignore
          chrome.identity.getProfileUserInfo((profile: any) => {
            this.profile = profile;
            this.token = token;
            resolve();
          });
        });
      } else {
        // not in google extension
        this.token = "test";
        this.profile = {
          email: "test-email@email.com",
          id: "test"
        };
        resolve();
      }
      console.log(this.profile);
      console.log(this.token);
    });
  }

  public getToken() {
    return this.token;
  }
}

export default new AuthService();
