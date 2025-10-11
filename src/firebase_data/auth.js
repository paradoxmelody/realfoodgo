import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
};

export const requireAuth = async (navigate) => {
    const user = await getCurrentUser();
    if(!user) {
        navigate('./auth');
        return null;
    }
    return user;
};