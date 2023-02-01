import React, { useContext } from 'react'
import Link from "next/link"
import { UserContext } from 'import/lib/context'


export default function Navbar() {
  const {user, username} = useContext(UserContext);


  return (
    <nav className="navbar">
        <ul>
            <li>
                <Link href="/">
                    <button className='btn-logo'>FEED</button>
                </Link>
            </li>

            {username && (
                <>
                  <li className="push-left">
                    <Link href="/admin">
                        <button className='btn-blue'>Write Posts</button>
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${username}`}>
                        <img src={user?.photoURL} />
                    </Link>
                  </li>
            
                </>
            )}

            {!username && (
                <li>
                    <Link href="/login">
                        <button className='btn-blue'>Log In</button>
                    </Link>
                </li>
            )}

        </ul>
    </nav>
  )
}
