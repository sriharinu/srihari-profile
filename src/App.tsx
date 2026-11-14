import { useEffect, useRef, useState } from 'react';

type CaseId = 'trading' | 'performance' | 'regulatory' | 'cdm' | 'copilot' | 'intelligence';

type CaseStudy = {
  category: string;
  title: string;
  intro: string;
  points: string[];
  stack: string;
};

const cases: Record<CaseId, CaseStudy> = {
  trading: {
    category: 'Distributed systems · J.P. Morgan',
    title: 'Trade management at global scale.',
    intro: 'Built and maintained core equity derivatives trade management services across a hybrid-cloud architecture spanning North America, EMEA, and APAC.',
    points: ['Processed 1M+ trade events daily (OTC and Listed) feeding downstream systems through AMPS messaging, IBM MQ, and centralised file transfers.', 'Built a trade-data pipeline into the firm-wide data lake using AWS Glue, PySpark, Athena, S3, ECS, and SQS.', 'Implemented retries and end-of-day reconciliation against source audit records to support consistent, idempotent data processing.', 'Earlier work included a US equities trade-feed consumer with custom Avro deserialisation and a 99% clearing rate.'],
    stack: 'Java · AMPS · IBM MQ · AWS · PySpark · Avro',
  },
  performance: {
    category: 'Performance engineering · J.P. Morgan',
    title: 'Faster processing. Fewer bottlenecks.',
    intro: 'Improved two critical parts of the equity derivatives reporting workflow: transaction model construction and end-of-day report processing.',
    points: ['Reduced end-of-day report processing from 3 hours to 25 minutes—approximately 86% less time—eliminating compliance SLA breaches.', 'Used data segregation, batching, parallel processing, concurrent task execution, and API optimisation.', 'Reduced CDM transaction-model creation from 10 minutes to 2 minutes for composite trades containing 5K+ positions.', 'Optimised data transformers, mapping logic, and model construction to prevent processing backlogs during peak traffic.'],
    stack: 'CDM · Data transformation · Concurrency · Batching · API optimisation',
  },
  regulatory: {
    category: 'Regulatory engineering · J.P. Morgan',
    title: 'Regulatory enrichment across six regimes.',
    intro: 'Delivered regulatory rewrites across SEC, FCA, CFTC, ASIC, HKMA, and JFSA for equity derivatives reporting.',
    points: ['Implemented regulatory rules and integrated reference data to support reporting requirements across six regimes.', 'Enriched existing trades and positions representing over $1 trillion in notional value.', 'Achieved approximately 97% report acceptance by DTCC.'],
    stack: 'Regulatory Rules · Reference Data · Trade & Position Enrichment · DTCC',
  },
  cdm: {
    category: 'CDM & DRR delivery · J.P. Morgan',
    title: 'Industry-first equity derivatives reporting.',
    intro: 'Contributed to implementing Digital Regulatory Reporting (DRR) using the Common Domain Model (CDM) for equity derivatives as part of JPMorganChase’s industry-first adoption initiative.',
    points: ['Implemented CDM and DRR for equity derivatives within the trade management and regulatory reporting workflow.', 'Contributed to the initiative recognized by the 2024 FINOS Adoption Achiever Award, awarded to JPMorganChase.'],
    stack: 'Common Domain Model · Digital Regulatory Reporting · Equity Derivatives',
  },
  copilot: {
    category: 'Developer productivity · J.P. Morgan',
    title: 'Microservice orchestrator for local development.',
    intro: 'Built a set of Microservices Orchestrator Agents for local development environments spanning more than 15 microservices.',
    points: ['Orchestrated 15+ components across multiple technology stacks in local development environments.', 'Improved development speed by approximately 20% through automated orchestration.'],
    stack: 'Microservices Orchestrator Agents · Multi-stack Orchestration · Local Development',
  },
  intelligence: {
    category: 'Applied AI · J.P. Morgan',
    title: 'Knowledge, connected to the work.',
    intro: 'Developed a RAG assistant to help Operations and Engineering teams navigate more than 45 workflows using grounded internal knowledge.',
    points: ['Connected Jira, Confluence, video transcripts, and internal documentation as sources for grounded responses.', 'Built the experience with React, FastAPI, and an internal agent development kit based on LangChain.', 'Secured access using OAuth 2.0 and JWT access-token validation.', 'Also created copilot agents that orchestrated 15+ components across local development stacks, improving development speed by approximately 20%.'],
    stack: 'React · FastAPI · LangChain · RAG · OAuth 2.0 · JWT',
  },
};

const skillGroups = [
  { id: 'skills-backend', title: 'Backend & Languages', className: 'skill-group-backend', tools: [['java.svg', 'Java', ''], ['spring.svg', 'Spring Boot', ''], ['python.svg', 'Python', ''], ['fastapi.svg', 'FastAPI', ''], ['database.svg', 'SQL', ''], ['api.svg', 'REST APIs', ''], ['react.svg', 'React', '']] },
  { id: 'skills-data', title: 'Data & Streaming', className: 'skill-group-data', tools: [['apachekafka.svg', 'Kafka', 'logo-light'], ['apachespark.svg', 'PySpark', ''], ['apacheavro.svg', 'Avro', 'logo-light'], ['apacheparquet.svg', 'Parquet', 'logo-light'], ['pandas.svg', 'Pandas', 'logo-paper'], ['postgresql.svg', 'PostgreSQL', ''], ['sap.svg', 'Sybase ASE', ''], ['mysql.svg', 'MySQL', 'logo-paper'], ['vmware.svg', 'GemFire', '']] },
  { id: 'skills-cloud', title: 'Cloud & Delivery', className: 'skill-group-cloud', tools: [['amazonwebservices.svg', 'AWS', 'logo-paper'], ['terraform.svg', 'Terraform', ''], ['docker.svg', 'Docker', ''], ['kubernetes.svg', 'Kubernetes', ''], ['jenkins.svg', 'Jenkins', ''], ['spinnaker.svg', 'Spinnaker', 'logo-light'], ['datadog.svg', 'Datadog', 'logo-paper']] },
  { id: 'skills-ai', title: 'AI & Quality', className: 'skill-group-ai', tools: [['langchain.svg', 'LangChain', 'logo-light'], ['retrieval.svg', 'RAG', ''], ['vector.svg', 'pgvector', ''], ['modelcontextprotocol.svg', 'MCP', 'logo-light'], ['claudecode.svg', 'Claude Code', ''], ['pytest.svg', 'Pytest', ''], ['playwright.svg', 'Playwright', ''], ['junit.svg', 'JUnit', ''], ['testing.svg', 'Mockito', '']] },
] as const;

const awsServices = [['aws-ec2.svg', 'EC2'], ['aws-ecs.svg', 'ECS'], ['aws-s3.svg', 'S3'], ['aws-sqs.svg', 'SQS'], ['aws-sns.svg', 'SNS'], ['aws-lambda.svg', 'Lambda'], ['aws-glue.svg', 'Glue'], ['aws-athena.svg', 'Athena'], ['aws-step-functions.svg', 'Step Functions']] as const;

function ExternalLink({ href, children, className = 'text-link' }: { href: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function ToolList({ tools, size = 28 }: { tools: readonly (readonly [string, string, string])[]; size?: number }) {
  return <ul className="tool-list">{tools.map(([icon, label, iconClass]) => <li className="tool-item" key={label}><span className={`tool-icon ${iconClass}`} aria-hidden="true"><img src={`/assets/tools/${icon}`} alt="" width={size} height={size} loading="lazy" decoding="async" /></span><span className="tool-label">{label}</span></li>)}</ul>;
}

function WorkCard({ id, category, number, title, description, visual, footer, onOpen, label, className = '' }: { id: CaseId; category: string; number: string; title: React.ReactNode; description: string; visual: React.ReactNode; footer: string; onOpen: (id: CaseId) => void; label: string; className?: string }) {
  return <article className={`work-card ${className}`}><div className="card-top"><span className="card-category">{category}</span><span className="card-number">{number}</span></div><h3>{title}</h3><p>{description}</p>{visual}<div className="card-footer"><span>{footer}</span><button className="expand-button" onClick={() => onOpen(id)} aria-label={label} aria-haspopup="dialog">+</button></div></article>;
}

function App() {
  const [selectedCase, setSelectedCase] = useState<CaseId | null>(null);
  const [copyLabel, setCopyLabel] = useState('Copy email');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const selected = selectedCase ? cases[selectedCase] : null;

  useEffect(() => {
    if (selected) dialogRef.current?.showModal();
    else if (dialogRef.current?.open) dialogRef.current.close();
  }, [selected]);

  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('.nav-links a')];
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) links.forEach(link => link.hash === `#${entry.target.id}` ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
    }), { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll<HTMLElement>('main>section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('nusrihari@gmail.com');
      setCopyLabel('Copied ✓');
      window.setTimeout(() => setCopyLabel('Copy email'), 2500);
    } catch { setCopyLabel('Copy failed'); }
  };

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><nav className="nav shell" aria-label="Main navigation"><a className="wordmark" href="#overview" aria-label="Sri Hari home">sri hari<span aria-hidden="true">.</span></a><div className="nav-links"><a href="#work">Work</a><a href="#experience">Experience</a><a href="#skills">Skills</a><a className="nav-contact" href="#contact">Contact</a></div><a className="button button-small" href="/assets/sri-hari-resume.pdf" target="_blank" rel="noopener">Résumé <span aria-hidden="true">↗</span></a></nav></header>
    <main id="main">
      <section id="overview" className="hero" aria-labelledby="hero-heading"><div className="shell"><div className="hero-main"><div className="hero-copy"><div className="hero-identity"><h1 id="hero-heading">Sri Hari N U</h1><p className="hero-role"><span>Software Engineer II</span><span className="role-separator" aria-hidden="true">·</span><img className="employer-logo" src="/assets/brands/jpmorgan-chase.svg" alt="JPMorganChase" width="172" height="24" /></p></div><p className="hero-headline"><span>Backend</span><span>Distributed Systems</span><span className="gradient-text">Applied AI Engineering</span></p><p className="hero-description">I build the systems behind complex financial workflows—and the AI tools that make them easier to work with.</p><p className="hero-context"><strong>4+ years of experience</strong><span aria-hidden="true">|</span>Bengaluru, India</p><div className="hero-actions"><a className="button" href="/assets/sri-hari-resume.pdf" target="_blank" rel="noopener">View Resume <span aria-hidden="true">↗</span></a><div className="hero-contact-links"><ExternalLink href="https://www.linkedin.com/in/sri-hari-n-u/" className="text-link linkedin-chat"><img src="/assets/tools/linkedin.svg" alt="" width="20" height="20" aria-hidden="true" />Profile</ExternalLink></div><ExternalLink href="https://www.linkedin.com/in/sri-hari-n-u/details/recommendations/" className="text-link recommendations-link">Recommendations <span aria-hidden="true">↗</span></ExternalLink></div><ul className="stack" aria-label="Core technologies"><li>Java</li><li>Python</li><li>AWS</li><li>Kafka</li></ul></div><figure className="portrait"><div className="portrait-image"><img src="/assets/sri-hari.png" width="768" height="768" alt="Portrait of Sri Hari" fetchPriority="high" /></div><figcaption><span>SRI HARI N U</span><span>Engineer. Builder.</span></figcaption></figure></div>
        <aside className="award-highlight" aria-labelledby="award-heading"><div className="award-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 3h10v5a5 5 0 0 1-10 0V3Zm0 2H4v3a4 4 0 0 0 4 4m9-7h3v3a4 4 0 0 1-4 4M12 13v5m-4 3v-3h8v3M6 21h12" /></svg></div><div className="award-copy"><p className="award-meta">Awarded to JPMorganChase · 2024</p><h2 id="award-heading"><ExternalLink href="https://www.finos.org/blog/2024-finos-nyc-member-awards">FINOS Adoption Achiever Award <span aria-hidden="true">↗</span></ExternalLink></h2><p className="award-description">I contributed to implementing <ExternalLink href="https://www.jpmorganchase.com/about/technology/blog/jpmc-launches-finos-open-source-solution">Digital Regulatory Reporting</ExternalLink> using the <ExternalLink href="https://www.isda.org/a/z8AEE/ISDA-CDM-Factsheet.pdf">Common Domain Model (CDM)</ExternalLink>—the industry’s first onboarding of CDM for equity derivatives—helping <strong>JPMorganChase</strong> win this award.</p></div></aside>
        <div className="impact-strip" aria-label="Selected engineering outcomes"><div><strong>1M<span>+</span></strong><p>trade events processed daily</p></div><div><strong>5<span>×</span></strong><p>faster transaction modelling</p></div><div><strong>86<span>%</span></strong><p>less report processing time</p></div><div><strong>45<span>+</span></strong><p>workflows supported by RAG</p></div></div>
      </div></section>

      <section id="work" className="work-section section-pad" aria-labelledby="work-heading"><div className="shell"><div className="section-heading"><div><p className="eyebrow">SELECTED WORK</p><h2 id="work-heading">Built for the real world.</h2></div><p>Complex systems.<br />Measurable outcomes.</p></div><div className="work-grid">
        <WorkCard id="trading" category="DISTRIBUTED SYSTEMS" number="01" title={<>Scale that keeps<br />trades moving across systems.</>} description="Equity derivatives trade services processing 1M+ events a day across North America, EMEA, and APAC." footer="Java · Messaging · Hybrid cloud" label="Read about trade management systems" onOpen={setSelectedCase} visual={<div className="card-visual event-visual" aria-hidden="true"><div className="event-source">TRADE EVENTS</div><div className="flow-line" /><div className="event-regions"><span>AMER</span><span>EMEA</span><span>APAC</span></div><div className="event-caption">MULTI-REGION DISTRIBUTED ARCHITECTURE</div></div>} className="trading" />
        <WorkCard id="performance" category="PERFORMANCE ENGINEERING" number="02" title={<>Hours of processing.<br />Back in minutes.</>} description="Redesigned end-of-day regulatory reporting with batching, parallel execution, and API optimisation." footer="Concurrency · Batching · APIs" label="Read about performance optimisation" onOpen={setSelectedCase} visual={<div className="card-visual time-visual" aria-hidden="true"><div className="time-before"><span>BEFORE</span><strong>3 hrs</strong><div /></div><div className="time-after"><span>AFTER</span><strong>25 mins</strong><div /></div></div>} className="performance" />
        <WorkCard id="regulatory" category="REGULATORY ENGINEERING" number="05" title={<>6 Regimes<br />$5T Notional Scale<br />97% Ack. rate</>} description="Delivered regulatory rewrites across SEC, FCA, CFTC, ASIC, HKMA, and JFSA for trades and positions representing over $1 trillion in notional value, achieving approximately 97% report acceptance by DTCC." footer="Rules · Reference Data · Trade Enrichment" label="Read about regulatory enrichment" onOpen={setSelectedCase} visual={<div className="card-visual regulatory-visual" aria-hidden="true"><svg className="regulatory-globe" viewBox="0 0 320 180"><circle cx="160" cy="85" r="66" /><ellipse cx="160" cy="85" rx="30" ry="66" /><ellipse cx="160" cy="85" rx="66" ry="24" /><path d="M94 85h132M160 19v132" /><g className="regulatory-links"><path d="M160 85 108 61 45 39M160 85 105 90 42 103M160 85 151 40 145 15M160 85 207 66 273 38M160 85 214 86 282 96M160 85 198 127 264 153" /></g><g className="regulatory-nodes"><circle cx="108" cy="61" r="4" /><circle cx="105" cy="90" r="4" /><circle cx="151" cy="40" r="4" /><circle cx="207" cy="66" r="4" /><circle cx="214" cy="86" r="4" /><circle cx="198" cy="127" r="4" /></g><g className="regulatory-labels"><text x="21" y="35">SEC</text><text x="13" y="118">CFTC</text><text x="132" y="12">FCA</text><text x="263" y="33">JFSA</text><text x="271" y="111">HKMA</text><text x="254" y="168">ASIC</text></g><circle className="regulatory-hub" cx="160" cy="85" r="8" /></svg><span className="regulatory-caption">REGULATORY ENRICHMENT</span></div>} className="regulatory" />
        <WorkCard id="cdm" category="CDM & DRR DELIVERY" number="06" title={<>Industry-first delivery.<br />Equity derivatives reporting.</>} description="Contributed to implementing Digital Regulatory Reporting (DRR) using the Common Domain Model (CDM) for equity derivatives, as part of JPMorganChase’s industry-first adoption initiative." footer="CDM · DRR · Equity Derivatives" label="Read about CDM and DRR delivery" onOpen={setSelectedCase} visual={<div className="card-visual cdm-visual" aria-hidden="true"><div className="cdm-stages"><span>Trade</span><span>↓</span><span>CDM</span><span>↓</span><span>DRR</span><span>↓</span><span>ISO (DTCC)</span></div></div>} className="cdm-delivery" />
        <WorkCard id="intelligence" category="APPLIED AI" number="03" title={<>Internal knowledge.<br />Instantly more useful.</>} description="A RAG assistant grounding answers in internal documentation to help teams navigate 45+ workflows." footer="FastAPI · RAG · LangChain · React" label="Read about the RAG assistant" onOpen={setSelectedCase} visual={<div className="card-visual ai-visual" aria-hidden="true"><div className="knowledge-sources"><span>Jira</span><span>Confluence</span><span>Docs</span></div><div className="ai-orbit"><span>AI</span></div><div className="ai-caption">CONTEXT → GROUNDED ANSWERS</div></div>} className="intelligence" />
        <WorkCard id="copilot" category="DEVELOPER PRODUCTIVITY" number="04" title={<>15+ microservices.<br />20% faster development.</>} description="Built a set of Microservices Orchestrator Agents for 15+ microservices across multiple technology stacks in local development environments, improving development speed by approximately 20%." footer="Microservices Orchestrator Agents · Local Development" label="Read about the Microservices Orchestrator Agents" onOpen={setSelectedCase} visual={<div className="card-visual copilot-visual" aria-hidden="true"><svg className="orchestrator-ring" viewBox="0 0 320 180"><circle className="service-orbit" cx="160" cy="90" r="70" /><g className="orbiting-services"><circle cx="160" cy="20" r="8" /><circle cx="221" cy="55" r="8" /><circle cx="221" cy="125" r="8" /><circle cx="160" cy="160" r="8" /><circle cx="99" cy="125" r="8" /><circle cx="99" cy="55" r="8" /></g><rect className="orchestrator-center" x="108" y="72" width="104" height="36" rx="12" /><text className="orchestrator-center-label" x="160" y="94" textAnchor="middle">Orchestrator</text></svg><span className="orchestrator-label">Microservices Orchestrator Agents</span><span className="copilot-caption">15+ COMPONENTS · LOCAL ORCHESTRATION</span></div>} className="copilot" />
      </div></div></section>

      <section id="experience" className="experience-section section-pad" aria-labelledby="experience-heading"><div className="shell"><div className="section-heading"><div><p className="eyebrow">EXPERIENCE</p><h2 id="experience-heading">Depth, built over time.</h2></div><ExternalLink href="https://www.linkedin.com/in/sri-hari-n-u/details/recommendations/">Recommendations <span aria-hidden="true">↗</span></ExternalLink></div><div className="experience-content"><div className="company"><div className="company-monogram" aria-hidden="true">JPM</div><h3>J.P. Morgan<br />Chase & Co.</h3><p>Bengaluru, India<br />September 2022 – present</p><div className="domain-note">Equity Derivatives<br />Trade Lifecycle & Regulatory Assessment</div></div><div className="timeline"><article className="role"><div className="role-heading"><h3>Software Engineer II</h3><span>Feb 2024 – present</span></div><div className="experience-keywords" aria-label="Software Engineer II focus areas">{['Equity Derivatives', 'Trade Lifecycle', 'Corporate Actions', 'Regulatory Assessment', 'CDM & DRR', 'Data Pipelines', 'Performance Optimization', 'Applied AI', 'Regression Automation'].map(item => <span key={item}>{item}</span>)}</div></article><article className="role"><div className="role-heading"><h3>Consultant</h3><span>Sep 2022 – Jan 2024</span></div><div className="experience-keywords" aria-label="Consultant focus areas">{['US Equities', 'Trade Feeds', 'Kafka Connect', 'Change Data Capture', 'Sybase ASE', 'Reconciliation', 'CI/CD'].map(item => <span key={item}>{item}</span>)}</div></article></div></div></div></section>

      <section id="skills" className="skills-section section-pad" aria-labelledby="skills-heading"><div className="shell"><div className="section-heading"><div><p className="eyebrow">TECHNICAL TOOLKIT</p><h2 id="skills-heading">From architecture to production</h2></div></div><section className="skill-group specialization-group" aria-labelledby="specialization-heading"><h3 id="specialization-heading"><span className="skill-category-dot" aria-hidden="true" />Specialization</h3><ul className="skills-specialization" aria-label="Specializations">{['Event-Driven Architecture', 'Distributed Systems', 'Microservices', 'REST APIs', 'Performance Optimization', 'Data Pipelines', 'System Design (LLD & HLD)', 'Agentic AI Workflows', 'CI/CD'].map(item => <li key={item}>{item}</li>)}</ul></section><div className="skills-grid">{skillGroups.map(group => <section className={`skill-group ${group.className}`} aria-labelledby={group.id} key={group.id}><h3 id={group.id}><span className="skill-category-dot" aria-hidden="true" />{group.title}</h3><ToolList tools={group.tools} />{group.id === 'skills-cloud' && <div className="cloud-services"><p id="aws-services-heading">AWS services</p><ToolList tools={awsServices.map(([icon, label]) => [icon, label, ''])} size={26} /></div>}</section>)}</div><div className="credentials"><div><span className="credential-label">EDUCATION</span><h3>B.E. Computer Science & Engineering</h3><p>Visvesvaraya Technological University · 2018–2022</p></div><div><span className="credential-label">CERTIFICATIONS</span><h3>AWS Certified Cloud Practitioner</h3><ExternalLink href="https://www.credly.com/badges/9fbc9d3b-c5cb-4193-9dc5-0c8634758ddc">View credential · 2024 <span aria-hidden="true">↗</span></ExternalLink><h3>Software Developer — mThree Academy</h3><ExternalLink href="https://www.credly.com/badges/e22d0f62-9ca2-4e6d-a0d9-07a93510a665/linked_in_profile">View credential · 2022 <span aria-hidden="true">↗</span></ExternalLink><h3>Claude Code</h3><ExternalLink href="https://verify.skilljar.com/c/3n6y35c7pwco">View credential · 2026 <span aria-hidden="true">↗</span></ExternalLink></div></div></div></section>

      <section id="contact" className="contact-section" aria-labelledby="contact-heading"><div className="shell contact-inner"><p className="eyebrow">LET’S CONNECT</p><h2 id="contact-heading">Good systems start<br />with a conversation.</h2><p>Have a backend, distributed systems, or applied AI role in mind?</p><div className="contact-actions"><a className="button" href="mailto:nusrihari@gmail.com">Email Sri Hari <span aria-hidden="true">↗</span></a><ExternalLink href="https://www.linkedin.com/in/sri-hari-n-u/" className="button">Chat on LinkedIn <span aria-hidden="true">↗</span></ExternalLink></div><div className="contact-email"><span>nusrihari@gmail.com</span><button className="copy-button" onClick={copyEmail} aria-label={copyLabel} title={copyLabel}><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M15 8V4H4v11h4" /></svg></button></div></div></section>
    </main>
    <footer className="site-footer"><div className="shell footer-inner"><span>© {new Date().getFullYear()} Sri Hari N U</span><span>Bengaluru, India</span><ExternalLink href="https://www.linkedin.com/in/sri-hari-n-u">LinkedIn ↗</ExternalLink><ExternalLink href="https://github.com/sriharinu">GitHub ↗</ExternalLink><a href="#overview">Back to top ↑</a></div></footer>
    <dialog ref={dialogRef} onClose={() => setSelectedCase(null)}><div className="dialog-content"><button className="dialog-close" onClick={() => dialogRef.current?.close()} aria-label="Close project details">×</button>{selected && <><p className="eyebrow">{selected.category}</p><h2>{selected.title}</h2><p>{selected.intro}</p><ul>{selected.points.map(point => <li key={point}>{point}</li>)}</ul><p className="dialog-stack">{selected.stack}</p></>}</div></dialog>
  </>;
}

export default App;
