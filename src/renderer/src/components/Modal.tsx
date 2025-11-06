// Core Libraries (React)
import { useEffect, useRef, useState, type FC, type ReactNode } from 'react'

// Third-Party Libraries
import { motion, AnimatePresence } from 'motion/react'
import { XIcon } from '@phosphor-icons/react'

// @ based imports (path aliases)
import useClickOutside from '@renderer/hooks/useClickOutside'

// ./ or ../ based imports (relative imports)
import styles from '@renderer/styles/components/Modal.module.scss'

export type ModalVariant = 'info' | 'confirmation' | 'warning' | 'error' | 'success'
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  variant?: ModalVariant
  size?: ModalSize
  showCloseButton?: boolean
  footer?: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  confirmDisabled?: boolean
  confirmLoading?: boolean
  className?: string
  contentClassName?: string
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  variant = 'info',
  size = 'md',
  showCloseButton = true,
  footer,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmDisabled = false,
  confirmLoading = false,
  className,
  contentClassName
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const isConfirmationModal = variant === 'confirmation' || onConfirm !== undefined
  const [isShaking, setIsShaking] = useState(false)

  // Derive confirm button variant from modal variant
  const confirmVariant =
    variant === 'error' ? 'error' : variant === 'warning' ? 'warning' : 'primary'

  // Determine if modal can be dismissed
  const canDismiss = !isConfirmationModal

  // Trigger shake animation
  const triggerShake = () => {
    if (isShaking) return // Prevent multiple triggers
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  // Handle click outside - only if can dismiss
  useClickOutside(modalRef, () => {
    if (isOpen && !confirmLoading) {
      if (canDismiss) {
        onClose()
      } else {
        triggerShake()
      }
    }
  })

  // Handle Escape key - only if can dismiss
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !confirmLoading) {
        if (canDismiss) {
          onClose()
        } else {
          triggerShake()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, canDismiss, confirmLoading, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle confirm action
  const handleConfirm = async () => {
    if (onConfirm && !confirmDisabled && !confirmLoading) {
      await onConfirm()
    }
  }

  // Handle cancel action
  const handleCancel = () => {
    if (confirmLoading) return
    if (onCancel) {
      onCancel()
    } else {
      onClose()
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            ref={modalRef}
            className={`${styles.modal} ${styles[`modal--${variant}`]} ${styles[`modal--${size}`]} ${className || ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: isShaking ? [0, -10, 10, -10, 10, 0] : 0,
              boxShadow: isShaking ? '0 0 10px var(--color-error)' : undefined,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={styles.modal__header}>
                {title && (
                  <h2 id="modal-title" className={styles.modal__title}>
                    {title}
                  </h2>
                )}
                {/* Only show close button if not confirmation modal */}
                {showCloseButton && canDismiss && !confirmLoading && (
                  <button
                    className={styles.modal__close}
                    onClick={onClose}
                    aria-label="Close modal"
                    type="button"
                  >
                    <XIcon size={24} weight="bold" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={`${styles.modal__content} ${contentClassName || ''}`}>{children}</div>

            {/* Footer */}
            {(footer || isConfirmationModal) && (
              <div className={styles.modal__footer}>
                {footer ? (
                  footer
                ) : isConfirmationModal ? (
                  <>
                    <button
                      className={`${styles.modal__button} ${styles['modal__button--secondary']}`}
                      onClick={handleCancel}
                      disabled={confirmLoading}
                      type="button"
                    >
                      {cancelText}
                    </button>
                    <button
                      className={`${styles.modal__button} ${styles[`modal__button--${confirmVariant}`]}`}
                      onClick={handleConfirm}
                      disabled={confirmDisabled || confirmLoading}
                      type="button"
                    >
                      {confirmLoading ? 'Loading...' : confirmText}
                    </button>
                  </>
                ) : null}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
