import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'

// NextJS basically wraps the entire app

function MyApp({ Component, pageProps }) {
  return <UserProvider><Component {...pageProps} /></UserProvider>
}

export default MyApp
