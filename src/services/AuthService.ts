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
        return resolve('ya29.a0Ad52N39NmmOWD7-aWZUBNEE_QWkXC0WCv3En3QZbOHbiIlqkBFpr29qLGbOUY1D9AEU-rtkCZAIKqactLzldYH6QHsd-K0SqCnpCa_nPdIQiqyR4M7SvatsNiQJuEeSemHNrMYIXdEWfvHbBJkuPuclQsLu7DLEdzxwaCgYKATgSARMSFQHGX2MiHw6IRJrZdJEY0AsRsfl8AQ0170')
      }
    });
  }
}

export default new AuthService();
