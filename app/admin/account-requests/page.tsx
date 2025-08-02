import { Metadata } from 'next';
import AccountReqPage from './AccountReqPage';

export const metadata: Metadata = {
  title: "Account Requests | Bookari",
  description: "A Digital Library Management System",
};

const Page = async () => {
  return <AccountReqPage /> ;
};

export default Page;