import { useState } from 'react'

import { useRouter } from 'next/router'
import Head from 'next/head'

import styles from './main.module.css'

const preventDefault = f => e => {
  e.preventDefault()
  f(e)
}

export default () => {

  const router = useRouter()
  const [user, setUser] = useState('')

  const handleForm = setValue => e => setValue(e.target.value)

  const handleSubmit = preventDefault(() => {
    router.push({
      pathname: `/user/${user}`,
    })
  })

  return (
    <div className="container">
      <Head>
        <title>OpenProfile</title>
      </Head>

      <main className={styles.main_div}>
        <h1 className={styles.header}>OpenProfile</h1>

        <div className={styles.content}>
          <h1 className={styles.tagline}>Create and share your open-source profile</h1>
          <p className={styles.bottomline}>Built with, built for and hosted on GitHub!</p>
          <form className="pure-form" onSubmit={handleSubmit}>
            <input type="text" value={user} className={styles.user_input} onChange={handleForm(setUser)} placeholder="Your GitHub username" />
            <button type="submit" className={styles.user_submit_large + " pure-button"}>View Profile</button>
          </form>
        </div>
      </main>
    </div>
  );
};