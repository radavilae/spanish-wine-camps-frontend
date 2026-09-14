import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext.jsx'

// Mock del cliente Supabase - debe ser antes de importar el contexto
const mockSupabaseAuth = {
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
}

vi.mock('../services/supabaseClient', () => ({
  supabase: {
    auth: mockSupabaseAuth,
  },
}))

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Configurar comportamientos por defecto
    mockSupabaseAuth.getSession.mockResolvedValue({ data: { session: null } })
    mockSupabaseAuth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    })
  })

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

  it('debería proporcionar el contexto de autenticación', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current).toHaveProperty('user')
    expect(result.current).toHaveProperty('loading')
    expect(result.current).toHaveProperty('signUp')
    expect(result.current).toHaveProperty('signIn')
    expect(result.current).toHaveProperty('signOut')
  })

  it('debería inicializar con loading=true y luego cambiar a loading=false', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('debería tener funciones de autenticación disponibles', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(typeof result.current.signUp).toBe('function')
    expect(typeof result.current.signIn).toBe('function')
    expect(typeof result.current.signOut).toBe('function')
  })

  it('debería lanzar error cuando se usa useAuth fuera del AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
  })
})
