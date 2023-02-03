import React from 'react'
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from 'lodash.debounce';
import { useState, useCallback, useContext, useEffect  } from 'react';
import { UserContext } from 'import/lib/context';
import { firestore } from 'import/lib/firebase';
import { useRouter } from 'next/router';

export default function UsernameForm() {
    const [formValue, setFormValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const {user, username} = useContext(UserContext);

    useEffect(() => {
        checkUsername(formValue);
        if(username) {
            router.push("/admin");
        }
    }, [formValue, username]);

    const onChange = (e) =>{
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if(val.length < 3){
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if(re.test(val)){
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    const checkUsername = useCallback(
        debounce(async (username) => {
        if(username.length >= 3){
            const ref = doc(firestore, "usernames", `${username}`)
            const docSnap = await getDoc(ref);
            console.log("read");
            setIsValid(!docSnap.exists());
            setLoading(false);
        }
    }, 500),
    []
    );

    const onSubmit = async (e) =>{
        e.preventDefault();

        const userDoc = doc(firestore, `users/${user.uid}`);
        const usernameDoc = doc(firestore, `usernames/${formValue}`);

        const batch = writeBatch(firestore);
        batch.set(userDoc, {username: formValue, photoURL: user.photoURL, displayName: user.displayName});
        batch.set(usernameDoc, {uid: user.uid});

        await batch.commit();
    }

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={onChange} />

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading}></UsernameMessage>

                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>
                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );

    function UsernameMessage({username, isValid, loading}) {
        if(loading){
            return <p>Checking...</p>
        } else if (isValid) {
            return <p className="text-success">{username} is available!</p>
        } else if (username && !isValid){
            return <p className="text-danger">That username is taken or it is not valid!</p>
        } else {
            return <p></p>
        }
    }
}
