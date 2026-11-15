"""Prepare traceable Paris river observations. Standard library only.
Usage: python prepare_paris.py paris_flood_dataset.csv output_directory
No station merging, imputation, guessed correction or row deletion is applied.
"""
import csv,json,sys,hashlib,collections,datetime,pathlib
source=pathlib.Path(sys.argv[1]);out=pathlib.Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
rows=list(csv.DictReader(source.open(encoding='utf-8-sig')))
stations=sorted({r['station_code'] for r in rows});qualities=['good','unqualified','dubious'];validations=['validated','pre-validated','raw']
keys=[(r['station_code'],r['record_date']) for r in rows]
assert len(set(keys))==len(keys),'Duplicate station-date key'
records=[];clean=[]
for r in rows:
 dt=datetime.date.fromisoformat(r['record_date']);v=float(r['water_level_mm'])
 flag=r['station_code']=='F700000102' and r['record_date']=='2026-07-24' and v==942000
 records.append([r['record_date'],stations.index(r['station_code']),v,qualities.index(r['quality_assessment']),validations.index(r['validation_status'])])
 clean.append({'record_date':r['record_date'],'station_code':r['station_code'],'water_level_mm':v,'water_level_m':v/1000,'quality_assessment':r['quality_assessment'],'validation_status':r['validation_status'],'source_flood_alert':r['flood_alert'],'review_flag':'unresolved_extreme_2026_07_24' if flag else ''})
meta=[]
for station in stations:
 rs=[r for r in rows if r['station_code']==station];dates=[r['record_date'] for r in rs]
 start=min(dates);end=max(dates);expected=(datetime.date.fromisoformat(end)-datetime.date.fromisoformat(start)).days+1
 meta.append({'code':station,'start':start,'end':end,'count':len(rs),'missing_days':expected-len(set(dates))})
report={'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'observations':len(rows),'unique_dates':len({r['record_date'] for r in rows}),'station_date_duplicates':len(keys)-len(set(keys)),'quality_counts':dict(collections.Counter(r['quality_assessment'] for r in rows)),'validation_counts':dict(collections.Counter(r['validation_status'] for r in rows)),'missing_production_dates':sum(not r['data_production_date'] for r in rows),'negative_readings':sum(float(r['water_level_mm'])<0 for r in rows),'alert_observations':sum(r['flood_alert']=='True' for r in rows),'alert_threshold_mismatches':sum((r['flood_alert']=='True')!=(float(r['water_level_mm'])>6000) for r in rows),'flagged_extreme_records':sum(bool(r['review_flag']) for r in clean),'stations':meta,'source_verification':'Supplied-file checks complete; original source and station datums not independently verified.','default_view':'Station F700000109, good quality, validated status, 1900-2026; known extreme excluded. No stations combined.'}
assert report['observations']==53687 and report['unique_dates']==46237
(out/'data.json').write_text(json.dumps({'stations':stations,'qualities':qualities,'validations':validations,'coverage':meta,'report':report,'records':records},separators=(',',':')))
with (out/'analysis_data.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=clean[0].keys());w.writeheader();w.writerows(clean)
(out/'quality_report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
