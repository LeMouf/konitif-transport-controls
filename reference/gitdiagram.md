# GitDiagram architecture — @konitif/transport-controls

This architecture view was generated from the public repository by [GitDiagram](https://gitdiagram.com/lemouf/konitif-transport-controls) on 2026-09-20 18:46:12 UTC.

It is a documentation projection of the repository tree, README, and source files sampled by GitDiagram. It does not replace the authored contracts in [catalog.json](catalog.json) and [diagrams.json](diagrams.json), nor does it establish runtime authority.

The Mermaid source keeps GitDiagram's groups, nodes, relationships, and source links. GitDiagram's forced color classes and HTML line breaks are omitted so the diagram remains readable in local previews and dark themes.

- Public repository: [konitif-transport-controls](https://github.com/LeMouf/konitif-transport-controls)
- Interactive diagram: [Open in GitDiagram](https://gitdiagram.com/lemouf/konitif-transport-controls)

## Architecture diagram

```mermaid
flowchart TD

node_host(("Host application"))
node_state_factory["State factory — [index.ts]"]
node_intents["Control intents — [index.ts]"]
node_reducer["Intent reducer — [index.ts]"]
node_normalization["Normalization helpers — [index.ts]"]
node_transport_state["Transport state — [index.ts]"]
node_tool_declaration["Tool declaration — [index.ts]"]
node_konitif_tools["@konitif/tools"]

node_host -->|"creates"| node_state_factory
node_host -->|"constructs"| node_intents
node_intents -->|"supplies"| node_reducer
node_host -->|"dispatches"| node_reducer
node_state_factory -->|"normalizes"| node_normalization
node_state_factory -->|"returns"| node_transport_state
node_reducer -->|"creates on load"| node_state_factory
node_reducer -->|"normalizes inputs"| node_normalization
node_reducer -->|"returns"| node_transport_state
node_tool_declaration -->|"defines module"| node_konitif_tools

click node_state_factory "https://github.com/lemouf/konitif-transport-controls/blob/main/src/index.ts"
click node_intents "https://github.com/lemouf/konitif-transport-controls/blob/main/src/index.ts"
click node_reducer "https://github.com/lemouf/konitif-transport-controls/blob/main/src/index.ts"
click node_normalization "https://github.com/lemouf/konitif-transport-controls/blob/main/src/index.ts"
click node_transport_state "https://github.com/lemouf/konitif-transport-controls/blob/main/src/index.ts"
click node_tool_declaration "https://github.com/lemouf/konitif-transport-controls/blob/main/src/index.ts"

```

## Generated analysis

@konitif/transport-controls is a small pure TypeScript state machine. A host creates normalized transport state, constructs an explicit control intent, and passes both to the reducer, which returns the next deterministic state. The module covers loading, playback phase, seeking, ranges, rate, and looping; it does not own media, clocks, schedulers, stores, or playback effects. The sampled implementation is concentrated in src/index.ts; build, release, tests, and reference metadata are excluded.
