import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Configuration, OpenAIApi } from 'openai';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db('WebApp');
  const userProfile = await db.collection('users').findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);

  const { jobDescription} = req.body;

  if(!jobDescription) {
    res.status(422);
    return;
  }

  if(jobDescription.length > 600) {
    res.status(422);
    return;
  }

  const postContentResult = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a CV generator.',
      },
      {
        role: 'user',
        content: `Write a long and detailed CV for the following Job Description: ${jobDescription}, extract keywords from it and make sure to include it. Make it with XYZ formatting and should be by MIT standards for CVs. Do not include a summary section in the CV.
        The CV should have a relevant information, Education, Expreience, Projects include a short summary for each project and Skills should be seperated by programming languages,frontend, backend, databases, version control, additional skills, soft skills, etc. 
        The response should be formatted in SEO-friendly HTML, 
        limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.
        h1 will be colored with blue, h2 will be colored with purple.`,
      },
    ],
    temperature: 0,
  });

  const postContent = postContentResult.data.choices[0]?.message.content;

  const titleResult = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a CV generator.',
      },
      {
        role: 'user',
        content: `Write a long and detailed CV for the following Job Description: ${jobDescription}, extract keywords from it and make sure to include it. Make it with XYZ formatting and should be by MIT standards for CVs. Do not include a summary section in the CV.
        The CV should have a relevant information, Education, Expreience, Projects include a short summary for each project and Skills should be seperated by programming languages,frontend, backend, databases, version control, additional skills, soft skills, etc. 
        The response should be formatted in SEO-friendly HTML, 
        limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.
        h1 will be colored with blue, h2 will be colored with purple.`,
      },
      {
        role: 'assistant',
        content: postContent,
      },
      {
        role: 'user',
        content: 'Generate appropriate title tag text for the above CV. You are the person applying for the job.',
      },
    ],
    temperature: 0,
  });

  const summaryResult = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a CV generator.',
      },
      {
        role: 'user',
        content: `Write a long and detailed CV for the following Job Description: ${jobDescription}, extract keywords from it and make sure to include it. Make it with XYZ formatting and should be by MIT standards for CVs. Do not include a summary section in the CV.
        The CV should have a relevant information, Education, Expreience, Projects include a short summary for each project and Skills should be seperated by programming languages,frontend, backend, databases, version control, additional skills, soft skills, etc. 
        The response should be formatted in SEO-friendly HTML, 
        limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.
        h1 will be colored with blue, h2 will be colored with purple.`,
      },
      {
        role: 'assistant',
        content: postContent,
      },
      {
        role: 'user',
        content:
          'You are the person applying for the job. Do not include the letter "I" when talking about self. Generate a short and relevant summary In First Person for the above CV which is yours.',
      },
    ],
    temperature: 0,
  });

  const title = titleResult.data.choices[0]?.message.content;
  const summary =
    summaryResult.data.choices[0]?.message.content;

  console.log('POST CONTENT: ', postContent);
  console.log('TITLE: ', title);
  console.log('META DESCRIPTION: ', summary);

  await db.collection('users').updateOne(
  {
    auth0Id: user.sub,
  },
  {
    $inc: {
      availableTokens: -1,
    },
  }
  );

  const post = await db.collection('posts').insertOne({
    postContent: postContent || '',
    title: title || '',
    summary: summary || '',
    jobDescription,
    userId: userProfile._id,
    created: new Date(),
  });

  res.status(200).json({
    postID: post.insertedId,
  });
});