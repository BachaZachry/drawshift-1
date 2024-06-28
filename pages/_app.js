import dynamic from 'next/dynamic';
import '../styles/globals.css';
import GlobalStyles from './../components/GlobalStyles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
//export default MyApp;
