'use client';
import { useRouter, useSearchParams,usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from 'next/link';


type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export function Navbar() {

  const router = useRouter();
  const pathname = usePathname();

  const { data: session} = useSession();
  const mainUser = session?.user;
  const [users, setUsers] = useState<User[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownMenu = useRef<HTMLDivElement | null>(null);
  const dropdownUsers = useRef<HTMLDivElement | null>(null);
  const [showUsers, showUsersMenu] = useState(false);
  const searchAccount = useSearchParams();
  const selectedUser = searchAccount.get('accountName');

  const toggleUsersMenu = () => showUsersMenu(prev => !prev);
  const toggleProfileMenu = () => setMenuOpen(prev => !prev);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);



  useEffect(() => {
  const outsideClick = (e: MouseEvent) => {
    if (dropdownMenu.current && !dropdownMenu.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  };

  if (menuOpen) {
    document.addEventListener("click", outsideClick);
    return () => document.removeEventListener("click", outsideClick);
  }
}, [menuOpen]);


  useEffect(() => {
    const usersOutsideClick = (e: MouseEvent) => {
      if (dropdownUsers.current && !dropdownUsers.current.contains(e.target as Node)) {
        showUsersMenu(false);
      }
    };
    if (showUsers) {
      document.addEventListener("click", usersOutsideClick);
    } else {
      document.removeEventListener("click", usersOutsideClick);
    }
    return () => {
      document.removeEventListener("click", usersOutsideClick);
    };
  }, [showUsers]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const navigateToHome = () => {
    router.push('/');
  };

  useEffect(()=> {
    router.prefetch('/dashboard');
    router.prefetch('/');

  }, [router]);

  

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] relatve h-fit">
        <div className="flex flex-wrap items-center mx-auto py-2 px-8 justify-between">
          <button onClick={toggleUsersMenu} className={`item-center cursor-pointer md:p-0 bg-white hover:text-[#4267B2] ${showUsers ? "text-[#4267B2]" : "text-gray-500"}`}>
            <span className="sr-only">Show users</span>
            <svg className="w-[48px] h-[48px] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clipRule="evenodd"/>
            </svg>
          </button>

          <Link
            href="/"
            prefetch
            className={`text-lg font-extrabold md:p-0 active:text-[#4267B2]  ${pathname === "/" ? "text-[#4267B2] cursor-default" : "hover:text-[#4267B2] text-gray-500 cursor-pointer"}`}
          >
            Posts
          </Link>

          <div className="relative flex items-center space-x-3">
            <div className='relative'>
              <button onClick={toggleProfileMenu} className={`flex cursor-pointer text-sm hover:bg-[#4267b2] rounded-full ${menuOpen ? "bg-[#4267b2]" : "bg-gray-500"}`}>
                <span className="sr-only">Open user menu</span>
                <svg className={`w-[48px] h-[48px] text-white`} fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="1" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>

              {menuOpen && mainUser && (
                <div ref={dropdownMenu} className=" bg-white border-white border-3 shadow-2xl absolute right-0 top-14 z-50 rounded-lg ">
                  <button className={`${mainUser?.name === 'Admin' ? null: `cursor-pointer active:bg-[#4267b2] hover:bg-[#4267b2] hover:text-white active:text-white`} ${selectedUser === mainUser.name ? "bg-[#4267b2] text-white rounded-t-lg" : "text-gray-500 "}`}



                  onClick={() => {
                    if (mainUser?.name !== 'Admin') {
                      router.push(`/address?accountName=${mainUser.name}`);
                    }
                  }}
                  >
                    <div className="px-4 pt-3 pb-2 text-left border-b-3 border-white">
                      <span className="block text-sm font-semibold">{mainUser.name}</span>
                      <span className="block text-sm ">{mainUser.email}</span>
                    </div>
                  </button>
                  <ul className="text-[#333333]">
                    {mainUser?.name === 'Admin' && (<li className={`${pathname === '/dashboard' ? 'bg-[#4267b2] text-white': "bg-transparent "} active:bg-[#4267b2] hover:bg-[#4267b2] hover:text-white active:text-white `}>
                    <Link href="/dashboard" prefetch={true} className="block px-4 py-3 text-sm">Dashboard</Link></li>)}
                    <li className="active:bg-[#4267b2] hover:bg-[#4267b2] hover:text-white active:text-white rounded-b-lg"><a href="#" onClick={(e) => {e.preventDefault(); handleSignOut();}} className="block px-4 py-2 text-sm ">Sign out</a></li>
                  </ul>
                </div>
              )}



              
            </div>
          </div>
        </div>
      </div>

      {showUsers && (
      <div ref={dropdownUsers} className=" z-50 fixed scrollbar-hidden w-55 border-r border-[.5px] border-solid border-t-gray-600 shadow-[4px_0_10px_rgba(0,0,0,0.1)] bg-white rounded-br-lg top-[64px] bottom-0 overflow-y-auto overflow-x-hidden ">
      {mainUser?.name && (
        <ul className=" py-2">
          {users.map((user: User) => {
            if (mainUser.name === user.name) return null;
            return (
              <li key={user.id} className="">
                
                <button
                  onClick={() => 
                    {mainUser?.name === 'Admin' ? router.push(`/address?accountName=${user.name}`) : null}
                  }
                  className={` w-full px-5 py-2.5 relative inline-flex items-center justify-left overflow-hidden text-sm font-medium group  ${mainUser?.name === 'Admin' ? `cursor-pointer active:bg-[#4267b2] hover:bg-[#4267b2]  active:text-white hover:text-white focus:outline-none 
                    ${selectedUser === user.name ?  'bg-[#4267b2] text-white' : "bg-transparent text-gray-500"}`: "cursor-defaultr" } `}
                >
                    <div className="text-left">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs">{user.username}</p>
                    </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
    )}
    </div>
  );
}