import Home from "../components/home";
import Head from 'next/head'


export default function IndexPage() {
  return (
    <div>
       <Head>
        <title>Cody Sims</title>
        <meta
          name="description"
          content="Hey! I'm Cody Sims, and I am a Full Stack Developer at Microsoft and a Brown University Alumni. In my free time, I love to travel"
        />
      </Head>
      <Home />;
    </div>
  )
}
