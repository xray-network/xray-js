# Cardano implementation 0005 instruction

Implementation-Version: v1
Implementation-ID: cardano/0005
Created: 20260807T101108Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input                                                                             | Kind    | Required | Purpose                                                                      |
| --------------------------------------------------------------------------------- | ------- | -------- | ---------------------------------------------------------------------------- |
| Human request to consume mini-app CIP-67 behavior through xray-js and cardano-lib | `LOCAL` | Yes      | Authorizes the focused Cardano facade export and downstream consolidation.   |
| `packages/cardano/src/index.ts`                                                   | `LOCAL` | Yes      | Owns the public `@xray-network/xray-js/cardano` export surface.              |
| `packages/cardano/package.json`                                                   | `LOCAL` | Yes      | Declares the existing direct Cardano CIP library dependency.                 |
| Linked `@xray-network/xray-cardano-lib-cip/cip67` declaration and implementation  | `LOCAL` | Yes      | Defines the focused proposal API to expose without reimplementing its codec. |
| `packages/cardano/test/` and `packages/runtime/`                                  | `LOCAL` | Yes      | Define public-contract validation and the root runtime re-export boundary.   |
| `README.md`                                                                       | `LOCAL` | Yes      | Owns the documented direct Cardano import surface and proposal guidance.     |

## Objective

Expose focused cardano-lib CIP and UPLC modules through consistent xray-js Cardano namespaces so consumers can remove duplicate local implementations and avoid misleading full-library aliases.

## Changes to implement

| Change ID | Requirement                                                                                                                                                                                                             | Compatibility                                                                                                                                                        | Local owner                                       | Validation                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `C01`     | Export and document the focused cardano-lib CIP-67 API as a `cip67` namespace from `@xray-network/xray-js/cardano`.                                                                                                     | Additive only; keep CIP-67 explicitly namespaced because it remains a focused proposal API.                                                                          | Cardano package root, runtime, and README         | Build declarations and import-smoke both package entrypoints.                                  |
| `C02`     | Add public-contract coverage for official label encoding/decoding and strict invalid-label behavior through the xray-js export.                                                                                         | Do not duplicate the codec or weaken cardano-lib validation.                                                                                                         | Cardano tests                                     | Run Cardano and repository tests, typechecks, and builds.                                      |
| `C03`     | Replace the misleading `CIP8` and `UPLC` aliases of the complete cardano-lib root with focused lowercase `cip8` and `uplc` namespaces backed by their owning package subpaths; declare every directly imported package. | This intentionally removes two incorrect public aliases before v4 review; `CardanoLib` remains the complete-library namespace and internal imports remain unchanged. | Cardano package root, manifest, tests, and README | Build declarations, test focused symbols, scan for retired exports, and run repository checks. |

## Implementation steps

1. Add the direct namespace export at the Cardano package root.
2. Extend public-import tests with a known CIP-67 vector and invalid input assertion.
3. Build and validate the Cardano package and root runtime facade.
4. Normalize CIP-8 and UPLC exports to focused lowercase namespaces and declare their direct dependencies.
5. Record the outcome and move the implementation to `REVIEW`.

## Validation

- `npm run build --workspace=@xray-network/xray-js-cardano`
- `npm run typecheck --workspace=@xray-network/xray-js-cardano`
- `npm test --workspace=@xray-network/xray-js-cardano`
- `npm run build`
- `npm run typecheck`
- `npm test`
- Import-smoke `cip67` from `@xray-network/xray-js/cardano`.
- Import-smoke `cip8`, `cip67`, and `uplc`; confirm the retired `CIP8` and `UPLC` exports are absent.
- `git diff --check`

## Compatibility and human review

Review the lowercase namespace convention, the intentional removal of the misleading uppercase aliases, and confirm that CIP-67 remains focused rather than being flattened into the stable Cardano root.

## Completion criteria

- The xray-js Cardano facade exposes cardano-lib's exact CIP-67 functions under `cip67`.
- No codec implementation is copied into xray-js.
- Public vector, invalid-label, package, and repository validation passes.
- `CardanoLib` is the only complete-library namespace; `cip8`, `cip67`, and `uplc` expose only their focused owners.

## Out of scope

Changing cardano-lib, stabilizing CIP-67, adding registry metadata, changing CIP-68, rewriting internal Cardano imports, or publishing packages.

## Blockers

None.
