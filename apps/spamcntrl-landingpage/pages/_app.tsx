import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import { Provider } from "react-redux";
import { store } from "../store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </AuthProvider>
  );
}
