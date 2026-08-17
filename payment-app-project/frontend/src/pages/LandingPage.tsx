import { Link } from "react-router-dom";

const pillars = [
  {
    number: "01",
    title: "Give freely",
    text: "Every gift is offered willingly, as each person is led by God and according to their ability.",
  },
  {
    number: "02",
    title: "Build together",
    text: "Join a family of believers committed to strengthening the work set before us.",
  },
  {
    number: "03",
    title: "Leave a legacy",
    text: "Your faithful support helps create a lasting place for worship, service, and ministry.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-orb landing-orb-one" />
        <div className="landing-orb landing-orb-two" />
        <div className="landing-hero-content">
          <p className="landing-kicker"><span /> Calvary Ararian</p>
          <h1>We build<br /><em>for His glory.</em></h1>
          <p className="landing-intro">
            You are warmly welcomed to become a Nehemiah Builder. Together, we build a home for the vision God has given us.
          </p>
          <div className="landing-actions">
            <Link to="/give" className="landing-button landing-button-primary">Become a Builder <span>→</span></Link>
            <a href="#vision" className="landing-button landing-button-quiet">Our vision <span>↓</span></a>
          </div>
        </div>
        <div className="hero-scripture">
          <span className="scripture-mark">“</span>
          <p>Freely ye have received, freely give.</p>
          <small>Matthew 10:8</small>
        </div>
      </section>

      <section className="landing-banner" aria-label="Our shared mission">
        <span>One Vision</span><i /> <span>One Kingdom</span><i /> <span>One Assignment</span>
      </section>

      <section className="landing-purpose" id="vision">
        <div className="purpose-heading">
          <p className="landing-kicker"><span /> The Nehemiah call</p>
          <h2>Called to build<br />something that lasts.</h2>
        </div>
        <p className="purpose-copy">
          The Nehemiah Building is a shared act of faith. There is a place for every willing heart, every prayer, and every gift.
        </p>
      </section>

      <section className="landing-pillars">
        {pillars.map((pillar) => (
          <article className="landing-pillar" key={pillar.number}>
            <span className="pillar-number">{pillar.number}</span>
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
          </article>
        ))}
      </section>

      <section className="landing-cta">
        <div>
          <p className="landing-kicker"><span /> Your part matters</p>
          <h2>Let us build<br /><em>together.</em></h2>
        </div>
        <Link to="/give" className="landing-button landing-button-light">Give toward the vision <span>→</span></Link>
      </section>

      <footer className="landing-footer">
        <div className="footer-brand">NEHEMIAH <span>BUILDING</span></div>
        <div className="footer-contact">
          <a href="https://www.calvararian.org" target="_blank" rel="noreferrer">www.calvararian.org</a>
          <a href="tel:09090006142">09090006142</a>
        </div>
        <p>ONE VISION · ONE KINGDOM · ONE ASSIGNMENT</p>
      </footer>
    </div>
  );
}
