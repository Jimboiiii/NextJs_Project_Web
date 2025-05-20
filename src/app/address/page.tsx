'use client';
import dynamic from 'next/dynamic';

const MapContent = dynamic(() => import('../../components/mapComponent/mapContent'), {
  ssr: false,
});

export default function AddressPage() {
  return <MapContent />;
}