const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (toggle && navigation) {
  const closeMenu = () => { navigation.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => { const open = navigation.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); } });
}
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => { const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); });
    let count = 0;
    document.querySelectorAll('.project').forEach(project => { project.hidden = filter !== 'all' && project.dataset.category !== filter; if (!project.hidden) count++; });
    document.querySelector('#filter-status').textContent = `${count} project${count === 1 ? '' : 's'} shown.`;
  });
});
const projects = {
  csr: { category: 'CSR & PROJECT COORDINATION', title: 'Keeping CSR projects moving forward.', role: 'Associate · Mutual Trust Bank PLC · November 2025–present', summary: 'My current role combines project coordination, data tracking and documentation to support CSR implementation and management review across 11 initiatives.', contributions: ['Coordinate planning, implementation monitoring and MIS tracking, maintaining beneficiary, activity, budget and timeline records.', 'Prepare approval memos, payment notes and supporting documents for CSR disbursements.', 'Consolidate partner and field updates into management notes, presentations and decision-ready summaries.', 'Support budget monitoring and payment documentation with Finance, branches and partner NGOs.', 'Prepare Bangladesh Bank CSR and sustainable finance reporting inputs in coordination with the Sustainable Finance Division.'], tools: ['MIS & KPI tracking', 'Budget monitoring', 'Management reporting', 'Stakeholder coordination'] },
  climate: { category: 'CLIMATE & COMMUNITY RESEARCH', title: 'Resilience shaped by local knowledge.', role: 'Researcher · ICCCAD · September 2022–January 2025', summary: 'Building Climate Resilient Migrant Friendly Town through Locally Led Adaptation, Phase 1 and Phase 2. My work supported research, adaptation planning, capacity building and project documentation.', contributions: ['Conduct literature reviews, identify knowledge gaps and develop research methodologies.', 'Perform Climate Change Vulnerability Assessments to support locally led adaptation planning.', 'Develop and deliver Training of Trainers programmes and facilitate capacity-building initiatives.', 'Train BRAC field teams on CRMFT processes for Local Climate Adaptation Plans and Ward Climate Adaptation Plans.', 'Prepare reports, factsheets, presentations, process documents and manuals, and support donor reporting.'], tools: ['Climate vulnerability assessment', 'Locally led adaptation', 'Training facilitation', 'Research documentation'] },
  policy: { category: 'POLICY & KNOWLEDGE SHARING', title: 'Bringing equity into urban climate conversations.', role: 'Research Officer · ICCCAD · June–September 2023', summary: 'Integrating Equity and Reframing Urban Nature-based Solutions. This assignment brought research, workshop coordination and policy dialogue together.', contributions: ['Coordinate a national-level workshop on integrating equity and reframing urban nature-based solutions.', 'Support coordination of a policy lab held in Colombo, Sri Lanka.', 'Author workshop and policy lab reports, bringing together findings, insights and recommendations.', 'Translate multi-stakeholder discussions into clear written outputs on equity integration and urban nature-based solutions.'], tools: ['Workshop coordination', 'Policy dialogue', 'Report writing', 'Evidence synthesis'] },
  communication: { category: 'COMMUNICATION & TRAINING', title: 'Making institutional information easier to use.', role: 'Trainee Junior Officer · NRBC Bank PLC · February–November 2025', summary: 'I worked first in the Communication Division and later at the Training Institute, contributing to editorial assignments, institutional documentation and training coordination.', contributions: ['Edit and develop articles for NRBC Planet Magazine, ensuring clarity, consistency and alignment with the bank’s communication tone.', 'Prepare office notes, bills, internal communications and supporting documentation.', 'Collaborate with multimedia and corporate affairs teams on promotional and awareness content.', 'Contribute to drafting the NRBC Bank Training Policy and related institutional documents.', 'Assist with training schedules, programme documentation and coordination across departments.'], tools: ['Editorial work', 'Corporate communication', 'Training coordination', 'Policy documentation'] }
};
const dialog = document.querySelector('#project-dialog');
if (dialog) {
  let previousOverflow = '';
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    document.querySelector('#dialog-category').textContent = project.category;
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-role').textContent = project.role;
    document.querySelector('#dialog-summary').textContent = project.summary;
    const list = document.querySelector('#dialog-contributions'); list.replaceChildren();
    project.contributions.forEach(text => { const li = document.createElement('li'); li.textContent = text; list.append(li); });
    const tools = document.querySelector('#dialog-tools'); tools.replaceChildren();
    project.tools.forEach(text => { const span = document.createElement('span'); span.textContent = text; tools.append(span); });
    previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; dialog.showModal();
  }));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  document.querySelector('#dialog-contact').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow; });
}
const year = document.querySelector('#year'); if (year) year.textContent = new Date().getFullYear();
document.querySelector('#print-resume')?.addEventListener('click', () => window.print());
