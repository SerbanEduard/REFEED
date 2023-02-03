import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../../lib/firebase";
import { useContext, useEffect } from "react";
import { UserContext } from "import/lib/context";
import { useRouter } from "next/router";

export default function LoginPage(props) {
    const {user, username} = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if(user) {
            if(username) {
                router.push("/admin");
            } else {
                router.push("/login/usernameform");
            }
        }
    }, [user, username])

    return <SignInButton />
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    }

    return(
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} /> Sign in with Google
        </button>
    )

}
