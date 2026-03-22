import { create } from 'zustand'

interface ToastItem {
  id: string
  message: string
}

interface ToastState {
  toasts: ToastItem[]
  showToast: (message: string, duration?: number) => void
}

let toastId = 0

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, duration = 2000) => {
    const id = `toast-${++toastId}`
    set((state) => ({
      toasts: [...state.toasts, { id, message }],
    }))

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, duration)
  },
}))
