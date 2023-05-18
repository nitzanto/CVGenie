import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";

export default function NewPost(props) {
    console.log('NEW POST PROPS: ', props);
    return (
    <div>
      <h1>homepage</h1>
    </div>
    );
}

NewPost.getLayout = function getLayout(page, pageProps) {
    return <AppLayout {...pageProps}>{page}</AppLayout>
}
  
// Runs server side when the page is run. To render props to the page component
export const getServerSideProps = withPageAuthRequired(() => {

    return {
        props: {},
    };

  });