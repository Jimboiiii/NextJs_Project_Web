'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Navbar } from '../components/header/navBar';
import { useSession } from 'next-auth/react';
import ApexCharts from 'apexcharts';

interface User {
  id: number;
  username: string;
}

interface Post {
  userId: number;
  id: number;
}

const colors = ['#1877F2'];

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.name === 'Admin';
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
      const users: User[] = await usersResponse.json();
      const userCount = users.length;

      const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
      const posts: Post[] = await postsResponse.json();
      const postCount = posts.length;

      const commentResponse = await fetch('https://jsonplaceholder.typicode.com/comments');
      const comments: Post[] = await commentResponse.json();
      const commentCount = comments.length;

      const ApexCharts = (await import('apexcharts')).default;

      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }

      const adminChartOptions: ApexCharts.ApexOptions = {
        series: [{
          name: 'Count',
          data: [userCount, postCount, commentCount],
        }],
        chart: {
          type: 'bar',
          height: 350,
          background: 'transparent',
        },
        colors: colors,
        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true,
          },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
          categories: ['Users', 'Posts', 'Comments'],
          labels: {
            style: {
              colors: 'black',
              fontSize: '16px',
              fontWeight: '300',
            },
          },
          title: {
            text: 'Category',
            style: {
              color: '#4c4646',
              fontSize: '16px',
              fontWeight: 600,
            },
          },
        },
        yaxis: {
          title: {
            text: 'Value',
            style: {
              color: '#4c4646',
              fontSize: '16px',
              fontWeight: 600,
            },
          },
          labels: {
            style: {
              colors: 'black',
              fontSize: '14px',
            },
          },
        },
        tooltip: { intersect: false },
        grid:{
          borderColor: '#333333'
        }
      };

      

      if (chartRef.current) {
        chartInstance.current = new ApexCharts(chartRef.current, adminChartOptions);
        chartInstance.current.render();
      }
    };

    fetchDataAndRenderChart();
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (!isAdmin && session) {
      router.push('/');
    }
  }, [status, router, isAdmin, session]);

  if (session && isAdmin) {

  return (
    <main className="min-h-screen bg-[#4267b2] flex flex-col">
      <Navbar />
      <div className="bg-[#f7f7f7] grow w-full lg:w-[900px] shadow-[10px_0_20px_rgba(0,0,0,0.1)] mx-auto py-5 px-8 text-center">
        <h1 className="text-2xl font-bold mb-8 text-gray-800"> Count of Users, Posts, and Comments</h1>
        <div ref={chartRef} className="bg-white shadow-lg w-full max-w-4xl h-[400px] mx-auto p-4 rounded" />
      </div>
    </main>
  );}
}
