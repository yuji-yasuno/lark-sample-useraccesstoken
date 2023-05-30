import dotenv from 'dotenv';
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";
dotenv.config();

const INTERNAL_APP_ACCESS_TOKEN_URL = process.env.INTERNAL_APP_ACCESS_TOKEN_URL;
const USER_ACCESS_TOKEN_URL = process.env.USER_ACCESS_TOKEN_URL;
const APP_ID = process.env.APP_ID;
const APP_SECRET = process.env.APP_SECRET;

console.log('INTERNAL_APP_ACCESS_TOKEN_URL: ', INTERNAL_APP_ACCESS_TOKEN_URL);
console.log('USER_ACCESS_TOKEN_URL: ', USER_ACCESS_TOKEN_URL);
console.log('APP_ID: ', APP_ID);
console.log('APP_SECRET: ', APP_SECRET);

async function getAppAccessToken() {
    try {
        const res = await fetch(INTERNAL_APP_ACCESS_TOKEN_URL, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                "app_id": APP_ID,
                "app_secret": APP_SECRET
            })
        });
        const resJson = await res.json();
        return resJson["app_access_token"];
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function Page({params, searchParams}) {
    console.log(params);
    console.log(searchParams);

    let userAccessToken = null;

    const appToken = await getAppAccessToken();
    console.log('appToken: ', appToken);

    const code = searchParams.code;
    if(code) {
        const res = await fetch(USER_ACCESS_TOKEN_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${appToken}`,
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                "grant_type": "authorization_code",
                "code": code
            })
        });
        const resJson = await res.json();
        console.log('resJson: ', resJson);
        userAccessToken = resJson.data["access_token"];
    }
    console.log('userAccessToken', userAccessToken);
    return (
        <>
            <div>Hello! callback</div>
            <div>Code: {searchParams.code}</div>
            <div>access_token: {userAccessToken}</div>
        </>
    );
}

export default Page;