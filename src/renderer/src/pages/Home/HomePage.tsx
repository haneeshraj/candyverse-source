// Core Libraries (React)

// Third-Party Libraries
import clsx from 'clsx'
import { LinkIcon } from '@phosphor-icons/react'

// @ based imports (path aliases)
import { Card, Dropdown, Modal, Button } from '@renderer/components'
import { withPageTransition } from '@renderer/components/AnimatedOutlet'
import useModal from '@renderer/hooks/useModal'

// ./ or ../ based imports (relative imports)
import styles from '@renderer/styles/page/HomePage.module.scss'

function HomePage(): JSX.Element {
  // Modal examples
  const infoModal = useModal()
  const confirmModal = useModal()
  const warningModal = useModal()

  return (
    <div className={styles.main}>
      <h1 className="main-heading">Dashboard</h1>
      <p className="main-description">Welcome to the application dashboard!</p>

      {/* Modal Examples Section */}
      <section className={styles['test-section']}>
        <h2>Modal Examples</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button variant="primary" onClick={infoModal.open}>
            Open Info Modal
          </Button>
          <Button variant="secondary" onClick={confirmModal.open}>
            Open Confirmation Modal
          </Button>
          <Button variant="error" onClick={warningModal.open}>
            Open Warning Modal
          </Button>
        </div>
      </section>

      {/* Info Modal - Just information with close button */}
      <Modal
        isOpen={infoModal.isOpen}
        onClose={infoModal.close}
        title="Information"
        variant="info"
        size="md"
      >
        <p>This is a simple informational modal. You can close it by:</p>
        <ul>
          <li>Clicking the X button in the top right</li>
          <li>Clicking outside the modal</li>
          <li>Pressing the Escape key</li>
        </ul>
      </Modal>

      {/* Confirmation Modal - With action buttons */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        title="Delete Item"
        variant="success"
        size="sm"
      >
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </Modal>

      {/* Warning Modal - Custom variant */}
      <Modal
        isOpen={warningModal.isOpen}
        onClose={warningModal.close}
        title="Warning"
        variant="warning"
        size="md"
        confirmText="I Understand"
        onConfirm={warningModal.close}
      >
        <p style={{ marginBottom: '1rem' }}>
          <strong>Important:</strong> This is a warning modal example.
        </p>
        <p>You can use this for important notices that require user acknowledgment.</p>
      </Modal>

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
              label: 'PLEASEWORK PLEASE WORK',
              action: () => console.log('testing type 3'),
              value: 'PLEASE WOK PLEASE WORK'
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
