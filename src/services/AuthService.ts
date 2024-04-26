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
        return resolve('ya29.a0Ad52N38Lb1PdHNC0bu0Hdv1faG6tm4qvlvbU3XWb8Cn1RuFBHRfLoIrzvCG1JOuJ6p2eMlWK5rakraeCVZICXwuK_heLnr29-ic6tAulUbvqe3Ssls_pIxUoW9PGInq4xhrbglNyc72RDSYYWKF3Oo4LbI7Vu9wFzE4aCgYKAbkSARMSFQHGX2Mi0CKpNIzisPeWGo1OY7cMNA0170')
      }
    });
  }
}

export default new AuthService();
