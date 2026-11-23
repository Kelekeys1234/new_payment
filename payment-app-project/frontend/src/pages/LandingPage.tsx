import { Link } from "react-router-dom";
import partnersImage from "../assets/landing-partners.jpeg";

const pillars = [
  {
    number: "01",
    title: "Give freely",
    text: "Offer a gift willingly, as you are led and according to your ability.",
  },
  {
    number: "02",
    title: "Build together",
    text: "Join a family of believers strengthening the work set before us.",
  },
  {
    number: "03",
    title: "Leave a legacy",
    text: "Help create a lasting place for worship, service, and ministry.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page home-refresh">
      <section
        className="home-hero"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(8, 27, 72, .91) 0%, rgba(11, 36, 91, .73) 48%, rgba(12, 47, 99, .28) 100%), url(${partnersImage})`,
        }}
      >
        <div className="home-hero-copy">
          <p className="home-eyebrow"><span /> Fig. 01 — Calvary Point Assembly International</p>
          <h1>We build<br />for His<br /><em>glory.</em></h1>
          <p className="home-lede">
            Be part of the Nehemiah Builders vision. Together, we are building a home for worship, service, and ministry.
          </p>
          <div className="home-actions">
            <Link to="/give" className="home-button home-button-primary">Give toward the vision <span aria-hidden="true">&rarr;</span></Link>
            <Link to="/register" className="home-button home-button-outline">Join Us</Link>
          </div>
          <div className="home-motto"><span /> One vision <i /> One kingdom <i /> One assignment</div>
        </div>
        <div className="home-hero-callout">
          <span className="home-callout-mark" aria-hidden="true">N</span>
          <span><small>Nehemiah Builders Partners</small><strong>A vision we build together</strong></span>
          <span className="home-callout-arrow" aria-hidden="true">↗</span>
        </div>
      </section>

      <section className="home-quote-banner">
        <p>“Freely ye have received, freely give.”</p>
        <span>Matthew 10:8</span>
      </section>

      <section className="home-vision" id="home-vision">
        <div className="home-vision-heading">
          <p className="home-eyebrow"><span /> The Nehemiah call</p>
          <h2>A shared act<br />of <em>faith.</em></h2>
        </div>
        <div className="home-vision-copy">
          <span className="home-vision-symbol" aria-hidden="true">✳</span>
          <p>There is a place for every willing heart, every prayer, and every gift. Your part helps bring the vision God has given us to life.</p>
          <span className="home-verse">“Freely ye have received, freely give.” <b>Matthew 10:8</b></span>
        </div>
      </section>

      <section className="home-pillars" aria-label="Ways to take part">
        {pillars.map((pillar) => (
          <article className="home-pillar" key={pillar.number}>
            <span className="home-pillar-number">{pillar.number}</span>
            <span className="home-pillar-rule" aria-hidden="true" />
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
          </article>
        ))}
      </section>

      <section className="home-invitation">
        <div className="home-invitation-label"><span /> Your part matters</div>
        <div className="home-invitation-main">
          <h2>Let us build<br /><em>together.</em></h2>
          <div className="home-invitation-action">
            <p>Join the vision with a gift, a prayer, and a willing heart.</p>
            <Link to="/give" className="home-button home-button-light">Give toward the vision <span aria-hidden="true">&rarr;</span></Link>
          </div>
        </div>
        <span className="home-invitation-decoration" aria-hidden="true">N</span>
      </section>

      <footer className="home-footer">
        <div className="home-footer-brand">NEHEMIAH BUILDERS <span>PARTNERS INTERNATIONAL</span></div>
        <div className="home-footer-contact">
          <a href="https://www.calvararian.org" target="_blank" rel="noreferrer">www.calvararian.org</a>
          <a href="tel:09090006142">09090006142</a>
        </div>
        <p>CALVARY POINT ASSEMBLY INTERNATIONAL</p>
      </footer>
    </div>
  );
}
