'use client'
import { PhoneInput } from '@/components/ui/phone-input';
import {useState, useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



const RegisterFormSchema = z.object({
    firstName: z.string({required_error: 'First name is required.'},
    ).min(2, 'First name is too short.'),
    lastName: z.string({required_error: 'Last name is required.'},
    ).min(2, 'Last name is too short.'),
    email: z.string({required_error: 'Email is required.'},
    ).email('Invalid email address.'),
    phone: z.string({required_error: 'Phone is required.'},
    ).refine((val) => isValidPhoneNumber(val), {
    message: 'Invalid phone number for the country.',
  }),
    coordinate: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
    password: z.string({required_error: 'Password is required.'},
    ).min(8, 'Password must be greater than 8 characters.'),

}).superRefine(
    (data, ctx) =>{
        const names = data.firstName.trim().split(/\s+/);
        if (!data.firstName.match(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'First name must contain only letters',
                path: ['firstName'],
            });
        } else if (names.length > 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Two names only.',
                path: ['firstName'],
            });
        }
        if (!data.lastName.match(/^[a-zA-Z]+$/)){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Last name must contain only letters',
                path: ['lastName'],
            });
        }
        if (data.coordinate.latitude === 0 && data.coordinate.longitude === 0) {
        ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a location on the map.',
        path: ['coordinate'],
        });
    }        
    }
)


type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>;



export default function RegistrationPage(){
    const router = useRouter();
    const mapContainer = useRef(null);
    const mapRef = useRef<maplibregl.Map | null> (null);
    const markerRef = useRef<maplibregl.Marker | null> (null);
    const [phone, setPhone] = useState('');
    const [coordinates, setCoordinates] = useState({
        latitude: 0,
        longitude: 0,
    })

    const form = useForm<RegisterFormSchemaType>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            coordinate: {
                latitude: 0,
                longitude: 0,
                },
            password: '',

        }
    });

    const onSubmit = (data: RegisterFormSchemaType) => {
        setValue('phone', phone, { shouldValidate: true });
        if (data.coordinate.latitude === 0 && data.coordinate.longitude === 0) {
            const coordinateInput = document.getElementById('map');
            coordinateInput?.focus();
            return;
        }
    };

    const {handleSubmit, register, setValue, formState, clearErrors} = form;

    const { errors } = formState

    function normalizeLongitude(lng: number): number{
        return((lng + 180) % 360 +360) % 360-180;
    }

    useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style:
        'https://api.maptiler.com/maps/streets/style.json?key=YLtTkfoUJmQdjCZojdw7',
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 0,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      const normalizedLng = normalizeLongitude(lng).toFixed(8);
      const fixedLat = lat.toFixed(8);

      const newLat = Number(fixedLat);
      const newLng = Number(normalizedLng);

      setCoordinates({
        latitude: newLat,
        longitude: newLng,
      });

      setValue('coordinate.latitude', newLat, { shouldValidate: true });
        setValue('coordinate.longitude', newLng, { shouldValidate: true });

        clearErrors('coordinate');


      if (markerRef.current) {
        markerRef.current.setLngLat([newLng, newLat]);
      } else {
        markerRef.current = new maplibregl.Marker({ color: '#13cf13' })
          .setLngLat([newLng, newLat])
          .addTo(map);
      }
    });

    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.keyboard.disable();

    return () => map.remove();
  }, [setValue]);

  useEffect(() => {
    router.prefetch('/login');
  }, [router]);


    return (
        <section className="bg-[#f7f7f7]">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
            <div className="w-full bg-white rounded-md border md:mt-0 max-w-fit xl:p-0  shadow-md">
                <div className=" p-6 space-y-2 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-[#898F9C] w-full text-left border-b-[.5px] border-gray-400">Create an account</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 flex flex-col lg:flex-row gap-x-6 text-[#898F9C]" action="#">


                        <div className="flex flex-col justify center items-center w-full lg:w-[376px] h-[300px] z-50">
                            <div ref={mapContainer} id='map' className="w-[100%] h-full block" />
                            {errors.coordinate && typeof errors.coordinate.message === 'string' && (
                                <span className="text-sm text-red-500">{errors.coordinate.message}</span>
                            )}
                        </div>

                    <div className='space-y-4'>
                        <div className="flex flex-row space-x-4">
                            <div className="w-full">

                                <input {...register('firstName')} type="text" name="firstName" id="firstName" placeholder="First Name"  className="block w-full p-2.5 text-sm text-black placeholder-450 bg-transparent border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500  rounded-md" />
                                {errors.firstName && (
                                    <span className='text-red-500 text-xs w-45'>{errors.firstName.message}</span>
                            )}
                            
                            </div>
                            <div className="w-full">
                                <input {...register('lastName')} type="text" name="lastName" id="lastName" placeholder="Last Name"  className="block w-full p-2.5 text-sm text-black placeholder-450 bg-transparent border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500  rounded-md" />
                                {errors.lastName && (
                                <span className='text-red-500 text-xs'>{errors.lastName.message}</span>
                            )}
                            </div>
                        </div>
                        <div>
                        <input {...register('email')} type="email" name="email" id="email" placeholder="Email"  className="block w-full p-2.5 text-sm text-black placeholder-450 bg-transparent border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500  rounded-md" />
                        {errors.email && (
                                <span className='text-red-500 text-xs w-45'>{errors.email.message}</span>
                            )}
                        </div>

                        <div>
                            <PhoneInput placeholder='Phone Number' name="phone" id="phone"
                             onChange={(value) => setPhone(value)}
                            />
                            {errors.phone && (
                                <span className='text-red-500 text-xs'>{errors.phone.message}</span>
                            )}
                        </div>

                        <div>
                        <input {...register('password')} type="password" name="password" id="password" placeholder="Password"  className="block w-full p-2.5 text-sm text-black placeholder-450 bg-transparent border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500  rounded-md" />
                        {errors.password && (
                                <span className='text-red-500 text-xs'>{errors.password.message}</span>
                            )}
                        </div>

                        <div className='mb-4'>
                        <button type="submit" className="relative items-center justify-center p-0.5 mt-2 text-md font-medium rounded-md  bg-[#159015] active:bg-[#898f9c]  hover:bg-[#13cf13] text-white w-full cursor-pointer">
                        <p className="relative px-5 py-2.5 transition-all ease-in duration-75 w-full">
                            Sign Up
                        </p>
                        </button>

                    </div>
                        <p className="text-sm font-semibold text-[#637bad]">Already have an account? <Link prefetch={true} href="/login" className="italic font-medium text-[gray-300] underline active:text-blue-500 hover:text-blue-500">Login here</Link></p>
                    </div>
                </form>
                </div>
            </div>
            </div>
        </section>
);

}