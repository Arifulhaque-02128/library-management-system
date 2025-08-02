import { Metadata } from 'next';
import ProfilePage from './ProfilePage';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOption';

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions); 
  const user = session?.user;

  return {
    title: `${user?.username} | Bookari` || "Profile | Bookari",
    description: "A Digital Library Management System",
  };
}

const Page = async () => {
  return <ProfilePage />;
};

export default Page;