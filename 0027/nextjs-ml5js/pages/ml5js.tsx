import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/ml5'),
  { ssr: false }
)


export default function ml5js() {

  console.log(`ml5js component`);

  return (
    <Layout>
      <Head>
        <title>ml5.js</title>
        <script src="https://unpkg.com/ml5@latest/dist/ml5.min.js"></script>
      </Head>
      <section className={utilStyles.headingMd}>
        <h2>ml5.js</h2>
        <p>Sample ml5.js page.</p>
      </section>
      <DynamicComponentWithNoSSR/>
    </Layout>
  )
}