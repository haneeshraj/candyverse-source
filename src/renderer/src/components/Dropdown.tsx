import React, { useState, useRef } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'
import clsx from 'clsx'

import useClickOutside from '@renderer/hooks/useClickOutside'

import styles from '@renderer/styles/components/Dropdown.module.scss'
import { AnimatePresence, motion } from 'motion/react'

interface DropdownItem {
  label: string
  value: string
  action: () => void
  disabled?: boolean
  isDefault?: boolean
}

interface DropdownProps {
  items: DropdownItem[]
  defaultValue?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  defaultValue,
  placeholder = 'Select an option',
  className,
  disabled = false,
  onChange
}) => {
  const defaultItem = items.find((item) => item.isDefault)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(defaultValue || defaultItem?.value || '')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const selectedItem = items.find((item) => item.value === selectedValue)

  // Close dropdown when clicking outside
  useClickOutside(
    dropdownRef,
    () => {
      setIsOpen(false)
      setFocusedIndex(-1)
    },
    isOpen // Only enable when dropdown is open
  )

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          setIsOpen(true)
        } else if (focusedIndex >= 0) {
          handleSelect(items[focusedIndex])
        }
        e.preventDefault()
        break

      case 'Escape':
        setIsOpen(false)
        setFocusedIndex(-1)
        break

      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setFocusedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev))
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        }
        break

      case 'Tab':
        if (isOpen) {
          setIsOpen(false)
          setFocusedIndex(-1)
        }
        break
    }
  }

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return

    setSelectedValue(item.value)
    setIsOpen(false)
    setFocusedIndex(-1)
    item.action()
    onChange?.(item.value)
  }

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div
      ref={dropdownRef}
      className={clsx(styles.dropdown, className, {
        [styles['dropdown--open']]: isOpen,
        [styles['dropdown--disabled']]: disabled
      })}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={styles['dropdown__trigger']}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        tabIndex={0}
      >
        <span className={styles['dropdown__trigger-text']}>
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <CaretDownIcon
          size={16}
          className={clsx(styles['dropdown__trigger-icon'], {
            [styles['dropdown__trigger-icon--rotated']]: isOpen
          })}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            className={styles['dropdown__content']}
            role="listbox"
            aria-activedescendant={focusedIndex >= 0 ? `dropdown-item-${focusedIndex}` : undefined}
            initial={{
              clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
              borderRadius: '0',
              borderColor: 'transparent'
            }}
            animate={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              borderRadius: '8px',
              borderColor: 'var(--color-border-divider)'
            }}
            exit={{
              clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
              borderRadius: '0',
              borderColor: 'transparent'
            }}
            transition={{ duration: 0.5, ease: [0.4, 0.02, 0, 0.97] }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.value}
                id={`dropdown-item-${index}`}
                className={clsx(styles['dropdown__item'], {
                  [styles['dropdown__item--selected']]: item.value === selectedValue,
                  [styles['dropdown__item--focused']]: index === focusedIndex,
                  [styles['dropdown__item--disabled']]: item.disabled
                })}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setFocusedIndex(index)}
                role="option"
                aria-selected={item.value === selectedValue}
                aria-disabled={item.disabled}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: index * 0.05 + 0.2, ease: [0.5, 0, 0, 1] }}
              >
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dropdown
