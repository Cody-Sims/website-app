import Home from "../components/home";
import Head from 'next/head'


export default function IndexPage() {
  return (
    <div>
       <Head>
        <title>Cody Sims</title>
        <meta
          name="description"
          content="Explore my journey as a Full Stack Developer and Blogger from Brown University. Discover innovative projects, professional insights from internships at Microsoft and Cisco, and thrilling travel stories"
        />
      </Head>
      <Home />;
    </div>
  )
}
