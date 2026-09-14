import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Modal from '../ui/Modal'
import PaymentForm from '../payment/PaymentForm'
import styles from './Profile.module.css'

const Profile = () => {
  const { user, signOut } = useAuth()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  if (!user) {
    return (
      <div className={styles.profileContainer}>
        <p className={styles.noUser}>No authenticated user</p>
      </div>
    )
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error.message)
    }
  }

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent)
    setIsPaymentModalOpen(false)
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileBox}>
        <div className={styles.header}>
          <h2 className={styles.title}>My Profile</h2>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.infoGroup}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{user.email}</span>
          </div>

          {user.user_metadata && (
            <>
              {user.user_metadata.full_name && (
                <div className={styles.infoGroup}>
                  <span className={styles.label}>Name:</span>
                  <span className={styles.value}>{user.user_metadata.full_name}</span>
                </div>
              )}
              {user.user_metadata.phone && (
                <div className={styles.infoGroup}>
                  <span className={styles.label}>Phone:</span>
                  <span className={styles.value}>{user.user_metadata.phone}</span>
                </div>
              )}
            </>
          )}

          <div className={styles.infoGroup}>
            <span className={styles.label}>User ID:</span>
            <span className={styles.value}>{user.id}</span>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.label}>Created:</span>
            <span className={styles.value}>
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.label}>Last Sign In:</span>
            <span className={styles.value}>
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A'}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={() => setIsPaymentModalOpen(true)} className={styles.paymentButton}>
            Make Payment
          </button>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            Log Out
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Make Payment">
        <PaymentForm amount={1} onSuccess={handlePaymentSuccess} />
      </Modal>
    </div>
  )
}

export default Profile
