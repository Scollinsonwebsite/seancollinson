# SEO map

Production domain: `https://seancollinson.com` (confirm before launch). Each page answers a distinct search intent; copy is not duplicated across pages. Keywords are used where they fit naturally, never stuffed, and no page claims to be the "best" or "top" mediator.

Sitewide: unique `<title>`, meta description, canonical URL, Open Graph and X/Twitter card tags (with a 1200 × 630 social image), one H1 per page, breadcrumbs with `BreadcrumbList` JSON-LD on every interior page, the same header and footer navigation on every page with the current page marked, `robots.txt`, and `sitemap.xml`. No meta keywords tag.

---

## 1. Home: `/`

| | |
| --- | --- |
| **Search intent** | Commercial / navigational: someone looking for a divorce or family mediator in Los Angeles, or for Sean by name |
| **Primary cluster** | Los Angeles divorce mediator; divorce mediation Los Angeles; family mediator Los Angeles |
| **Secondary cluster** | California divorce mediation; private divorce mediation; online divorce mediation California; Sean Collinson mediator; civil and business mediation |
| **Title** | Los Angeles Divorce Mediator \| Sean Collinson |
| **Meta description** | Resolve divorce, family, civil, and business disputes privately with experienced Los Angeles mediator Sean Collinson. In-person and virtual mediation. |
| **H1** | Resolve Conflict Without Losing Control |
| **Internal links out** | /consultation/ (hero, closing CTA, header), /mediation/ (hero, services, FAQ), six service anchors on /mediation/ (#divorce-and-family, #legal-separation, #custody-and-parenting, #property-and-finances, #civil-and-business, #partnership-contract-workplace), /mediation/#how-mediation-works, /mediation/#services, /mediation/#faq, /about/ |
| **Schema** | `WebSite`, `ProfessionalService` (service-area model, no address), `Person` |

## 2. About: `/about/`

| | |
| --- | --- |
| **Search intent** | Navigational / trust: evaluating Sean's experience, training, and approach |
| **Primary cluster** | Sean Collinson mediator; experienced mediator Los Angeles; family and civil mediator California |
| **Secondary cluster** | Harvard trained mediator; crisis negotiator mediator; professional dispute resolution |
| **Title** | About Sean Collinson \| California Mediator |
| **Meta description** | Meet Sean Collinson, a family and civil mediator with more than 22 years of experience and advanced negotiation training from Harvard, Loyola, and the FBI. |
| **H1** | Sean Collinson |
| **Internal links out** | /consultation/, /mediation/ (philosophy section and CTA), /masterclass/ |
| **Schema** | `Person`, `BreadcrumbList` |

## 3. Mediation: `/mediation/`

| | |
| --- | --- |
| **Search intent** | Commercial + informational: comparing mediation to litigation, understanding services and process |
| **Primary cluster** | divorce mediation Los Angeles; family mediation California; child custody mediation Los Angeles; civil mediation Los Angeles; business dispute mediator |
| **Secondary cluster** | legal separation mediation; parenting plan mediator; spousal support mediation; property division mediation; high asset divorce mediation; commercial mediation California; workplace mediation; landlord tenant mediation; online / virtual mediation California |
| **Long-tail answered (FAQ)** | how divorce mediation works in California; divorce mediation versus litigation; what to expect; how to prepare; is divorce mediation confidential in California; how long it takes; how much it costs; what issues can be resolved; custody and support; legal separation versus divorce; how business mediation works; do we still need attorneys; how to choose a divorce mediator; when mediation is not appropriate; online mediation |
| **Title** | Divorce, Family, Civil and Business Mediation \| Los Angeles |
| **Meta description** | Private mediation for divorce, custody, legal separation, civil, workplace, and business disputes in California, with virtual sessions available nationwide. |
| **H1** | A Better Way to Resolve Difficult Disputes |
| **Internal links out** | /consultation/ (hero, mid-page CTA, cost FAQ, closing CTA), /about/, on-page jump links |
| **Schema** | `BreadcrumbList` (FAQ markup intentionally omitted; Google limits FAQ rich results to government and health sites) |

## 4. Consultation: `/consultation/`

| | |
| --- | --- |
| **Search intent** | Transactional: ready to speak with a mediator |
| **Primary cluster** | schedule divorce mediation consultation; mediation consultation Los Angeles |
| **Secondary cluster** | speak with a divorce mediator; private mediation consultation; online mediation consultation California |
| **Title** | Schedule a Mediation Consultation \| Sean Collinson |
| **Meta description** | Request a confidential consultation with mediator Sean Collinson to discuss divorce, family, civil, or business mediation and determine the next practical step. |
| **H1** | Start With a Confidential Conversation |
| **Internal links out** | /mediation/#process, /contact/, /privacy-policy/ |
| **Schema** | `BreadcrumbList` |

## 5. Videos: `/videos/`

| | |
| --- | --- |
| **Search intent** | Informational: video guidance on mediation, negotiation, and de-escalation |
| **Primary cluster** | Sean Collinson videos; divorce mediation videos; conflict resolution videos |
| **Secondary cluster** | mediation advice California; negotiation strategies; how to resolve conflict; hostage negotiation communication skills |
| **Title** | Mediation and Conflict Resolution Videos \| Sean Collinson |
| **Meta description** | Watch Sean Collinson explain mediation, negotiation, de-escalation, divorce conflict, and practical strategies for resolving difficult disputes. |
| **H1** | Clear Guidance for Difficult Conversations |
| **Internal links out** | /masterclass/, /consultation/, /mediation/#faq |
| **Schema** | `BreadcrumbList`; `VideoObject` for each complete, real video (none yet) |

## 6. Masterclass: `/masterclass/`

| | |
| --- | --- |
| **Search intent** | Commercial / educational: training for individuals and organizations |
| **Primary cluster** | negotiation masterclass; conflict resolution masterclass; Think Like a Hostage Negotiator |
| **Secondary cluster** | hostage negotiation communication training; de-escalation training; workplace conflict training; negotiation skills course; Sean Collinson masterclass |
| **Title** | Negotiation and Conflict Resolution Masterclass \| Sean Collinson |
| **Meta description** | Learn practical negotiation, listening, de-escalation, and conflict-resolution strategies in Sean Collinson’s Think Like a Hostage Negotiator masterclass. |
| **H1** | Stay Calm. Read the Conflict. Move the Conversation Forward. |
| **Internal links out** | /about/, /consultation/, /privacy-policy/ |
| **Schema** | `BreadcrumbList` (`Course` withheld until real course details and offers are confirmed) |

## 7. Contact: `/contact/`

| | |
| --- | --- |
| **Search intent** | Navigational / transactional: reach the office |
| **Primary cluster** | contact Sean Collinson mediator; Los Angeles mediator contact |
| **Secondary cluster** | California mediation services; virtual mediator consultation; mediation office Los Angeles |
| **Title** | Contact Sean Collinson \| Mediation Services |
| **Meta description** | Contact the Mediation Office of S. Collinson to discuss divorce, family, civil, business, workplace, or virtual mediation services. |
| **H1** | Let’s Find a Practical Way Forward |
| **Internal links out** | /consultation/, /privacy-policy/ |
| **Schema** | `BreadcrumbList` (business contact details appear in `ProfessionalService` on Home once supplied) |

---

## Supporting pages (not in the primary navigation)

| URL | Title | Indexing |
| --- | --- | --- |
| `/privacy-policy/` | Privacy Policy \| Mediation Office of S. Collinson | `noindex` until professionally reviewed |
| `/terms-of-use/` | Terms of Use \| Mediation Office of S. Collinson | `noindex` until reviewed |
| `/accessibility/` | Accessibility Statement \| Mediation Office of S. Collinson | `noindex` until reviewed |
| `/disclaimer/` | Disclaimer \| Mediation Office of S. Collinson | `noindex` until reviewed |
| `/404.html` | Page Not Found \| Mediation Office of S. Collinson | `noindex`, no canonical; links to Home, Mediation, Contact |

All are linked from the footer on every page.
