import clsx from 'clsx'
import { LinkIcon } from '@phosphor-icons/react'

import { Card, NotificationDemo } from '@renderer/components'
import { withPageTransition } from '@renderer/components/AnimatedOutlet'

import styles from './styles.module.scss'

function HomePage(): JSX.Element {
  return (
    <div className={styles.main}>
      <h1 className="main-heading">Dashboard</h1>
      <p className="main-description">Welcome to the application dashboard!</p>

      <section className={styles['summary-grid']}>
        <div className={styles['summary-grid__left']}>
          <Card
            className={clsx(styles['summary-grid__item'], styles['summary-grid__item--1'])}
            title="Card 1"
            icon={<LinkIcon size={24} />}
          >
            <h2>Card Title</h2>
          </Card>
          <Card
            className={clsx(styles['summary-grid__item'], styles['summary-grid__item--1'])}
            title="Card 1"
            icon={<LinkIcon size={24} />}
          >
            <h2>Card Title</h2>
          </Card>
          <Card
            className={clsx(styles['summary-grid__item'], styles['summary-grid__item--1'])}
            title="Card 1"
            icon={<LinkIcon size={24} />}
          >
            <h2>Card Title</h2>
          </Card>
        </div>
        <div className={styles['summary-grid__right']}>
          <Card
            className={clsx(styles['summary-grid__item'], styles['summary-grid__item--1'])}
            title="Card 1"
            icon={<LinkIcon size={24} />}
          >
            <h2>Card Title tuties</h2>
          </Card>
          <Card
            className={clsx(styles['summary-grid__item'], styles['summary-grid__item--1'])}
            title="Card 1"
            icon={<LinkIcon size={24} />}
          >
            <h2>Card Title</h2>
          </Card>
        </div>
      </section>

      <NotificationDemo />
    </div>
  )
}

export default withPageTransition(HomePage)
