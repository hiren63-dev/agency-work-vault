import { mergerStory, firmPage, sectorVisual, comingSoon } from './motion-experience.mjs';
import { clientHero, firstConversation, nextStep, enquiryPage } from './visitor-experience.mjs';
const image=p=>`/assets/${p[2]}`;
const slug=s=>s.toLowerCase().replace(/^ca\s+/,'').replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
const cityNames=['Ahmedabad','Bengaluru','Raichur','Rajkot'];

function cityChoices(leading='View partners in'){
 return `<div class="city-choices" aria-label="Partner cities"><span>${leading}</span>${cityNames.map(city=>`<a href="/people/?city=${encodeURIComponent(city)}">${city}</a>`).join('')}</div>`;
}

function industryGallery(){
 const items=[
  ['Real estate & construction','How do the project structure and its obligations fit together?','RERA, project planning and regulatory matters.','rera','RERA practice'],
  ['Manufacturing & engineering','Where do reporting and operating controls meet?','Internal controls, financial reporting and tax.','audit-assurance','Audit & assurance'],
  ['Banking & financial services','What do the records reveal about the controls?','Bank audits, reporting and regulatory questions.','audit-assurance','Audit & assurance'],
  ['Government & public sector','How is accountability reflected in the reporting?','Assurance and public sector audit matters.','audit-assurance','Audit & assurance'],
  ['Education & NGOs','How do the organisation’s purpose and obligations align?','Trusts, compliance and financial reporting.','income-tax','Income tax practice'],
  ['Information technology','What changes when business crosses borders?','Tax, reporting and cross border matters.','income-tax','Income tax practice'],
  ['Pharma, chemicals & healthcare','Where do controls, records and reporting connect?','Audit, controls and sector related compliance.','audit-assurance','Audit & assurance'],
  ['Retail & trade','How do transactions flow through to compliance?','GST, tax and business processes.','gst','GST practice']
 ];
 return `<section class="industry-runway" data-mode="browse" aria-labelledby="industry-title"><div class="industry-stage"><div class="industry-heading"><div><div class="eyebrow">Industry context</div><h2 id="industry-title">The work sits within<br><em>your business.</em></h2></div><p>A project, a production business or a financial institution can raise different reporting and regulatory questions. Explore the relevant areas of work.</p></div><div class="industry-window" tabindex="0" aria-label="Browse industry contexts"><div class="industry-track">${items.map(([h,q,p,url,label],i)=>`<a class="industry-card sector-card" href="/services/${url}/"><div class="sector-topline"><span>0${i+1} / 08</span></div><h3>${h}</h3><p class="sector-question">${p}</p>${sectorVisual(i)}<span class="sector-link">${label}</span></a>`).join('')}</div></div><div class="industry-controls"><span>Industry perspectives</span><div class="industry-progress" aria-hidden="true"><span></span></div><div class="industry-buttons"><button type="button" data-industry-direction="previous" aria-label="Previous industries">←</button><button type="button" data-industry-direction="next" aria-label="Next industries">→</button></div></div></div></section>`;
}

function serviceExplorer(services){
 return `<section class="section service-explorer" id="practice"><div class="service-intro"><div class="eyebrow">Areas of practice</div><h2>Find the work<br><em>relevant to yours.</em></h2><p>Look at what each practice covers, or begin with an enquiry if you are unsure where your matter belongs.</p><a class="text-link" href="/contact/" data-enquiry-link>Describe your matter</a></div><div class="service-accordion">${services.map((s,i)=>`<details class="practice-item" ${i===0?'open':''}><summary><span class="practice-index">0${i+1}</span><span class="practice-name">${s[0]}</span><span class="practice-symbol" aria-hidden="true"></span></summary><div class="practice-body"><p>${s[3]}</p><ul>${s[4].slice(0,3).map(x=>`<li>${x}</li>`).join('')}</ul><div class="practice-actions"><a href="/services/${s[1]}/">Explore ${s[0]}</a><a class="practice-enquiry" href="/contact/?service=${s[1]}">Discuss this area</a></div></div></details>`).join('')}</div></section>`;
}

function narrative(){
 const steps=[
  ['01','Understand the question','A tax notice, a reporting change or a regulatory filing begins with the facts. The first task is to establish what is being asked and the context in which it arose.'],
  ['02','Set the scope','The work, records required, responsibilities and timing are defined for the engagement. Professional independence and applicable requirements are considered at this stage.'],
  ['03','Examine the evidence','The relevant records and framework are reviewed. The analysis is shaped by the matter rather than by a standard answer.'],
  ['04','Communicate the position','Findings, open points and next steps are discussed in terms that can be acted on. Where judgement is involved, its basis should be clear.']
 ];
 return `<section class="section process-story dark"><div class="process-sticky"><div class="eyebrow">How the work takes shape</div><h2>Clarity comes<br><em>from the process.</em></h2><p>Professional work is easier to understand when the question, scope and next step are visible.</p><div class="process-current"><span>Stage</span><strong data-process-count>01</strong><span>/ 04</span></div><div class="process-progress" aria-hidden="true"><span></span></div></div><div class="process-steps">${steps.map(([n,h,p])=>`<article class="process-step" data-step="${n}"><span>${n}</span><h3>${h}</h3><p>${p}</p></article>`).join('')}</div></section>`;
}

function home({partners,services,offices,partnerCards}){
 return `${clientHero()}
 ${serviceExplorer(services)}
 ${firstConversation()}
 <section class="section firm-intro" id="firm"><div class="firm-intro-title"><div class="eyebrow">The firm</div><h2>Depth across disciplines.<br><em>One accountable practice.</em></h2><p>Five constituent practices came together to form B N P S and Associates LLP.</p></div><div class="firm-intro-body"><p class="firm-lede">The firm combines work in <strong>audit and assurance</strong>, <strong>direct and indirect tax</strong>, <strong>financial reporting</strong> and <strong>real estate regulation</strong>.</p><p>Different matters call for different knowledge. Partners based in Gujarat and Karnataka bring their respective areas of practice to the question being considered.</p><p>One of the constituent firms was established in 1974. The present firm has offices in Ahmedabad, Bengaluru, Raichur and Rajkot.</p><a class="text-link" href="/firm/">Read about the firm</a></div></section>
 <section class="section people-showcase"><div class="section-head"><div><div class="eyebrow">Our people</div><h2>Professional judgement.<br><em>Shared experience.</em></h2></div><div><p>Our partners bring together experience in audit, tax, financial reporting and real estate regulation. Their professional backgrounds span practice, industry, teaching and authorship.</p><a class="text-link" href="/people/">Meet our partners</a></div></div>${cityChoices('Our partners in')}<div class="people-carousel" data-carousel="people">${partnerCards(partners)}</div><div class="carousel-controls"><span>14 partners · four cities</span><div><button type="button" data-carousel-direction="previous" aria-label="Previous partners">←</button><button type="button" data-carousel-direction="next" aria-label="Next partners">→</button></div></div></section>
 ${mergerStory(true)}
 ${industryGallery()}
 <section class="section office-preview"><div><div class="eyebrow">Office directory</div><h2>Across Gujarat<br><em>and Karnataka.</em></h2><p>View addresses and directions for Ahmedabad, Bengaluru, Raichur and Rajkot.</p><a class="button" href="/offices/">View office addresses</a></div><div class="office-map-list">${Object.keys(offices).map((city,i)=>`<a href="/contact/?city=${encodeURIComponent(city)}"><span>0${i+1}</span><strong>${city}</strong><span>View location</span></a>`).join('')}</div></section>
 <section class="section faq-section"><div class="faq"><div class="section-head"><div><div class="eyebrow">Before you get in touch</div><h2>A few practical questions.</h2></div></div><details><summary>What if I don’t know which service I need?</summary><p>Begin with a short description of the matter. You can make an enquiry without choosing a practice. The relevant area of work and scope are considered from the facts.</p></details><details><summary>What should I include in a meeting enquiry?</summary><p>Describe the matter, your preferred office and any relevant deadline. Supporting records can be shared through a channel agreed with the firm.</p></details><details><summary>Can I choose which office to speak with?</summary><p>Yes. BNPS has offices in Ahmedabad, Bengaluru, Raichur and Rajkot. Indicate your preferred city in your enquiry and view addresses in the office directory.</p></details><details><summary>Does requesting a meeting confirm an engagement?</summary><p>A meeting request starts an enquiry. The firm confirms the arrangements, and any engagement is agreed after the scope and professional requirements have been considered.</p></details></div></section>${nextStep()}`;
}

function peopleDirectory({partners,partnerCards}){
 return `<section class="people-heading"><div class="eyebrow">Our people</div><h1>Professional judgement.<br><em>Shared experience.</em></h1><p>Our partners work across <strong>audit, taxation, financial reporting and real estate regulation</strong>. Experience in professional practice, industry and technical education informs the way they examine each matter.</p></section><section class="section people-directory"><div class="directory-tools"><div class="directory-title"><div><span class="small-label">Partner directory</span><h2>The people behind the work.</h2></div><span class="result-count" role="status" aria-live="polite">14 partners</span></div><div class="city-filter" role="group" aria-label="Filter partners by city"><button type="button" data-city-choice="" aria-pressed="true">All cities</button>${cityNames.map(c=>`<button type="button" data-city-choice="${c}" aria-pressed="false">${c}</button>`).join('')}</div></div>${partnerCards(partners)}</section>`;
}

function partnerProfile(route,{partners}){
 const p=partners.find(x=>`/people/${slug(x[0])}/`===route);if(!p)return null;
 const index=partners.indexOf(p),prev=partners[(index-1+partners.length)%partners.length],next=partners[(index+1)%partners.length];
 return `<nav class="profile-breadcrumb" aria-label="Breadcrumb"><a href="/people/">Our people</a><span>/</span><span>CA ${p[0]}</span></nav><section class="profile-hero"><div class="profile-portrait"><img src="${image(p)}" alt="CA ${p[0]}" width="500" height="500"><div class="portrait-caption"><span>BNPS / Partner</span><span>${p[1]}</span></div></div><div class="profile-heading"><div class="eyebrow">Partner · ${p[1]}</div><h1>CA ${p[0]}</h1><p class="profile-specialty">${p[3]}</p><div class="profile-rule"></div><div class="profile-at-glance"><div><span>Qualifications</span><p>${p[4]}</p></div><div><span>Office city</span><p>${p[1]}</p></div></div><a class="text-link" href="/contact/?city=${encodeURIComponent(p[1].split(',')[0])}">Request a meeting</a></div></section><section class="section profile-content"><div class="profile-aside"><div class="eyebrow">Practice focus</div><h2>Areas of work.</h2><ul>${p[6].map(a=>`<li>${a}</li>`).join('')}</ul></div><div class="profile-biography"><div class="eyebrow">Professional background</div><h2>The work<br><em>behind the role.</em></h2>${p[5].map((text,i)=>`<p ${i===0?'class="bio-lead"':''}>${text}</p>`).join('')}${p[7]?`<a class="text-link" href="${p[7]}" target="_blank" rel="noopener noreferrer">LinkedIn profile</a>`:''}</div></section><nav class="profile-next" aria-label="Partner profiles"><a href="/people/${slug(prev[0])}/"><span>Previous partner</span><strong>CA ${prev[0]}</strong></a><a href="/people/" class="profile-all">All partners</a><a href="/people/${slug(next[0])}/"><span>Next partner</span><strong>CA ${next[0]}</strong></a></nav>`;
}

export function enhanceExperience(route,body,data){
 if(route==='/contact/')return enquiryPage(data);
 if(route==='/')return home(data);
 if(route==='/people/')return peopleDirectory(data);
 if(route.startsWith('/people/'))return partnerProfile(route,data)??body;
 if(route==='/services/')return `<section class="people-heading"><div class="eyebrow">Our services</div><h1>Areas of practice.</h1><p>Explore the firm’s work in tax, assurance, reporting, real estate and management advisory. Select an area to read its scope.</p></section>${serviceExplorer(data.services)}<section class="section dark"><div class="section-head"><h2>Scope and independence.</h2><p>Every engagement is considered in light of its facts, applicable requirements and professional independence obligations.</p></div><a class="button" style="border-color:#8297aa" href="/people/">Partner directory</a></section>`;
 if(route==='/firm/')return firmPage();
 if(route==='/careers/')return comingSoon('Careers');
 if(route==='/insights/')return comingSoon('Insights');
 if(route.startsWith('/services/')){const service=data.services.find(s=>route===`/services/${s[1]}/`);if(service)return body+nextStep(service)}
 return body;
}
