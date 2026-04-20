import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from '../firebase/firebase.init';
import AuthContext from "./AuthContext";
import { useEffect, useState } from "react";

const auth = getAuth(app);

const AuthProvider = ({children}) => {
    const [user, setUser]=useState(null);
    const [loading, setLoading]=useState(true);

    const logIn=(email, password)=>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
            .finally(()=> setLoading(false));
    }

    const logOut=()=>{
        setLoading(true);
        return signOut(auth)
            .finally(()=> setLoading(false));
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, currentUser =>{
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    },[])

    const authInfo={
        user,
        loading,
        logIn,
        logOut,
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;