import '../styles/globals.css'
import './signup.css'
import './login.css'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../components/Feed.css'
import AuthWrapper from '../context/auth';
import '../components/Profile.css'
function MyApp({ Component, pageProps }) {

  return (
    <AuthWrapper>
      <Component {...pageProps} />
    </AuthWrapper>
  )
}

export default MyApp
