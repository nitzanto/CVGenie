import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function TokenTopUp() {
    
    const handleClick = async () => {
      const result = await fetch(`/api/addTokens`, {
        method: 'POST'
      })
      const json = await result.json()
      console.log('RESULT: ' , json)
      window.location.href = json.session.url
    }
    
    return <div>
      <h1>hy</h1>
      <button className="btn" onClick={handleClick}>Add tokens</button>
    </div>;
  }
  

  TokenTopUp.getLayout = function getLayout(page, pageProps) {
    return <AppLayout {...pageProps}>{page}</AppLayout>
}

  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
      const props = await getAppProps(ctx)
      return {
        props
      }
    }
  });