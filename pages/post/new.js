import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";

export default function NewPost(props) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywords, setKeyWords] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/generatePost`, {
      method: 'POST',
      headers: {
        'content-type' : 'application/json',
      },
      body: JSON.stringify({ topic, keywords}),

    });

    const json = await response.json();
    console.log("Result: ", json);
    if(json?.postID){
      router.push(`/post/${json.postID}`)
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Generate a blog post on the topic of:</strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <label>
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={keywords}
            onChange={(e) => setKeyWords(e.target.value)}
          />
        </div>

        <button type="submit" className="btn">
          Generate
        </button>
      </form>

   
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

// Runs server side when the page is run. To render props to the page component
export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
