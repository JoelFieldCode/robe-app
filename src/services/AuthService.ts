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
        return resolve('ya29.a0Ad52N38nkCiqo4TUCPEwkTbSUYo0BJYmoBs4zEK1hmJ-x_VopJ8B7cxHjVaQSoFEgcbiBAxRvdqVkKlbDGhp2n8n01qkYfABEdqK6_dhO9ZWVdAeIz1lBYcBVBDnWgOwx8mHniJ5loGDWe5QqOqSMouHtn8CfSUJLA4aCgYKAXESARMSFQHGX2Mi_rTxnCrmqxd4EyyeZ77GDQ0170')
      }
    });
  }
}

export default new AuthService();
