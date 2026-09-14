/**
 * Navigation Bar Component
 * Horizontal navigation bar for desktop layout
 */
import { useState } from 'react'
import styles from './Navbar.module.css'
import { useAuth } from '../../contexts/AuthContext'
import Modal from './Modal'
import AuthForm from '../auth/AuthForm'
import Profile from '../auth/Profile'

/**
 * Horizontal navigation bar
 * @param {string} activeSection - Currently active section
 * @param {Function} onScrollToSection - Navigation callback
 */
const Navbar = ({ activeSection, onScrollToSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const { user, signOut } = useAuth()

  /**
   * Handle navigation with proper event handling
   * @param {Event} event - Click event
   * @param {string} sectionId - Target section ID
   */
  const handleNavigation = (event, sectionId) => {
    event.preventDefault()
    onScrollToSection(sectionId)
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error.message)
    } finally {
      setIsMobileMenuOpen(false)
    }
  }

  const navItems = [
    { id: 'the-difference', label: 'The Difference' },
    { id: 'journeys', label: 'Journeys' },
    { id: 'regions', label: 'Regions' },
    { id: 'the-makers', label: 'The Makers' },
    { id: 'who-we-are', label: 'Who We Are' }
  ]

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.navBrand}>
        <button
          className={styles.brandButton}
          onClick={() => onScrollToSection('home')}
          aria-label="Go to home"
        >
          <div className={styles.brandContainer}>
            <span className={styles.brandMain}>
              <span style={{ color: 'hsl(42, 78%, 52%)', fontStyle: 'italic' }}>Spanish</span> Wine Camps
            </span>
            <span className={styles.brandSub}>Immersion Journeys</span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className={styles.mobileMenuToggle}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.active : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.active : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.active : ''}`}></span>
      </button>

      {/* Desktop Navigation */}
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.id} className={styles.navItem}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleNavigation(e, item.id)}
              className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
        {user ? (
          <li className={styles.navItem}>
            <button className={styles.authButton} onClick={() => setIsProfileModalOpen(true)}>
              My Profile
            </button>
          </li>
        ) : (
          <>
            <li className={styles.navItem}>
              <button className={styles.authButton} onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true) }}>
                Login
              </button>
            </li>
            <li className={styles.navItem}>
              <button className={styles.signUpButton} onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true) }}>
                Sign Up
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Mobile Navigation */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavList}>
          {navItems.map((item) => (
            <li key={item.id} className={styles.mobileNavItem}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleNavigation(e, item.id)}
                className={`${styles.mobileNavLink} ${activeSection === item.id ? styles.active : ''}`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
          {user ? (
            <>
              <li className={styles.mobileNavItem}>
                <button className={styles.mobileAuthButton} onClick={() => setIsProfileModalOpen(true)}>
                  My Profile
                </button>
              </li>
              <li className={styles.mobileNavItem}>
                <button className={styles.mobileLogoutButton} onClick={handleSignOut}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li className={styles.mobileNavItem}>
                <button className={styles.mobileAuthButton} onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true) }}>
                  Login
                </button>
              </li>
              <li className={styles.mobileNavItem}>
                <button className={styles.mobileSignUpButton} onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true) }}>
                  Sign Up
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Auth Modal */}
      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <AuthForm defaultMode={authMode} />
      </Modal>

      {/* Profile Modal */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="My Profile">
        <Profile />
      </Modal>
    </nav>
  )
}

export default Navbar


