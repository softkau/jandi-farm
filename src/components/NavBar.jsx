'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const NavBar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // 이건 필요한지 아닌지 잘 모르겠네
  const [providers, setProviders] = useState(null);
  useEffect(() => {
    getProviders()
      .then(res => setProviders(res));
  }, []);

  return (
    <nav className="flex-between w-full">
      <div className="flex gap-5 p-2">
        {session?.user ? (
          <>
            <Link href="/profile">
              <Image src={session.user.image}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
              />
            </Link>
            <button
              type="button"
              onClick={signOut}
            >
              &lt;Sign Out&gt;
            </button>
            <button
              type="button"
              onClick={ () => { location.href = '/todo' } }
            >
              &lt;TODO 생성 API&gt;
            </button>
          </> 
        ) : (
          <button
            type="button"
            onClick={signIn}
          >
            &lt;Sign In&gt;
          </button>
        )}
      </div>
    </nav>
  )
}

export default NavBar;