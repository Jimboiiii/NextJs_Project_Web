'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from './components/header/navBar';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const mainUser = session?.user;
  const isAdmin = mainUser?.email === 'admin@admin.com';
  const currentUser = useMemo(() => {
    if (isAdmin || !mainUser || users.length === 0) return null;
    return users.find((user: User) => user.email === mainUser.email);
  }, [isAdmin, mainUser, users]);

  const [showPost, setShowPost] = useState<Post | null>(null);
  const postAuthor = showPost ? users.find((user: User) => user.id === showPost.userId) : null;
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({});
  

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data);
    };

    if (status === 'authenticated') fetchUsers();
  }, [status]);


  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
      setPosts(data);
    };

    if (status === 'authenticated') fetchPosts();
  }, [status]);

  useEffect(() => {
  const fetchComments = async () => {
    if (showPost) {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${showPost.id}`);
      const data = await response.json();
      setCommentsMap((prev) => ({ ...prev, [showPost.id]: data }));
    }
  };

  fetchComments();
}, [showPost]);

  useEffect(() => {
    if (users.length) {
      users.forEach((user: User) => {
        router.prefetch(`/address?account=${user.name}`);
      });
    }
  }, [users, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (showPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showPost]);
  


  if (session) {
    return (
      <main className='bg-[#4267b2] h-full  min-h-screen'>
          <Navbar />

          {showPost && (() => {
            const postAuthor = users.find((user: User) => user.id === showPost.userId);
            return (
              <div className="fixed inset-0 flex justify-center items-center z-500 overflow-auto">
                <div className="bg-gray-100 rounded-lg w-screen h-screen p-8 relative text-black flex flex-col">
                  <button
                    className="absolute top-2 right-2 text-gray-400 active:text-red-600 hover:text-red-600 text-3xl lg:text-4xl"
                    onClick={() => setShowPost(null)}
                  >
                    &times;
                  </button>

                  <div className='flex flex-col lg:flex-row items-start space-x-3 mb-5'>
                    <h1 className="text-2xl font-bold whitespace-nowrap h-fit ">
                      {postAuthor?.name}
                      <span className="text-sm ml-1 font-light text-gray-800">{postAuthor?.email}</span>
                    </h1>

                    <div className='w-full text-center'>
                      <h2 className="text-3xl font-bold inline-block text-left">
                      {showPost.title}
                    </h2>
                    </div>
                    
                  </div>

                  
                  <p className="mb-4">{showPost.body}</p>

                  <h3 className="text-lg font-semibold mb-2">Comments:</h3>

                  <div className="space-y-3 overflow-y-auto">
                    {(commentsMap[showPost.id] || []).map((comment: Comment) => (
                      <div key={comment.id} className="bg-white p-3 rounded border shadow-lg text-md">
                        <h4 className="font-light text-gray-800">{comment.email}</h4>
                        <p className="font-semibold">{comment.name}</p>
                        <p>{comment.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}         
        <div className='w-full lg:w-[900px] bg-[#f7f7f7] grow mx-auto py-5 px-8 '>
          <div className="container mx-auto p-4 w-10/11 md:w-5/6 ">
          <div className="space-y-6">
            {posts
            .filter(post => {
              if (isAdmin) return true;
              return post.userId === currentUser?.id;
            })
            .map((post) => {
              const author = users.find(u => u.id === post.userId);

              return (
                <div key={post.id} className="bg-white shadow-lg p-4 rounded-lg">
                  <button className='w-full cursor-pointer' onClick={() => setShowPost(post)}>
                    <div className='group p-4 -mx-4 -mt-4 rounded-lg text-black active:text-white hover:text-white active:bg-[#1877F2] hover:bg-[#4267b2]'>
                      <div className="flex items-center">
                        <div className="flex flex-col space-x-2 md:flex-row items-center ">
                        <p className="w-full md:w-fit font-semibold text-left text-md md:whitespace-nowrap h-fit mr-0">{author?.name}</p>
                        <div className="md:block w-px h-10 mx-2 bg-black group-hover:bg-white group-active:bg-white hidden "></div>
                        <h3 className="w-full text-left text-lg mx-auto md:text-xl font-bold ">{post.title}</h3>
                      </div>
                      </div>
                    </div>
                  </button>

                     

                  <p className="text-gray-700">{post.body}</p>
                </div>
              );
          })}
          </div>
        </div>
        </div>
        
      </main>
    );
  }

  return null;
}
