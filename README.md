# MediNet Documentation

Static documentation website for MediNet, a federated learning platform for healthcare institutions. The default pages describe the **2.0.1 snapshot**; `versions/1.0/` preserves the previous documentation and screenshots.

Public documentation: [MediNet](https://isglobal-brge.github.io/MediNet/index.html).

## Review locally

No site build or npm dependencies are required. Serve the repository over HTTP so version switching can check destination anchors:

```sh
node scripts/preview.mjs
```

Open [local preview](http://127.0.0.1:8765). The server binds only to localhost. Pass a different port if needed, for example `node scripts/preview.mjs 8767`. Review the current pages, [version comparison](http://127.0.0.1:8765/changelog.html), and the paper-linked case study before approving publication.

## Version scope

- Hub: local checkout `MediNetHub-2.0.1`, pinned to `f09bb753d6eab67f889a160a3bc0e5b951d95fe5`. Its upstream README still says v0.2; no branch 2.1 functionality is included.
- Companion Node: `5e52ac5`, the same-day v0.2 merge. There is no independently named Node 2.0.1 tag.
- Legacy documentation: repository revision `201a5a8`, copied before editing into `versions/1.0/`; relative shared-asset paths are adjusted. Existing old screenshots remain under `images/`.
- New captures: 15 PNGs in `images/v2/`, rendered from original Hub templates and assets with synthetic demonstration data. The [manifest](images/v2/provenance.json) records source hashes, interactions, fixture data and limitations.

The version selector preserves the page and query string. It preserves fragments that exist in the destination; pages added after 1.0 open the 1.0 homepage. All original case-study IDs, particularly `use-cases.html#fig-1`, `#fig-2` and `#fig-4`, retain their numbering and purpose.

## Checks

```sh
node scripts/check-versioning.mjs
node scripts/check-docs.mjs
```

These checks cover version URL construction for root/project/local paths, shared assets for version 1.0, anchor handling, preservation of all original case-study IDs, unique IDs and every local linked target/image. Browser review additionally covers mobile navigation and responsive layouts. These checks do not validate a container deployment or an actual federated training run.

## Reproduce Hub screenshots

Use the pinned source checkout and existing Django/Playwright installations. Neither script changes the Hub source, creates a database or contacts hospital Nodes:

```sh
python scripts/capture-hub-fixtures.py PATH_TO_HUB_2.0.1_CHECKOUT 8766
# In a second shell:
node scripts/capture-hub-screenshots.cjs
```

The capture script also accepts the path to an installed Playwright module and Chromium executable as arguments, or `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE` environment variables. Consult the manifest for the documented source exception during the connection-expiry refresh. Every image is explicitly stamped as synthetic demonstration data.

## Pages

Home, Features, Installation, Security, User Guide, Use Cases, Roadmap, Funding, About, and the new version comparison.

## Team and contact

Developed by the Bioinformatic Research Group in Epidemiology (BRGE) at ISGlobal, Barcelona.

- Dr. Juan R. González — Principal Investigator — juanr.gonzalez@isglobal.org
- Ramon Mateo — PhD Student & Research Assistant — ramon.mateo@isglobal.org

This documentation is part of the MediNet project.
