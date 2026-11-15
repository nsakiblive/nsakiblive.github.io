"""Audit the supplied file without changing original values.
Usage: python prepare_audit.py climate_change_dataset.csv output_directory
Country-year is a candidate key, not an established dataset definition.
IDs refer to the supplied file hash and its original row ordering.
"""
import csv,json,collections,hashlib,pathlib,sys
source=pathlib.Path(sys.argv[1]);out=pathlib.Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
with source.open(encoding='utf-8-sig',newline='') as f:
 reader=csv.DictReader(f);fields=reader.fieldnames;raw=list(reader)
assert len(fields)==10 and len(raw)==1000
metrics=[c for c in fields if c not in ('Country','Year')]
records=[];groups=collections.defaultdict(list)
for i,r in enumerate(raw,1):
 rec={'id':f'CL-{i:04d}','source_record':i,'csv_line':i+1,'values':r};records.append(rec);groups[(r['Country'],int(r['Year']))].append(rec)
group_rows=[];issues=[]
for i,((country,year),rs) in enumerate(sorted(groups.items()),1):
 conflicts=[m for m in metrics if len({r['values'][m] for r in rs})>1]
 g={'country':country,'year':year,'count':len(rs),'source_ids':[r['id'] for r in rs],'conflicting_fields':conflicts};group_rows.append(g)
 if len(rs)>1:issues.append({'issue_id':f'KEY-{len(issues)+1:03d}','country':country,'year':year,'record_count':len(rs),'source_ids':'; '.join(g['source_ids']),'conflicting_fields':'; '.join(conflicts),'issue':'Repeated candidate key with differing values','required_clarification':'Confirm the intended row grain and missing region, scenario or measurement identifiers before resolving.'})
blank=sum(v is None or not v.strip() for r in raw for v in r.values());dups=len(raw)-len({tuple(r[c] for c in fields) for r in raw})
report={'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'source_filename':source.name,'records':len(raw),'fields':len(fields),'countries':len({r['Country'] for r in raw}),'year_min':min(int(r['Year']) for r in raw),'year_max':max(int(r['Year']) for r in raw),'blank_cells':blank,'full_row_duplicates':dups,'distinct_country_year_keys':len(groups),'repeated_key_groups':len(issues),'records_in_repeated_groups':sum(g['count'] for g in group_rows if g['count']>1),'records_beyond_unique_keys':sum(g['count']-1 for g in group_rows),'population_conflict_groups':sum(len({r['values']['Population'] for r in rs})>1 for rs in groups.values()),'candidate_key':'Country + Year; assumption for testing, not independently confirmed','source_id_rule':'CL-0001 through CL-1000 identify original data-record order within this source SHA-256. Header is CSV line 1.','source_values_changed':False,'limitations':'No authoritative-source validation, imputation, deletion, averaging or synthetic-origin assertion.'}
assert report['distinct_country_year_keys']==340 and len(issues)==262 and report['records_beyond_unique_keys']==660
(out/'data.json').write_text(json.dumps({'fields':fields,'metrics':metrics,'records':records,'groups':group_rows,'issues':issues,'report':report},ensure_ascii=False,separators=(',',':')))
(out/'quality_report.json').write_text(json.dumps(report,indent=2))
with (out/'source_records.csv').open('w',newline='',encoding='utf-8') as f:
 w=csv.DictWriter(f,fieldnames=['source_id','source_record','csv_line']+fields);w.writeheader();w.writerows({'source_id':r['id'],'source_record':r['source_record'],'csv_line':r['csv_line'],**r['values']} for r in records)
with (out/'issue_register.csv').open('w',newline='',encoding='utf-8') as f:
 w=csv.DictWriter(f,fieldnames=issues[0].keys());w.writeheader();w.writerows(issues)
print(json.dumps(report,indent=2))
