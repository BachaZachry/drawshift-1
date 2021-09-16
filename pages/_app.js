import { Auth } from "@supabase/ui";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import GlobalStyles from "./../components/GlobalStyles";
import { Provider } from 'react-redux'
import { store } from "lib/store";

const queryClient = new QueryClient();
function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
    {/* <Auth.UserContextProvider supabaseClient={supabase}> */}
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    {/* </Auth.UserContextProvider> */}
    </Provider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
//export default MyApp;
