// src/components/AnimatedOutlet.tsx
import { useOutlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cloneElement } from 'react'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -20
  }
}

const pageTransition = {
  type: 'tween' as const,
  ease: [0.27, 0, 0, 0.97] as const,
  duration: 0.6
}

function AnimatedOutlet(): JSX.Element {
  const location = useLocation()
  const element = useOutlet()

  return (
    <AnimatePresence mode="wait" initial={false}>
      {element && cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  )
}

// HOC to wrap page components with animation
export function withPageTransition(Component: React.ComponentType) {
  return function AnimatedPage(props: any) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

export default AnimatedOutlet
