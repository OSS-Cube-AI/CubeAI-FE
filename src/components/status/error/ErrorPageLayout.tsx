import Layout from '@/components/layout/Layout';

interface ErrorPageLayoutProps {
  children: React.ReactNode;
}

export default function ErrorPageLayout({ children }: ErrorPageLayoutProps) {
  return <Layout direction="column">{children}</Layout>;
}
