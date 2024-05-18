export const withError = (err: any) => {
    if (err.response?.errors?.[0].message) {
        throw new Error(err.response.errors[0].message);
    } else {
        throw err;
    }
}