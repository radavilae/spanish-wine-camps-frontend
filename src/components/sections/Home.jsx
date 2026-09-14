import styles from './Home.module.css'

const Home = () => {
  return (
    <section id="home" className={styles.home}>
      <div className="responsive-container">
        <div className={styles.content}>
          <div className={styles.heroContent}>
            <h2 className={styles.mainTitle}>Wine Immersion Journeys</h2>
            <h1 className={styles.brandName}>
              <span style={{ color: 'hsl(42, 78%, 52%)', fontStyle: 'italic' }}>Spanish</span> Wine Camps
            </h1>
            <p className={styles.description}>
              Journey alongside vignerons, cellar masters, and the singular new voices of Spanish winemaking
            </p>
            <div className={styles.buttons}>
              <button className={styles.primaryButton}>
                Explore Journeys
              </button>
              <button className={styles.secondaryButton}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
