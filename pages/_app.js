import 'import/styles/globals.css'
import Navbar from '../components/Navbar'
import Context from '../lib/context';
import { Toaster } from "react-hot-toast"

export default function App({ Component, pageProps }) {
  return (
    <>
      <Context>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </Context>
    </>
  );
}
