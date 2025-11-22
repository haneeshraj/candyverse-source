import { withPageTransition } from '@renderer/components/AnimatedOutlet'

import styles from '@renderer/styles/page/HomePage.module.scss'

function HomePage(): JSX.Element {
  // Modal examples

  return (
    <div className={styles.main}>
      <h1 className="main-heading">Dashboard</h1>
      <p className="main-description">Welcome to the application dashboard!</p>
    </div>
  )
}

export default withPageTransition(HomePage)
