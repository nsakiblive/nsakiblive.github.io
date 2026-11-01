const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

if (menuButton && nav) {
  const closeMenu = () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}

const caseStudies = {
  paca: {
    category: 'DATA MINING / FRANCE',
    title: 'Verified PACA Region School Contact List',
    lead: 'A large-scale school contact database project that combined automated extraction with manual verification and enrichment.',
    brief: 'Build a reliable contact list for schools in the Provence-Alpes-Côte d’Azur region. The source material contained missing emails, inconsistent addresses and duplicate records.',
    work: [
      'Combined scraping with manual verification using public directories and school websites.',
      'Enriched missing contact details and postal codes.',
      'Removed duplicates and standardized records for campaign use.',
      'Prepared both direct-scrape and manually enriched versions for different client needs.'
    ],
    impact: 'The original target was 5,000 leads. More than 14,000 records were ultimately delivered, and the engagement expanded into longer-term work.',
    tools: ['Web research', 'Data mining', 'Verification', 'Deduplication', 'Spreadsheet QA']
  },
  accident: {
    category: 'POWER BI / ROAD SAFETY',
    title: 'US Accident Data: Weather & Temperature Impact',
    lead: 'A Power BI analysis exploring how weather, temperature and wind conditions relate to U.S. traffic accidents.',
    brief: 'Merge accident and weather datasets, clean inconsistent records and create an interactive dashboard that non-technical stakeholders could explore.',
    work: [
      'Merged accident records with external weather data.',
      'Aligned timestamps and measurement units and cleaned the combined dataset.',
      'Built interactive filters for date, state, weather category and related variables.',
      'Visualized patterns around rain, snowfall, temperature changes and wind.'
    ],
    impact: 'The project translated a large dataset into accessible road-safety insights and a dashboard designed for planners, policymakers and transportation stakeholders.',
    tools: ['Power BI', 'Data cleaning', 'Data merging', 'Dashboard design', 'Analytical storytelling']
  },
  policy: {
    category: 'POLICY / COLOMBO',
    title: 'Regional Policy Lab → Published Policy Writing',
    lead: 'A regional policy engagement on integrating equity into urban nature-based solutions in South Asian cities.',
    brief: 'Support the Colombo Policy Lab process, capture its learning and help turn multi-stakeholder discussion into a clear policy-oriented narrative.',
    work: [
      'Supported coordination of the regional Policy Lab in Colombo, Sri Lanka.',
      'Worked with discussions around equity, urban nature-based solutions and community resilience.',
      'Synthesized policy insights and implications from the engagement.',
      'Co-authored the subsequent ICCCAD publication “Carving the Skeleton”.'
    ],
    impact: 'The work links event and stakeholder coordination with policy research, synthesis and published writing — showing the full path from dialogue to knowledge product.',
    tools: ['Policy research', 'Stakeholder engagement', 'Workshop coordination', 'Evidence synthesis', 'Policy writing']
  },
  bloomberg: {
    category: 'PYTHON / AUTOMATION',
    title: 'Bloomberg Agriculture Data Scraper',
    lead: 'A reusable Google Colab workflow for collecting and cleaning historical agriculture price data for analysis.',
    brief: 'Create a repeatable, client-friendly process to fetch historical price series from selected Bloomberg pages for chosen date windows.',
    work: [
      'Built a Google Colab workflow with start-date and end-date controls.',
      'Used Python tooling to fetch and parse permitted source pages.',
      'Removed duplicates, checked missing dates and recorded runtime.',
      'Packaged the output as a tidy CSV with optional charting and documentation.'
    ],
    impact: 'The result was a reusable research tool that could be rerun for new date windows or instruments rather than a one-off data pull.',
    tools: ['Python', 'Google Colab', 'pandas', 'cloudscraper', 'matplotlib']
  },
  smipay: {
    category: 'SYSTEMS / TECHNICAL DECK',
    title: 'SMI Pay — Payment Platform Technical Deck',
    lead: 'A 28-slide engineering deck translating complex payment architecture and production failure modes into a structured technical narrative.',
    brief: 'Explain a payment platform’s runtime architecture, a 15-second timeout failure mode, operational risks and a proposed asynchronous redesign to a technical audience.',
    work: [
      'Mapped the system architecture and payment lifecycle.',
      'Structured a root-cause narrative around timeout and downstream authorization behavior.',
      'Explained Async V2, transactional outbox and idempotency concepts.',
      'Built a two-track optimization approach, trade-offs and implementation roadmap.'
    ],
    impact: 'The final deck made a complex distributed payment system easier for technical and stakeholder audiences to understand, review and discuss.',
    tools: ['Systems analysis', 'Technical storytelling', 'Architecture diagrams', 'Root-cause analysis', 'Presentation design']
  },
  sales: {
    category: 'BUSINESS ANALYTICS / US',
    title: 'US Regional Sales: Trends & Profit Analysis',
    lead: 'A Power BI business analytics project examining regional sales, product performance, costs and profitability.',
    brief: 'Consolidate retail data, identify monthly and yearly patterns, surface top products and show where profitability and revenue could improve.',
    work: [
      'Organized and analyzed data from multiple retail sources.',
      'Compared revenue and expenses and calculated category-level profit margins.',
      'Visualized monthly trends and state-level sales patterns.',
      'Built KPI views for sales, cost, profit and target achievement.'
    ],
    impact: 'The analysis supported decisions around marketing, inventory and cost control. Dashboard values shown in the project include approximately $82.69M sales, $51.82M cost and $30.87M profit.',
    tools: ['Power BI', 'Sales analytics', 'Profitability analysis', 'Data visualization', 'Business decision support']
  }
};

const dialog = document.querySelector('#case-dialog');
if (dialog) {
  const title = document.querySelector('#case-title');
  const category = document.querySelector('#case-category');
  const lead = document.querySelector('#case-lead');
  const brief = document.querySelector('#case-brief');
  const work = document.querySelector('#case-work');
  const impact = document.querySelector('#case-impact');
  const tools = document.querySelector('#case-tools');

  document.querySelectorAll('[data-project]').forEach(button => {
    button.addEventListener('click', () => {
      const item = caseStudies[button.dataset.project];
      if (!item) return;

      category.textContent = item.category;
      title.textContent = item.title;
      lead.textContent = item.lead;
      brief.textContent = item.brief;
      impact.textContent = item.impact;

      work.replaceChildren();
      item.work.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        work.append(li);
      });

      tools.replaceChildren();
      item.tools.forEach(tool => {
        const span = document.createElement('span');
        span.textContent = tool;
        tools.append(span);
      });

      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    const inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
    if (!inside) dialog.close();
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
