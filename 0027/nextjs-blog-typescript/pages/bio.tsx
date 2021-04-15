import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export default function Home({
  allPostsData
}: {
  allPostsData: {
    date: string
    title: string
    id: string
  }[]
}) {
  return (
    <Layout>
      <Head>
        <title>Bio</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Sample content of bio.</p>
      </section>
    </Layout>
  )
}