import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";

export default function TokenTopUp() {
    
    const handleClick = async () => {
      await fetch(`/api/addTokens`, {
        method: 'POST'
      })
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