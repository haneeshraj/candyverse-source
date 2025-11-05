import clsx from 'clsx'
import { LinkIcon } from '@phosphor-icons/react'

import { Card, Dropdown } from '@renderer/components'
import { withPageTransition } from '@renderer/components/AnimatedOutlet'

import styles from '@renderer/styles/page/HomePage.module.scss'

function HomePage(): JSX.Element {
  return (
    <div className={styles.main}>
      <h1 className="main-heading">Dashboard</h1>
      <p className="main-description">Welcome to the application dashboard!</p>

      <section className={styles['test-section']}>
        <Dropdown
          items={[
            {
              label: 'test',
              action: () => console.log('testing type shit'),
              value: 'idk gang',
              disabled: true
            },
            {
              label: 'test 2',
              action: () => console.log('testing type'),
              value: 'idk gang 2'
            },
            {
              label: 'test 3',
              action: () => console.log('testing type 3'),
              value: 'idk gang 3'
            }
          ]}
        />
      </section>

      <section className={styles['summary-grid']}>
        <div className={styles['summary-grid__left']}>
          <Card
            className={clsx(styles['summary-grid__item'], styles['summary-grid__item--1'])}
            title="Card 1"
            icons={[{ icon: LinkIcon }, { icon: LinkIcon }]}
          >
            <h2>Card Title</h2>
          </Card>
          <Card
            className={clsx(styles['summary-grid__item'], styles['summary-grid__item--1'])}
            title="Card 1"
            icons={[{ icon: LinkIcon }]}
          >
            <h2>Card Title</h2>
          </Card>
          <Card
            className={clsx(styles['summary-grid__item'], styles['summary-grid__item--3'])}
            title="Card 1"
            icons={[{ icon: LinkIcon }]}
          >
            <h2>Card Title</h2>
          </Card>
        </div>
        <div className={styles['summary-grid__right']}>
          <Card
            className={clsx(styles['summary-grid__item'], styles['summary-grid__item--1'])}
            title="Card 1"
            icons={[{ icon: LinkIcon, align: 'left' }]}
          >
            <h2>Card Title tuties</h2>
          </Card>
          <Card
            className={clsx(styles['summary-grid__item'], styles['summary-grid__item--1'])}
            title="Card 1"
            type="outlined"
            icons={[{ icon: LinkIcon }]}
          >
            <h2>Card Title</h2>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default withPageTransition(HomePage)
