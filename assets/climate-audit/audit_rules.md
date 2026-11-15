# Climate data audit rules

Country-year is a candidate key for testing, not a verified row definition.

1. Preserve the original CSV byte-for-byte. Record its SHA-256 hash.
2. CL-0001..CL-1000 follow original data-record order within that version; CSV line = record number + 1.
3. Blank means None or whitespace-only. Compare full source row tuples to count exact duplicates.
4. Group by Country and integer Year. Record group count, source IDs and source fields with differing values.
5. One register issue per repeated country-year group. No arbitrary score or automatic severity rating.
6. Records beyond unique keys = sum(group size - 1). This is conditional on one record per key being intended, not an exact-duplicate count.
7. Do not average, delete, impute, correct or pick an authoritative record without a defensible rule and provenance.
8. The country-year grid displays file counts, not climate measurements. A zero does not prove an expected observation is missing.
9. Source-bar comparisons show unverified file values. No real-world trend or national estimate is inferred.
10. Provenance, indicator definitions and row grain remain unresolved. Do not assert synthetic origin from inconsistencies alone.
