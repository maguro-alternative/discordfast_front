
// Cookieをセットするカスタムフック
export function useSetCookie() {
    const setCookie = (name:string, value:string | number | boolean, days:number) => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + days);
        const cookieValue = `${name}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;
        document.cookie = cookieValue;
    };
    return setCookie;
}

// Cookieを取得するカスタムフック
export function useGetCookie() {
    const getCookie = (name:string) => {
        const cookieName = `${name}=`;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            //console.log(cookies[i])
            let cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return decodeURIComponent(cookie.substring(cookieName.length));
            }
        }
        return undefined;
    };
    return getCookie;
}

// Cookieを削除するカスタムフック
export function useDeleteCookie() {
    const deleteCookie = (name:string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };
    return deleteCookie;
}
