"""Rebuild dashboard data from the supplied WDI extract. Python standard library only.
Usage: python prepare_data.py path/to/Data.csv [output_directory]
"""
import csv, json, sys, pathlib, hashlib

source=pathlib.Path(sys.argv[1]); out=pathlib.Path(sys.argv[2] if len(sys.argv)>2 else 'dist')
out.mkdir(parents=True,exist_ok=True); (out/'downloads').mkdir(exist_ok=True)
countries={'BGD':'Bangladesh','IND':'India','NPL':'Nepal','PAK':'Pakistan','LKA':'Sri Lanka'}
metrics={
 'internet':('IT.NET.USER.ZS','Internet use','% of population',2024),
 'life':('SP.DYN.LE00.IN','Life expectancy','years',2024),
 'cooking':('EG.CFT.ACCS.ZS','Clean cooking access','% of population',2023),
 'gdp':('NY.GDP.MKTP.CD','GDP','current US$',2024),
 'ppp':('NY.GDP.PCAP.PP.CD','GDP per capita, PPP','current international $',2024)}
rows=list(csv.DictReader(source.open(encoding='utf-8-sig')))
valid=[r for r in rows if r['Series Code']]
assert len(valid)==3850
assert len({(r['Country Code'],r['Series Code']) for r in valid})==3850
data={k:{'code':v[0],'name':v[1],'unit':v[2],'year':v[3],'countries':{}} for k,v in metrics.items()}
long=[]
for k,(code,label,unit,year) in metrics.items():
 for cc,name in countries.items():
  row=next(r for r in valid if r['Country Code']==cc and r['Series Code']==code)
  values=[]
  for y in range(2016,2026):
   raw=row[f'{y} [YR{y}]']; value=None if raw in ('','..') else float(raw)
   values.append({'year':y,'value':value})
   long.append({'country':name,'country_code':cc,'indicator':label,'indicator_code':code,'year':y,'value':value,'unit':unit})
  data[k]['countries'][cc]=values
assert data['internet']['countries']['BGD'][8]['value']==53.42171316
(out/'data.json').write_text(json.dumps(data,indent=2))
with (out/'downloads/development_data.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=long[0].keys());w.writeheader();w.writerows(long)
with (out/'downloads/indicator_dictionary.csv').open('w',newline='') as f:
 w=csv.writer(f);w.writerow(['indicator_code','indicator','unit','dashboard_comparison_year','official_reference'])
 for code,label,unit,y in metrics.values():w.writerow([code,label,unit,y,f'https://data.worldbank.org/indicator/{code}'])
report={'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'valid_source_rows':len(valid),'selected_country_entries':len(countries),'selected_indicators':len(metrics),'output_rows':len(long),'missing_selected_values':sum(r['value'] is None for r in long),'source_verification':'Figures checked against supplied extract; original-source verification pending.','transformations':['Remove footer records without Series Code','Select five explicitly named country codes and five indicator codes','Reshape 2016-2025 columns to country-indicator-year records','Convert blank and .. to null; no imputation','Retain full numeric precision; round display only','Use metric-specific fixed comparison years, no mixed-year ranking']}
(out/'downloads/quality_report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
