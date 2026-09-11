<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 378106ef1048e32dae9d97a9bafdef94565fb1ee0dd5a833d6cf9ee2b633b8b7

`status` searches both the active ledger and archive manifests. It reports the preserved state,
decision proof, and current record links, including archive ID when applicable. Refuse duplicate
IDs, ambiguous locations, missing files, or invalid archive manifests rather than choosing one.
Resolve archived references under §9. Status never restores an archived record to the active ledger.

For `/spectre status <record>`, read the resolved row, complete instruction, and result when present.
Report canonical ID, title, state, evidence mode, result availability, human decision proof, and
usable current record links/location. Change no files or lifecycle data.
