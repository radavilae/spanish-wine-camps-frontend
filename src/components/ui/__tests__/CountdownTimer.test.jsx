import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import CountdownTimer from '../CountdownTimer.jsx'

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('debería renderizar el componente con tiempo restante', () => {
    // Configurar una fecha futura (2 días, 3 horas, 30 minutos, 45 segundos en el futuro)
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 2)
    futureDate.setHours(futureDate.getHours() + 3)
    futureDate.setMinutes(futureDate.getMinutes() + 30)
    futureDate.setSeconds(futureDate.getSeconds() + 45)

    render(React.createElement(CountdownTimer, { targetDate: futureDate.toISOString() }))

    // Verificar que los elementos de tiempo se renderizan
    expect(screen.getByText('days')).toBeInTheDocument()
    expect(screen.getByText('hours')).toBeInTheDocument()
    expect(screen.getByText('minutes')).toBeInTheDocument()
    expect(screen.getByText('seconds')).toBeInTheDocument()
  })

  it('debería mostrar el tiempo formateado correctamente con ceros a la izquierda', () => {
    const futureDate = new Date()
    futureDate.setSeconds(futureDate.getSeconds() + 5) // Solo 5 segundos

    render(React.createElement(CountdownTimer, { targetDate: futureDate.toISOString() }))

    // Verificar que los valores tienen formato de dos dígitos
    const timeValues = screen.getAllByRole('generic').filter(el => 
      el.textContent.match(/^\d{2}$/)
    )
    expect(timeValues.length).toBeGreaterThan(0)
  })

  it('debería llamar a onExpired cuando el tiempo termina', () => {
    const onExpiredMock = vi.fn()
    const pastDate = new Date()
    pastDate.setSeconds(pastDate.getSeconds() - 10) // Fecha en el pasado

    render(React.createElement(CountdownTimer, { 
      targetDate: pastDate.toISOString(), 
      onExpired: onExpiredMock 
    }))

    // Avanzar el tiempo para que el intervalo se ejecute
    vi.advanceTimersByTime(1000)

    expect(onExpiredMock).toHaveBeenCalled()
  })

  it('debería tener los atributos de accesibilidad correctos', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    render(React.createElement(CountdownTimer, { targetDate: futureDate.toISOString() }))

    const timer = screen.getByRole('timer')
    expect(timer).toBeInTheDocument()
    expect(timer).toHaveAttribute('aria-live', 'polite')
  })

  it('debería mostrar el texto informativo adicional', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    render(React.createElement(CountdownTimer, { targetDate: futureDate.toISOString() }))

    expect(screen.getByText('12 max. Small groups only')).toBeInTheDocument()
    expect(screen.getByText('5 days/15 cellars')).toBeInTheDocument()
  })
})
