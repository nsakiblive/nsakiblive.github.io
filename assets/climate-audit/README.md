# Climate Data Quality Audit

Independent portfolio project by Nazmus Sakib. November 2026.

Live project: https://nsakiblive.github.io/case-climate-data-audit.html

Audit package: unchanged original climate_change_dataset.csv; source_records.csv with stable source IDs and CSV lines; 262 group-level issues in issue_register.csv; quality_report.json; audit_rules.md; field_clarifications.csv; prepare_audit.py; and the methodology PDF.

Rebuild: python prepare_audit.py climate_change_dataset.csv output_directory

Python standard library only. Source values remain unchanged. Country-year is a candidate key, not a verified definition of row grain. Completeness is reported separately from consistency. No generic quality score, automatic correction, real-world climate inference or synthetic-origin assertion is made.

IDs refer to original data-record order within the source SHA-256 version. One issue corresponds to one repeated group. The website shows all source fields and lets readers follow issue groups to source records.

Internal checks are complete. Provenance, measure definitions and intended record structure remain unresolved. Source licensing provenance has not been independently verified.
