import { createContext } from "react";
import AuthHook from "./hooks";

export const UserContext = createContext({ user: null, username: null });

export default function Context({ children }) {

    const userData = AuthHook();

    return(
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    )
}