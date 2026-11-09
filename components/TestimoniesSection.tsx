'use client';

import './testimonies.css';

// Replace these five placeholder names, occasions and messages with your own testimonies.
const testimonies = [
  { name: 'Ananya Rao', event: 'Wedding celebration', message: 'The music, decor and attention to detail made our celebration feel so special. Every moment was beautifully planned.' },
  { name: 'Rohan Sharma', event: 'Birthday celebration', message: 'Such a fun evening! The team brought wonderful energy and made sure everyone had a great time.' },
  { name: 'Meera Patel', event: 'Haldi ceremony', message: 'A colourful, joyful celebration with all the little touches we imagined. We loved how smoothly everything came together.' },
  { name: 'Arjun Kumar', event: 'Housewarming', message: 'From the warm welcome to the final song, the team helped us create lovely memories with our family and friends.' },
  { name: 'Kavya Shetty', event: 'Live music evening', message: 'Wonderful performances and a brilliant atmosphere. Our guests were singing along and enjoying every minute.' },
];

export default function TestimoniesSection() {
  return (
    <section className="reviews section testimonies" id="reviews" aria-labelledby="testimonies-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow orange">04 / AFTER THE ENCORE</p>
          <h2 id="testimonies-heading">Our <em>Testimonies</em></h2>
        </div>
      </div>
      <div className="testimonies-window" tabIndex={0} role="region" aria-label="Testimonies carousel">
        <div className="testimonies-track">
          {[0, 1].map(copy => (
            <div className="testimonies-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {testimonies.map(testimony => (
                <article className="testimony-card" key={testimony.name}>
                  <span className="testimony-quote" aria-hidden="true">“</span>
                  <p>{testimony.message}</p>
                  <strong>{testimony.name}</strong>
                  <small>{testimony.event} · Sample testimony</small>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
