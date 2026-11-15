let D,view='annual';const $=id=>document.getElementById(id),ns='http://www.w3.org/2000/svg';
const known=r=>D.stations[r[1]]==='F700000102'&&r[0]==='2026-07-24'&&r[2]===942000;
const year=r=>+r[0].slice(0,4),month=r=>+r[0].slice(5,7);
function quantile(a,p){if(!a.length)return null;const i=(a.length-1)*p,l=Math.floor(i),h=Math.ceil(i);return a[l]+(a[h]-a[l])*(i-l);}
function plot(target,points,{ymin=null,ymax=null,yLabel='Station water level (m)',xLabel='',colour='#a9cce9',decimals=1}={}){
 const host=$(target);if(!points.length){host.innerHTML='<p class="loading">No observations match these selections.</p>';return;}
 const w=Math.max(340,host.clientWidth||760),h=Math.min(340,Math.max(260,w*.46)),p={l:58,r:25,t:28,b:48},values=points.flatMap(r=>[r.y,r.low??r.y,r.high??r.y]);let lo=ymin??Math.min(0,...values),hi=ymax??Math.max(...values);if(hi<=lo)hi=lo+1;let range=hi-lo;if(ymax===null)hi+=range*.08;
 const first=points[0].x,last=points.at(-1).x,x=v=>p.l+(last===first?.5:(v-first)/(last-first))*(w-p.l-p.r),y=v=>h-p.b-(v-lo)/(hi-lo)*(h-p.t-p.b);
 let s=`<svg xmlns="${ns}" class="pr-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${yLabel}. ${xLabel}"><title>${yLabel}. ${xLabel}</title>`;
 for(let i=0;i<=4;i++){let n=lo+(hi-lo)*i/4,yy=y(n);s+=`<line x1="${p.l}" y1="${yy}" x2="${w-p.r}" y2="${yy}" stroke="#343d47"/><text x="${p.l-10}" y="${yy+4}" text-anchor="end">${n.toFixed(decimals)}</text>`;}
 const ticks=[...new Set([0,Math.round((points.length-1)/4),Math.round((points.length-1)/2),Math.round(3*(points.length-1)/4),points.length-1])];for(const i of ticks){const q=points[i];s+=`<text x="${x(q.x)}" y="${h-20}" text-anchor="middle">${q.label}</text>`;}
 if(points.some(q=>q.low!=null)){for(const q of points){s+=`<line x1="${x(q.x)}" y1="${y(q.low)}" x2="${x(q.x)}" y2="${y(q.high)}" stroke="${colour}" stroke-opacity=".4" stroke-width="16"/>`;}}
 let path='',pen=false;for(let i=0;i<points.length;i++){const q=points[i];if(q.gap)pen=false;path+=`${pen?'L':'M'}${x(q.x)},${y(q.y)} `;pen=true;}
 s+=`<path d="${path}" fill="none" stroke="${colour}" stroke-width="2.5" stroke-linejoin="round"/>`;
 for(const q of points){s+=`<circle cx="${x(q.x)}" cy="${y(q.y)}" r="3.2" fill="${colour}"><title>${q.tooltip??`${q.label}: ${q.y.toFixed(3)} m`}</title></circle>`;}
 s+=`<text x="${p.l}" y="15">${yLabel}</text></svg>`;host.innerHTML=s;
}
function table(target,headers,rows){$(target).innerHTML='<table><thead><tr>'+headers.map(h=>`<th scope="col">${h}</th>`).join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((v,i)=>i?`<td>${v}</td>`:`<th scope="row">${v}</th>`).join('')+'</tr>').join('')+'</tbody></table>';}
function filters(){const station=+$('station').value,q=$('quality').value,v=$('validation').value,from=+$('from').value,to=+$('to').value,exclude=$('exclude').checked;
 $('filtered-download').hidden=true;
 if(!Number.isInteger(from)||!Number.isInteger(to)||from<1900||to>2026||from>to){$('filter-summary').textContent='Choose whole years from 1900 to 2026, with the start no later than the end.';$('history-chart').innerHTML='';$('history-table').innerHTML='';return;}
 const rows=D.records.filter(r=>r[1]===station&&year(r)>=from&&year(r)<=to&&(q==='all'||r[3]===+q)&&(v==='all'||r[4]===+v)&&(!exclude||!known(r)));
 $('filter-summary').textContent=`${rows.length.toLocaleString()} observations · ${D.stations[station]} · ${from}–${to} · ${q==='all'?'all quality labels':D.qualities[+q]} · ${v==='all'?'all validation labels':D.validations[+v]} · known extreme ${exclude?'excluded':'included if it matches the filters'}`;
 if(!rows.length){plot('history-chart',[]);$('history-table').innerHTML='';return;}
 if(view==='annual'){
  const groups=new Map();for(const r of rows){let a=groups.get(year(r));if(!a)groups.set(year(r),a=[]);a.push(r);}
  const entries=[...groups].sort((a,b)=>a[0]-b[0]);const pts=entries.map(([yy,rs],i)=>{const max=rs.reduce((a,b)=>a[2]>b[2]?a:b),expected=(Date.UTC(yy+1,0,1)-Date.UTC(yy,0,1))/86400000;return {x:yy,y:max[2]/1000,label:String(yy),gap:i>0&&yy!==entries[i-1][0]+1,tooltip:`${yy}: ${(max[2]/1000).toFixed(3)} m on ${max[0]}; ${rs.length}/${expected} calendar days`,date:max[0],n:rs.length,expected};});
  $('history-title').textContent='Annual maximum recorded water level';$('history-note').textContent='One station only. Maxima use the selected quality and validation filters. Partial years remain visible; the data table shows observed days against the full calendar year.';
  plot('history-chart',pts,{xLabel:'Annual maxima, '+D.stations[station]});table('history-table',['Year','Maximum (m)','Peak date','Observed days','Full calendar days'],pts.map(p=>[p.label,p.y.toFixed(3),p.date,p.n,p.expected]));
 }else{
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];let pts=[];
  for(let m=1;m<=12;m++){let a=rows.filter(r=>month(r)===m).map(r=>r[2]/1000).sort((a,b)=>a-b);if(a.length)pts.push({x:m,label:months[m-1],y:quantile(a,.5),low:quantile(a,.25),high:quantile(a,.75),n:a.length,tooltip:`${months[m-1]}: median ${quantile(a,.5).toFixed(3)} m; IQR ${quantile(a,.25).toFixed(3)}–${quantile(a,.75).toFixed(3)} m; n=${a.length}`});}
  $('history-title').textContent='Monthly distribution within the selected station';$('history-note').textContent='Dots show medians; vertical bands show the 25th to 75th percentiles. Months pool only the selected station, years and quality filters. This is descriptive, not a forecast or a cross-station trend.';
  plot('history-chart',pts,{xLabel:'Monthly distribution, '+D.stations[station]});table('history-table',['Month','Median (m)','25th percentile','75th percentile','Observations'],pts.map(p=>[p.label,p.y.toFixed(3),p.low.toFixed(3),p.high.toFixed(3),p.n]));
 }
 const csv=['record_date,station_code,water_level_mm,water_level_m,quality_assessment,validation_status',...rows.map(r=>[r[0],D.stations[r[1]],r[2],r[2]/1000,D.qualities[r[3]],D.validations[r[4]]].join(','))].join('\n');if(window.lastDownload)URL.revokeObjectURL(window.lastDownload);window.lastDownload=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));$('filtered-download').href=window.lastDownload;$('filtered-download').download='paris_selected_observations.csv';$('filtered-download').hidden=false;
}
function dayPoints(rs){return rs.map((r,i)=>({x:Date.parse(r[0]+'T00:00:00Z')/86400000,y:r[2]/1000,label:r[0].slice(5),gap:i>0&&(Date.parse(r[0])-Date.parse(rs[i-1][0]))>86400000,tooltip:`${r[0]}: ${(r[2]/1000).toFixed(3)} m; ${D.qualities[r[3]]}; ${D.validations[r[4]]}`}));}
async function init(){const r=await fetch('assets/paris-river/data.json');if(!r.ok)throw Error('Data unavailable');D=await r.json();
 const chronological=[...D.coverage].sort((a,b)=>a.start.localeCompare(b.start));$('timeline').innerHTML=chronological.map(s=>{const left=(Date.parse(s.start)-Date.parse('1900-01-01'))/(Date.parse('2027-01-01')-Date.parse('1900-01-01'))*100,width=(Date.parse(s.end)-Date.parse(s.start))/(Date.parse('2027-01-01')-Date.parse('1900-01-01'))*100;return `<div class="station-row ${s.code.endsWith('103')?'overlap':''}"><span class="station-code">${s.code}</span><div class="station-track" aria-label="${s.start} to ${s.end}"><div class="station-span" style="left:${left}%;width:${width}%"></div></div><span class="station-note">${s.start} to ${s.end}<br>${s.count.toLocaleString()} records · ${s.missing_days} missing dates within span</span></div>`;}).join('');
 $('station').innerHTML=chronological.map(s=>`<option value="${D.stations.indexOf(s.code)}">${s.code} (${s.start.slice(0,4)}–${s.end.slice(0,4)})</option>`).join('');$('station').value=D.stations.indexOf('F700000109');
 for(const id of ['station','quality','validation','from','to','exclude'])$(id).addEventListener('change',filters);
 for(const id of ['from','to'])$(id).addEventListener('input',filters);
 for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(c=>{c.classList.toggle('active',c===b);c.setAttribute('aria-pressed',String(c===b));});filters();});filters();
 const event=D.records.filter(r=>D.stations[r[1]]==='F700000109'&&r[0]>='1910-01-01'&&r[0]<='1910-02-28');plot('event-chart',dayPoints(event),{xLabel:'Station F700000109, January–February 1910'});table('event-table',['Date','Water level (m)','Quality','Validation'],event.map(r=>[r[0],(r[2]/1000).toFixed(3),D.qualities[r[3]],D.validations[r[4]]]));
 const recent=D.records.filter(r=>D.stations[r[1]]==='F700000102'&&r[0]>='2026-07-01'&&r[0]<='2026-07-31');plot('raw-chart',dayPoints(recent),{xLabel:'July 2026, station F700000102, all records',colour:'#c0b8ee',decimals:0});plot('review-chart',dayPoints(recent.filter(r=>!known(r))),{xLabel:'July 2026, station F700000102, extreme omitted',colour:'#c0b8ee',ymin:0});
 $('outlier-summary').textContent=`Same station and same calendar month. The raw panel has ${recent.length} observations; the review panel has ${recent.filter(r=>!known(r)).length}. Y-axis scales differ and are labelled. The excluded date remains a gap, not an interpolated observation.`;
}
init().catch(e=>{$('filter-summary').textContent='The observations could not be loaded. Refresh this page or use the downloadable data package.';console.error(e);});
