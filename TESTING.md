# Guía de Testing con Vitest y React Testing Library

## 📋 Configuración Instalada

He configurado **Vitest** con **React Testing Library** para tu proyecto. Esta es la combinación moderna y más eficiente para proyectos que usan Vite.

### Dependencias Instaladas

- **vitest**: Framework de testing rápido y moderno (compatible con Vite)
- **@testing-library/react**: Librería para testear componentes React de forma user-centric
- **@testing-library/jest-dom**: Matchers personalizados para Jest/DOM
- **@testing-library/user-event**: Simulación de eventos de usuario realistas
- **jsdom**: Implementación de DOM para Node.js (para testear en entorno de testing)

## 🚀 Scripts Disponibles

En tu `package.json` ahora tienes estos scripts:

```json
"test": "vitest",              // Modo watch (re-ejecuta tests cuando cambias código)
"test:run": "vitest run",      // Ejecuta tests una sola vez (ideal para CI/CD)
"test:ui": "vitest --ui",      // Interfaz visual de testing
"test:coverage": "vitest run --coverage"  // Reporte de cobertura de código
```

## 📁 Estructura de Tests

```
src/
├── components/
│   └── ui/
│       └── __tests__/
│           └── CountdownTimer.test.jsx
├── contexts/
│   └── __tests__/
│       └── AuthContext.test.jsx
└── test/
    └── setup.js               # Configuración global de tests
```

## 🔧 Configuración en vite.config.js

```javascript
test: {
  globals: true,              // Permite usar describe, it, expect sin importar
  environment: 'jsdom',        // Simula navegador en Node.js
  setupFiles: './src/test/setup.js',  # Archivo de configuración global
  css: true,                  # Procesa archivos CSS en tests
}
```

## 📝 Archivo setup.js

El archivo `src/test/setup.js` configura:

1. **@testing-library/jest-dom**: Proporciona matchers como `toBeInTheDocument()`, `toHaveTextContent()`, etc.
2. **Cleanup automático**: Limpia el DOM después de cada test para evitar contaminación
3. **Mock de window.matchMedia**: Simula media queries para responsive design

## 🧪 Ejemplos de Tests Creados

### 1. Test de Componente (CountdownTimer)

**Archivo**: `src/components/ui/__tests__/CountdownTimer.test.jsx`

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CountdownTimer from '../CountdownTimer.jsx'

describe('CountdownTimer', () => {
  it('debería renderizar el componente con tiempo restante', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 2)
    
    render(<CountdownTimer targetDate={futureDate.toISOString()} />)
    
    expect(screen.getByText('days')).toBeInTheDocument()
    expect(screen.getByText('hours')).toBeInTheDocument()
  })
})
```

**Conceptos clave**:
- `render()`: Renderiza el componente en un DOM virtual
- `screen.getByText()`: Busca elementos por texto
- `expect().toBeInTheDocument()`: Verifica que el elemento existe

### 2. Test de Context/Hook (AuthContext)

**Archivo**: `src/contexts/__tests__/AuthContext.test.jsx`

```javascript
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext.jsx'

describe('AuthContext', () => {
  it('debería llamar a signUp con los parámetros correctos', async () => {
    const { result } = renderHook(() => useAuth(), { 
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider> 
    })
    
    await act(async () => {
      await result.current.signUp('test@example.com', 'password123')
    })
    
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})
```

**Conceptos clave**:
- `renderHook()`: Testea hooks personalizados
- `act()`: Envuelve acciones que actualizan estado
- `waitFor()`: Espera cambios asíncronos
- `wrapper`: Provee contexto al hook

## 🎯 Cómo Escribir Tests

### Testing Philosophy: "The more your tests resemble the way your software is used, the more confidence they can give you."

### 1. Tests de Componentes

```javascript
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('debería mostrar el título', () => {
    render(<MyComponent title="Hola Mundo" />)
    expect(screen.getByText('Hola Mundo')).toBeInTheDocument()
  })
  
  it('debería manejar clicks', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<MyComponent onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### 2. Tests de Servicios/Funciones

```javascript
import { calculateTotal } from './utils'

describe('calculateTotal', () => {
  it('debería sumar correctamente los precios', () => {
    const result = calculateTotal([10, 20, 30])
    expect(result).toBe(60)
  })
  
  it('debería manejar array vacío', () => {
    const result = calculateTotal([])
    expect(result).toBe(0)
  })
})
```

### 3. Mocking de APIs

```javascript
import { fetchData } from './api'

vi.mock('./api', () => ({
  fetchData: vi.fn()
}))

describe('fetchData', () => {
  it('debería retornar datos correctamente', async () => {
    fetchData.mockResolvedValue({ data: 'test' })
    
    const result = await fetchData()
    expect(result).toEqual({ data: 'test' })
  })
})
```

## 🛠️ Comandos Útiles

### Ejecutar todos los tests en modo watch
```bash
npm run test
```

### Ejecutar tests una sola vez
```bash
npm run test:run
```

### Ejecutar tests de un archivo específico
```bash
npm run test CountdownTimer.test.jsx
```

### Ejecutar tests en modo interactivo (UI)
```bash
npm run test:ui
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

## 🎨 Matchers de Jest-DOM

```javascript
// Existencia
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Contenido
expect(element).toHaveTextContent('texto')
expect(element).toHaveAttribute('href', '/home')

// Estado
expect(element).toBeDisabled()
expect(element).toBeVisible()
expect(element).toHaveClass('active')

// Formularios
expect(input).toHaveValue('texto')
expect(form).toHaveFormValues({ username: 'john' })
```

## 🚨 Buenas Prácticas

1. **Testea comportamiento, no implementación**: Enfócate en qué hace el componente, no cómo lo hace
2. **Usa selectores accesibles**: Prefiere `getByRole('button')` sobre `getByClassName('btn')`
3. **Mantén tests simples**: Un test debe verificar una cosa específica
4. **Mock dependencies externas**: Supabase, APIs, etc. deben ser mockeadas
5. **Testea casos edge**: Valores nulos, arrays vacíos, errores, etc.

## 🔍 Debugging

### Ver el DOM renderizado
```javascript
const { container } = render(<MyComponent />)
console.log(container.innerHTML) // Ver HTML generado
```

### Ver estado del componente
```javascript
screen.debug() // Imprime el DOM completo
screen.debug(element) // Imprime un elemento específico
```

## 📚 Recursos Adicionales

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Playground](https://testing-playground.com/) - Herramienta para encontrar selectores

## 🎯 Próximos Pasos

1. **Añade más tests** para tus componentes importantes
2. **Configura coverage** para identificar código sin tests
3. **Integra en CI/CD** para ejecutar tests automáticamente
4. **Considera E2E testing** con Playwright o Cypress para flows completos

---

¡Ahora tienes un setup de testing completo y moderno para tu proyecto! 🎉
