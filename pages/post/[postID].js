import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default function Post(props) {
  console.log("PROPS: ", props);

  return (
    <div className = "overflow-auto h-full">
      <div className= "max-w-screen-sm mx-auto">
        <div className ="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Blog post
        </div>

        <div dangerouslySetInnerHTML={{__html: props.postContent || ''}} />

      </div>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

//make sure

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProp(ctx) {
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db('WebApp');
    const user = await db.collection('users').findOne({
      auth0Id: userSession.user.sub
    });
    const post = await db.collection('posts').findOne({
      _id: new ObjectId(ctx.params.postID),
      userId: user._id
    })

    if (!post) {
      return {
        redirect: {
          destination: '/post/new',
          permanent: false
        }
      }
    }

    return {
      props: {
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords
      }
    }
  }
});
