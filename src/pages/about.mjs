import { layout, photo, ctaBand, breadcrumbs, personSchema, CTA_PRIMARY } from '../lib/render.mjs';

export const meta = {
  path: '/about/',
  out: 'about/index.html',
  title: 'About Sean Collinson | California Mediator',
  description:
    'Meet Sean Collinson, a family and civil mediator with more than 22 years of experience and advanced negotiation training from Harvard, Loyola, and the FBI.',
  h1: 'Sean Collinson',
};

const credentials = [
  {
    name: 'Program on Negotiation',
    org: 'Harvard University',
    text: 'Negotiation training focused on interests, options, and the structure of agreements that hold.',
  },
  {
    name: 'Mediating the Litigated Case',
    org: 'Loyola Law School, Los Angeles',
    text: 'Training in mediating disputes that are already in, or headed toward, litigation.',
  },
  {
    name: 'Advanced family mediation training',
    org: 'Recognized by the Florida Supreme Court',
    text: 'Advanced instruction in family matters, including parenting, support, and property issues.',
  },
  {
    name: 'Crisis negotiation',
    org: 'FBI-trained; volunteer with the Los Angeles County Sheriff’s Department',
    text: 'Crisis-negotiation training applied in a volunteer capacity with the department’s crisis-negotiation function.',
  },
];

const values = [
  ['Neutrality', 'Sean does not represent either party, and he does not steer the outcome toward anyone.'],
  ['Confidentiality', 'Discussions stay private, within the limits of the law, and are handled with discretion.'],
  ['Preparation', 'Good sessions are built on good information. Preparation is part of the work, not an afterthought.'],
  ['Respect', 'Strong feelings are expected. Personal attacks are not. Everyone is heard.'],
  ['Accountability', 'Commitments made in the room are written down clearly so everyone knows who does what, and when.'],
  ['Durable agreements', 'The goal is terms people can actually live with a year from now, not just sign today.'],
];

export function render() {
  const crumbs = breadcrumbs([{ name: 'About', path: meta.path }]);
  const body = `
${crumbs.html}
<section class="page-hero page-hero--split" aria-labelledby="page-title">
  <div class="wrap page-hero__grid">
    <div>
      <p class="eyebrow">Family and civil mediator</p>
      <h1 id="page-title" class="page-hero__title">${meta.h1}</h1>
      <p class="page-hero__lede">An experienced neutral who brings order, calm, and practical judgment to disputes that feel stuck, from divorce and custody to business and civil conflict.</p>
      <div class="btn-row"><a class="btn btn--primary" href="/consultation/">${CTA_PRIMARY}</a></div>
    </div>
    <figure class="page-hero__figure">
      ${photo('portrait', { eager: true, sizes: '(min-width: 1000px) 32vw, 90vw' })}
    </figure>
  </div>
</section>

<section class="section" aria-labelledby="bio-title">
  <div class="wrap narrow prose">
    <h2 id="bio-title" class="section__title">Professional background</h2>
    <p>Sean Collinson is a professional family and civil mediator with more than 22 years of experience helping individuals, families, and businesses resolve complex disputes. His advanced training includes Harvard’s Program on Negotiation, Loyola Law School’s Mediating the Litigated Case program, and advanced family mediation training recognized by the Florida Supreme Court. Sean is also an FBI-trained crisis negotiator who serves in a volunteer capacity with the Los Angeles County Sheriff’s Department, bringing calm leadership, disciplined listening, and proven negotiation skills to every case.</p>
    <p>Sean’s approach is practical, direct, and solution-focused. He helps parties cut through emotion, identify the real issues, and develop fair, workable agreements without the excessive cost, delay, and uncertainty of prolonged litigation. Whether the dispute involves divorce, custody, property, business, or civil matters, Sean creates a respectful and confidential process designed to reduce conflict, preserve dignity, and help clients move forward with clarity.</p>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="training-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="training-title" class="section__title">Training and credentials</h2>
      <p class="section__lede">Formal training in negotiation, litigated-case mediation, family mediation, and crisis communication.</p>
    </div>
    <ul class="credentials">
      ${credentials
        .map(
          (c) => `<li class="credential">
        <h3 class="credential__name">${c.name}</h3>
        <p class="credential__org">${c.org}</p>
        <p>${c.text}</p>
      </li>`
        )
        .join('')}
    </ul>
    <p class="fine-print">Sean’s volunteer crisis-negotiation service is separate from his mediation practice. Neither the FBI nor the Los Angeles County Sheriff’s Department endorses this practice or its services.</p>
  </div>
</section>

<section class="section" aria-labelledby="calm-title">
  <div class="wrap split split--text">
    <div>
      <h2 id="calm-title" class="section__title">Calm Leadership in High-Stakes Conflict</h2>
    </div>
    <div class="prose">
      <p>Crisis negotiation is communication at its most demanding: someone is overwhelmed, the stakes are high, and the wrong word can set things back. The skills it requires translate directly to the mediation room.</p>
      <ul class="plain-list">
        <li><strong>Active listening.</strong> Hearing what someone is actually saying, including what they are not saying yet, before trying to solve anything.</li>
        <li><strong>Emotional regulation.</strong> Staying steady when others are not, so the room has something stable to anchor to.</li>
        <li><strong>Rapport.</strong> Earning enough trust from each side that people are willing to consider options they rejected at the start.</li>
        <li><strong>Issue identification.</strong> Separating the positions people announce from the interests that actually drive them.</li>
        <li><strong>Practical settlement work.</strong> Turning those interests into specific, workable terms.</li>
      </ul>
      <p>In mediation, Sean uses these skills in service of both parties equally. He manages the process; the parties own the decisions.</p>
    </div>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="philosophy-title">
  <div class="wrap narrow">
    <h2 id="philosophy-title" class="section__title">A Practical Philosophy</h2>
    <blockquote class="pull-quote"><p>Mediation is not about forcing compromise. It is about creating enough clarity and structure for people to make informed decisions.</p></blockquote>
    <div class="prose">
      <p>Many people arrive expecting to be pushed to “split the difference.” That is not how Sean works. His role is to make sure both parties understand the issues, have the information they need, and can see the realistic options, including what happens if there is no agreement.</p>
      <p>From there, the decisions belong to the people who will live with them. Sometimes that produces a full settlement; sometimes it narrows the dispute to a handful of issues. Either way, people leave knowing more than when they arrived. <a href="/mediation/">Learn how mediation sessions are structured</a>.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="values-title">
  <div class="wrap">
    <h2 id="values-title" class="section__title">Values that guide every matter</h2>
    <dl class="values">
      ${values.map(([t, d]) => `<div class="value"><dt>${t}</dt><dd>${d}</dd></div>`).join('')}
    </dl>
    <p class="section__aside">Sean also teaches these skills to leaders and teams in the <a href="/masterclass/">Think Like a Hostage Negotiator masterclass</a>.</p>
  </div>
</section>

${ctaBand({
  heading: 'Talk Through Your Situation With Sean',
  text: 'Start with a confidential consultation to discuss the dispute, the people involved, and whether mediation is the right next step.',
  secondary: { href: '/mediation/', label: 'Explore Mediation Services' },
})}
`;
  return layout({
    path: meta.path,
    title: meta.title,
    description: meta.description,
    body,
    schema: [personSchema(), crumbs.schema],
    bodyClass: 'page-about',
  });
}
