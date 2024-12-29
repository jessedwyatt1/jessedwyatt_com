"use client"

import { createContext, useContext, useState } from "react"
import { ContactModal } from "./contact-modal"

interface ContactModalContextType {
  openModal: () => void
  closeModal: () => void
}

const ContactModalContext = createContext<ContactModalContextType>({
  openModal: () => {},
  closeModal: () => {},
})

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <ContactModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={closeModal} />
    </ContactModalContext.Provider>
  )
}

export const useContactModal = () => useContext(ContactModalContext) 