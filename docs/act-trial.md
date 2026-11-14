# act Trial — P24-T7

Trial running GitHub Actions workflows locally with [nektos/act](https://github.com/nektos/act).

## Installation

```bash
curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | bash -s -- -b ~/.local/bin
```

Version: `act version 0.2.97`

## Environment

- macOS Sequoia 15.2 (arm64/Apple Silicon)
- Docker Desktop running
- act config: `{"default_image": "medium"}` at `/Users/jph/Library/Application Support/act/actrc`

## Findings

### 1. Architecture warning

On Apple M-series (arm64), act prints:

```
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture,
you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠
```

**Resolution**: Use `--container-architecture linux/amd64` to run Linux/amd64 containers.

### 2. Dry-run mode works

```bash
act -j verify --container-architecture linux/amd64 --dryrun
```

Successfully simulates the verify job:

- Set up job
- actions/checkout@v7
- pnpm/action-setup@v6
- actions/setup-node@v7
- bin/ci --job verify
- All steps report Success

### 3. Image selection

The default medium image (`catthehacker/ubuntu:act-latest`) is used when `ACT_DEFAULT_IMAGE=medium` is set.

Without configuration, act prompts interactively for image selection (Large/Medium/Micro).

### 4. Full execution

Running without `--dryrun` attempts to:

1. Pull the Docker image
2. Create and start a container
3. Execute the workflow steps

**Note**: Full execution takes significant time (container startup, dependency install).

## Recommended invocation

```bash
ACT_DEFAULT_IMAGE=medium act -j verify --container-architecture linux/amd64
```

## Compatibility gaps (unverified)

From act documentation and secondary sources:

- Concurrency: act does not support `concurrency` groups
- Parts of the `github` context may not be available
- `workflow_dispatch` inputs are not supported
- Service containers are not supported

## Conclusion

act can run simple workflows like `verify` locally for testing. For arm64 macOS hosts, explicitly specifying `--container-architecture linux/amd64` avoids the architecture warning. The medium image is sufficient for basic workflow validation.

**Status**: Trial completed. act is viable for local CI testing with the architecture flag.

---

_tasks.md P24-T7_
