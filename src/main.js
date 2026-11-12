const cases = {
  trading: {
    category: 'Distributed systems · J.P. Morgan',
    title: 'Trade management at global scale.',
    intro: 'Built and maintained core equity derivatives trade management services across a hybrid-cloud architecture spanning North America, EMEA, and APAC.',
    points: [
      'Processed 400K+ trade events daily, feeding downstream systems through AMPS messaging, IBM MQ, and centralised file transfers.',
      'Built a trade-data pipeline into the firm-wide data lake using AWS Glue, PySpark, Athena, S3, ECS, and SQS.',
      'Implemented retries and end-of-day reconciliation against source audit records to support consistent, idempotent data processing.',
      'Earlier work included a US equities trade-feed consumer with custom Avro deserialisation and a 99% clearing rate.'
    ],
    stack: 'Java · AMPS · IBM MQ · AWS · PySpark · Avro'
  },
  performance: {
    category: 'Performance engineering · J.P. Morgan',
    title: 'Faster processing. Fewer bottlenecks.',
    intro: 'Improved two critical parts of the equity derivatives reporting workflow: transaction model construction and end-of-day report processing.',
    points: [
      'Reduced end-of-day report processing from 3 hours to 25 minutes—approximately 86% less time—eliminating compliance SLA breaches.',
      'Used data segregation, batching, parallel processing, concurrent task execution, and API optimisation.',
      'Reduced CDM transaction-model creation from 10 minutes to 2 minutes for composite trades containing 5K+ positions.',
      'Optimised data transformers, mapping logic, and model construction to prevent processing backlogs during peak traffic.'
    ],
    stack: 'CDM · Data transformation · Concurrency · Batching · API optimisation'
  },
  intelligence: {
    category: 'Applied AI · J.P. Morgan',
    title: 'Knowledge, connected to the work.',
    intro: 'Developed a RAG assistant to help Operations and Engineering teams navigate more than 45 workflows using grounded internal knowledge.',
    points: [
      'Connected Jira, Confluence, video transcripts, and internal documentation as sources for grounded responses.',
      'Built the experience with React, FastAPI, and an internal agent development kit based on LangChain.',
      'Secured access using OAuth 2.0 and JWT access-token validation.',
      'Also created copilot agents that orchestrated 15+ components across local development stacks, improving development speed by approximately 20%.'
    ],
    stack: 'React · FastAPI · LangChain · RAG · OAuth 2.0 · JWT'
  }
};

const dialog = document.querySelector('#case-dialog');
document.querySelectorAll('[data-case]').forEach(button => {
  button.addEventListener('click', () => {
    const project = cases[button.dataset.case];
    document.querySelector('#case-category').textContent = project.category;
    document.querySelector('#case-title').textContent = project.title;
    document.querySelector('#case-intro').textContent = project.intro;
    document.querySelector('#case-stack').textContent = project.stack;
    document.querySelector('#case-points').replaceChildren(...project.points.map(point => {
      const item = document.createElement('li');
      item.textContent = point;
      return item;
    }));
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

const copyButton = document.querySelector('#copy-email');
if (navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  const originalContent = copyButton.innerHTML;
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('nusrihari@gmail.com');
      copyButton.textContent = 'Copied ✓';
      copyButton.disabled = true;
      document.querySelector('#copy-status').textContent = 'Email address copied to clipboard.';
      setTimeout(() => { copyButton.innerHTML = originalContent; copyButton.disabled = false; }, 2500);
    } catch {
      document.querySelector('#copy-status').textContent = 'Could not copy. The email address is shown below.';
    }
  });
}
document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.nav-links a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('main>section[id]').forEach(section => observer.observe(section));
}
