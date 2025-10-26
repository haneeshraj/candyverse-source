// src/pages/NotFoundPage.tsx
import { withPageTransition } from '../../components/AnimatedOutlet'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.scss'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={`${styles['page']} ${styles['page-center']}`}>
      <h1>404</h1>
      <p>Page not found</p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.6rem',
          borderRadius: '0.8rem',
          border: 'none',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-button-primary-text)',
          cursor: 'pointer'
        }}
      >
        Go Home
      </button>
    </div>
  )
}

export default withPageTransition(NotFoundPage)
