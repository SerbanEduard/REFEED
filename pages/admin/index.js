import { signOut } from "firebase/auth"
import { UserContext } from "import/lib/context"
import { auth } from "import/lib/firebase"
import { useRouter } from "next/router";
import { useContext, useEffect } from "react"


export default function AdminPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();


  useEffect(() => {
    if(!user) {
      router.push("/login");
    }
  }, [user])

  return (
    <button onClick={() => signOut(auth)}>Sign Out</button>
  )
}
