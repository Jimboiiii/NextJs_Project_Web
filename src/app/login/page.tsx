'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const LoginFormSchema = z.object({
    email: z.string({required_error: 'Email is required.'},
    ).email('Invalid email address.'),
    password: z.string({required_error: 'Email is required.'},
    ).min(1, 'Input a password.')
})

type LoginFormSchemaType =z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
    const router = useRouter();

    const form = useForm<LoginFormSchemaType>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: LoginFormSchemaType) => {
        const result = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password,
        });
         if (!result?.error){
            router.push('/');
        } else{
            setError('email', { type: 'manual', message: 'Invalid email or password' });
            setError('password', { type: 'manual', message: 'Invalid email or password' });
        };
    };

    const {handleSubmit, register, setError, formState} = form;

    const {errors} = formState;


    
    useEffect(() => {
        router.prefetch('/');
    }, [router]);


    useEffect(()=> {
        router.prefetch('/register');
    }, [router])

    return (
        <main className="min-h-screen flex items-start py-[25vh] justify-center p-6  bg-[#f7f7f7]">
            <div className="w-[430px] h-fit max-w-md border bg-white shadow-md rounded-lg px-2 py-6 sm:px-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="mb-6">
                        <label htmlFor="loginEmail" className="block mb-2 text-md font-medium text-[#898F9C]">Email</label>
                        <input {...register('email')} type="email" id="loginEmail" placeholder="Enter your email" className={`block w-full p-2.5 text-sm text-black placeholder-450 bg-transparent border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500  rounded-md`} />
                        {errors.email && (
                            <span className='text-sm text-red-500'>{errors.email.message}</span>
                        ) }
                    </div>

                    <div className="mb-4">
                        <label htmlFor="loginPassword" className="block mb-2 text-md font-medium text-[#898F9C]">Password</label>
                        <input {...register('password')} type="password" id="loginPassword" placeholder="Enter your password" className={`block w-full p-2.5 text-sm text-black placeholder-450 bg-transparent border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500  rounded-md`} />
                        {errors.password && (
                            <span className='text-sm text-red-500'>{errors.password.message}</span>
                        )}
                    </div>

                    <div className='mb-4'>
                        <button type="submit" className="relative items-center justify-center p-0.5 mt-2 text-md font-medium rounded-md  bg-blue-600 active:bg-[#898f9c] hover:bg-blue-500 text-white w-full cursor-pointer">
                        <p className="relative px-5 py-2.5 transition-all ease-in duration-75 w-full">
                            Login
                        </p>
                        </button>
                    </div>

                    <div >
                        <p className="text-sm font-semibold text-[#637bad]">
                        Don&apos;t have an account? <Link prefetch={true} href="/register" className="italic font-medium text-[gray-300] underline active:text-[#13cf13] hover:text-[#13cf13]">Register here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
}
