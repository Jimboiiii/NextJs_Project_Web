'use client';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/app/components/header/navBar';

interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export default function MapContent() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const nameSearch = useSearchParams();
  const [accountName, setAccountName] = useState<string | null>('');
  const router = useRouter();

  const currentUser = users.find((u) => u.name === accountName);

  useEffect(() => {
    const searchedAccountName = nameSearch.get('accountName');
    setAccountName(searchedAccountName);
  }, [nameSearch]);

  useEffect(() => {
    if (!accountName || users.length !== 0) return;

    const controller = new AbortController();
    const fetchUsers = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal,
        });
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err: unknown) {
          if (err instanceof Error && err.name !== 'AbortError') {
            console.error('Fetch error:', err);
          }
        }
    };

    fetchUsers();
    return () => controller.abort();
  }, [accountName, users.length]);

  useEffect(() => {
    if (!accountName || users.length === 0) return;

    if (currentUser) {
      setAddress({
        street: currentUser.address.street,
        suite: currentUser.address.suite,
        city: currentUser.address.city,
        zipcode: currentUser.address.zipcode,
        geo: {
          lat: currentUser.address.geo.lat,
          lng: currentUser.address.geo.lng,
        },
      });
    }
  }, [users, accountName, currentUser]);

  useEffect(() => {
    if (!mapContainer.current || !address || mapRef.current) return;

    const coordinates: [number, number] = [parseFloat(address.geo.lng), parseFloat(address.geo.lat)];
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=YLtTkfoUJmQdjCZojdw7',
      center: coordinates,
      zoom: 0,
      attributionControl: false,
    });

    mapRef.current = map;

    const marker = new maplibregl.Marker({ color: '#13cf13' }).setLngLat(coordinates).addTo(map);
    const markerPointer = marker.getElement();
    markerPointer.classList.add('cursor-pointer');

    marker.getElement().addEventListener('click', () => {
      map.flyTo({
        center: coordinates,
        zoom: 14,
        speed: 1.2,
      });
    });

    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.keyboard.disable();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [address]);

  useEffect(() => {
    router.prefetch('/');
  }, [router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  return (
    <main className="h-full bg-[#4267b2]">
      <Navbar />

      <div className="flex flex-col bg-[#f7f7f7] justify-center grow text-black w-full lg:w-[900px] shadow-[10px_0_20px_rgba(0,0,0,0.1)] mx-auto">
        <div className="w-full px-7 pt-5 mb-6">
          <div className="mb-6">
            <div className="mb-2">
              <div className="flex flex-row space-x-1.5 items-baseline w-full">
                <p className="text-xl sm:text-2xl font-bold">{currentUser?.name}</p>
                <p className="text-gray-400 text-xs sm:text-sm font-semibold">{currentUser?.username}</p>
              </div>
              <div className="text-sm font-thin mb-3">
                <span>{currentUser?.email}</span>
              </div>

              <div className="text-lg font-semibold w-full text-center">
                <span className='inline-block text-left'>&quot;{currentUser?.company.catchPhrase}&quot;</span>
              </div>
            </div>
          </div>

          <div className='flex flex-col md:flex-row space-y-6'>
            <div className='flex-1'>
              <h2 className="text-xl font-semibold mb-2">Professional Details</h2>
              <div className="h-[.5px] w-full bg-gray-500 mb-2"></div>
              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="w-28 text-gray-400">Phone:</span>
                  <span>{currentUser?.phone}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-gray-400">Website:</span>
                  <span>{currentUser?.website}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-gray-400">Company:</span>
                  <span>{currentUser?.company.name}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-gray-400">Business:</span>
                  <span>{currentUser?.company.bs}</span>
                </div>
              </div>
            </div>

            <div className='flex-1'>
              <h2 className="text-xl font-semibold mb-2">Personal Address</h2>
              <div className="h-[.5px] w-full bg-gray-500 mb-2"></div>
              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="w-28 text-gray-400">Street:</span>
                  <span>{address?.street}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-gray-400">Suite:</span>
                  <span>{address?.suite}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-gray-400">City:</span>
                  <span>{address?.city}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-gray-400">Zipcode:</span>
                  <span>{address?.zipcode}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <div className="w-full flex justify-center">
          {address && (
            <div className="relative w-full h-[500px] rounded-lg shadow-lg [8px_0_10px_rgba(0,0,0,0.1)] overflow-hidden md:mx-7 mb-5">
              <div ref={mapContainer} className="absolute top-0 shadow-2xl left-0 w-full h-full">
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

