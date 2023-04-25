import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function AuthHook(){
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);
    useEffect(() => {
        let unsubscribe;
        if (user){
            const ref = doc(firestore, `users/${user.uid}`);
            unsubscribe = onSnapshot(ref, (doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }

        return unsubscribe;
    }, [user])

    return {user, username};
}
