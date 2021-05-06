import { Auth } from "@supabase/ui";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from "recoil";
import { supabase } from "../lib/initSupabase";
import "../styles/globals.css";
import GlobalStyles from "./../components/GlobalStyles";



const queryClient = new QueryClient()
function MyApp({ Component, pageProps }) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <GlobalStyles />
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </RecoilRoot>

    </Auth.UserContextProvider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
//export default MyApp;
