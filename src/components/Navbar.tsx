import React from 'react'
import Link from 'next/link'
import { useSession , signOut } from 'next-auth/react'
import { User } from 'next-auth'

const Navbar = () => {
    const { data : session } = useSession();
    const user : User = session?.user as User;
  return (
    <div>
        <div>
            <h1>
                MessageApp
            </h1>
            {
              session && session.user ? (
                <>
                <div>
                    <span>
                        Welcome, {user.name}
                    </span>
                    <span>
                        {user.email}
                    </span>
                </div>
                <div>
                    <button onClick={() => signOut()}>
                        logout
                    </button>
                </div>
                </>
              ):(
                <div>
                    <Link href="/sign-in">Sign In</Link>
                </div>
              )
            }
        </div>
    </div>
  )
}

export default Navbar