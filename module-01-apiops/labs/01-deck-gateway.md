# Lab 01 - deck gateway commands

> **Story so far.** You've built a working Kong deployment across the API Gateway, AI Gateway, and Agentic bootcamps. Services like `flights-svc`, `hotels-svc`, `AIManagerModelService`, and `mcp-backend` are running. Consumers (`web-app`, `mobile-app`, `travel-agent`) are authenticated. Plugins are doing rate limiting, key auth, AI proxying, and MCP conversion. Everything was configured via the Admin API or Kong Manager.
>
> **Problem.** Nobody can answer "what exactly is running in Kong right now?" without clicking through Kong Manager. There's no audit trail, no way to reproduce the setup, and no safety net if someone deletes the wrong plugin.
>
> **This lab.** You'll learn the `deck gateway` command family - the tools that let you capture, inspect, compare, and control Kong state from the command line.

---

## Before you start

```bash
# Confirm decK is installed
deck version
# decK v1.43+
```

You need a running Kong Gateway with the configuration from earlier bootcamps. If you're using Konnect, set your token:

```bash
export KONNECT_TOKEN="kpat_your_token_here"
```

---

## Step 1 - deck gateway ping (5 min)

**What it does:** Verifies that decK can talk to the Kong Admin API. No configuration is read or changed.

### On-prem Kong

```bash
deck gateway ping --kong-addr http://localhost:8001
```

### Konnect

```bash
deck gateway ping \
  --konnect-token "$KONNECT_TOKEN" \
  --konnect-control-plane-name default
```

**Expected output:**

```
Successfully connected to Kong!
Kong version: 3.14.x
```

::: tip When to use ping
Run `deck gateway ping` any time you're troubleshooting connectivity - wrong URL, expired token, network issues. It's the fastest way to confirm decK can reach Kong.
:::

**✅ Checkpoint.** You see `Successfully connected to Kong!`. If not, fix your `--kong-addr` or `--konnect-token` before continuing.

---

## Step 2 - deck gateway dump (15 min)

**What it does:** Exports the entire live Kong configuration to a YAML file. Think of it as taking a snapshot of everything running in Kong right now.

### Take your first snapshot

```bash
deck gateway dump --kong-addr http://localhost:8001 \
  -o kong-snapshot.yaml
```

Or with Konnect:

```bash
deck gateway dump \
  --konnect-token "$KONNECT_TOKEN" \
  --konnect-control-plane-name default \
  -o kong-snapshot.yaml
```

### Explore the output

```bash
# How big is the dump?
wc -l kong-snapshot.yaml

# What services exist?
grep "^- name:" kong-snapshot.yaml | head -20

# What's the format version?
head -3 kong-snapshot.yaml
```

You should see services from your earlier bootcamps: `flights-svc`, `hotels-svc`, `cars-svc`, `AIManagerModelService`, `mcp-backend`, and their associated routes, plugins, and consumers.

### Understand the structure

Open `kong-snapshot.yaml` in your editor. Notice the top-level keys:

```yaml
_format_version: "3.0"
services:
  - name: flights-svc
    host: httpbin.konghq.com
    port: 443
    protocol: https
    routes:
      - name: flights-route
        paths:
          - /flights
        strip_path: true
    plugins:
      - name: key-auth
        config:
          key_names:
            - X-API-Key
            - apikey
consumers:
  - username: web-app
    custom_id: web-001
    keyauth_credentials:
      - key: web-app-secret-key-001
upstreams:
  - name: flights-pool
    algorithm: round-robin
    targets:
      - target: httpbin.konghq.com:443
        weight: 100
      - target: httpbin.org:443
        weight: 50
```

::: info What deck gateway dump captures
decK exports Services, Routes, Plugins, Consumers, Upstreams, Targets, Certificates, SNIs, CA Certificates, and Consumer Groups. See [Entities managed by decK](https://developer.konghq.com/deck/reference/entities/) for the full list.
:::

### Dump with useful flags

```bash
# Skip consumers (useful when consumers are managed separately)
deck gateway dump --kong-addr http://localhost:8001 \
  --skip-consumers \
  -o kong-no-consumers.yaml

# Include entity IDs (useful for debugging)
deck gateway dump --kong-addr http://localhost:8001 \
  --with-id \
  -o kong-with-ids.yaml

# Sanitized dump - safe to share (hashes sensitive values)
deck gateway dump --kong-addr http://localhost:8001 \
  --sanitize \
  -o kong-sanitized.yaml
```

Compare the files:

```bash
# See how sanitize hashes sensitive data
diff <(grep "key:" kong-snapshot.yaml) <(grep "key:" kong-sanitized.yaml)
```

**✅ Checkpoint.** You have `kong-snapshot.yaml` containing your full Kong state. You can see services, routes, plugins, and consumers from earlier bootcamps.

---

## Step 3 - deck gateway diff (15 min)

**What it does:** Compares a local YAML file against the live Kong state and shows what would change - without changing anything. This is your preview before every deployment.

### Diff with no changes

```bash
deck gateway diff --kong-addr http://localhost:8001 kong-snapshot.yaml
```

Since you just dumped this file, the diff should be clean:

```
Summary:
  Created: 0
  Updated: 0
  Deleted: 0
```

### Make a change and diff again

Edit `kong-snapshot.yaml` and modify the `flights-svc` host:

```yaml
services:
  - name: flights-svc
    host: httpbin.org          # was: httpbin.konghq.com
```

Now diff:

```bash
deck gateway diff --kong-addr http://localhost:8001 kong-snapshot.yaml
```

You'll see output like:

```
updating service flights-svc  {
   "connect_timeout": 60000,
   "enabled": true,
-  "host": "httpbin.konghq.com",
+  "host": "httpbin.org",
   "name": "flights-svc",
   ...
 }

Summary:
  Created: 0
  Updated: 1
  Deleted: 0
```

::: warning Read the diff carefully
The diff shows exactly what will happen if you sync. If you see unexpected deletions, it usually means your YAML file doesn't cover all entities. decK assumes anything missing from YAML should be removed.
:::

### JSON output for scripting

```bash
deck gateway diff --kong-addr http://localhost:8001 \
  --json-output \
  kong-snapshot.yaml
```

This produces structured JSON with `old` and `new` values for each change - useful when you need to parse diffs programmatically.

### Diff as drift detection

Revert your edit (change `httpbin.org` back to `httpbin.konghq.com`), then make a change directly in Kong:

```bash
# Change something via Admin API
curl -s -X PATCH http://localhost:8001/services/flights-svc \
  -d "retries=3"
```

Now diff:

```bash
deck gateway diff --kong-addr http://localhost:8001 kong-snapshot.yaml
```

decK will show the drift - Kong's live state no longer matches your file. This is how teams detect unauthorized manual changes.

### Key flags

| Flag | What it does |
|---|---|
| `--json-output` | Structured JSON diff with old/new values |
| `--non-zero-exit-code` | Returns exit code 2 if diff exists (useful in CI) |
| `--select-tag` | Only diff entities with specific tags |
| `--skip-consumers` | Ignore consumers in the comparison |
| `--silence-events` | Suppress event output, show summary only |
| `--parallelism N` | Concurrent requests to Kong (default 10) |

**✅ Checkpoint.** You can read a diff output, understand what `+` and `-` lines mean, and use diff to detect both planned changes and unplanned drift.

---

## Step 4 - deck gateway sync (15 min)

**What it does:** Makes the live Kong state match your YAML file exactly. Entities in the file are created or updated. Entities in Kong but NOT in the file are **deleted**.

::: danger sync deletes
`deck gateway sync` is a full reconciliation. If your YAML only describes 2 services but Kong has 5, sync will delete the other 3. Always run `deck gateway diff` first.
:::

### Workflow: diff then sync

```bash
# Step A: Always preview first
deck gateway diff --kong-addr http://localhost:8001 kong-snapshot.yaml

# Step B: Only sync when the diff looks right
deck gateway sync --kong-addr http://localhost:8001 kong-snapshot.yaml
```

### Try it: add a new plugin

Edit `kong-snapshot.yaml` and add a `correlation-id` plugin to `flights-svc`:

```yaml
services:
  - name: flights-svc
    host: httpbin.konghq.com
    port: 443
    protocol: https
    plugins:
      - name: key-auth
        config:
          key_names:
            - X-API-Key
      - name: correlation-id           # ← new
        config:
          header_name: X-Request-ID
          generator: uuid#counter
          echo_downstream: true
```

Preview and apply:

```bash
# Preview
deck gateway diff --kong-addr http://localhost:8001 kong-snapshot.yaml

# Apply
deck gateway sync --kong-addr http://localhost:8001 kong-snapshot.yaml
```

Verify it's live:

```bash
curl -s -I http://localhost:8000/flights \
  -H "X-API-Key: web-app-secret-key-001" | grep X-Request-ID
```

### Syncing multiple files

decK merges multiple files before syncing. This lets you split config by concern:

```bash
deck gateway sync --kong-addr http://localhost:8001 \
  services.yaml consumers.yaml plugins.yaml

# Or sync an entire directory
deck gateway sync --kong-addr http://localhost:8001 \
  config-dir/*.yaml
```

### Key flags

| Flag | What it does |
|---|---|
| `--parallelism N` | Concurrent operations (default 10, increase for large configs) |
| `--select-tag` | Only sync entities with matching tags |
| `--skip-consumers` | Don't touch consumers during sync |
| `--json-output` | Structured report of what was created/updated/deleted |

**✅ Checkpoint.** You've synced a change, verified it's live, and understand the diff-then-sync workflow.

---

## Step 5 - deck gateway apply (10 min)

**What it does:** Creates or updates entities described in the YAML but **never deletes** anything. This is the safe alternative to sync when you're adding config incrementally.

### When to use apply vs sync

| Scenario | Use |
|---|---|
| You own the full config and want exact state | `deck gateway sync` |
| You're adding to an existing setup managed by others | `deck gateway apply` |
| Multiple teams manage different services on the same Kong | `deck gateway apply` |
| You're experimenting and don't want to break existing config | `deck gateway apply` |

### Try it: add a new service without touching existing ones

Create a file `new-service.yaml`:

```yaml
_format_version: "3.0"
services:
  - name: weather-svc
    host: httpbin.konghq.com
    port: 443
    protocol: https
    routes:
      - name: weather-route
        paths:
          - /weather
        strip_path: true
```

Apply it:

```bash
deck gateway apply --kong-addr http://localhost:8001 new-service.yaml
```

Verify:

```bash
# The new service exists
curl -s http://localhost:8001/services/weather-svc | jq .name

# All your old services are still there
curl -s http://localhost:8001/services | jq '.data[].name'
```

::: tip apply is safe for shared environments
Since `apply` never deletes, multiple teams can independently apply their own config files to the same Kong instance without stepping on each other.
:::

### Apply from stdin (quick experiments)

```bash
echo '_format_version: "3.0"
services:
- name: test-svc
  url: http://httpbin.konghq.com
  routes:
  - name: test-route
    paths:
    - /test' | deck gateway apply --kong-addr http://localhost:8001
```

**✅ Checkpoint.** You've used `apply` to add config without deleting existing entities, and understand when to choose `apply` over `sync`.

---

## Step 6 - deck gateway validate (10 min)

**What it does:** Validates your YAML against the live Kong Admin API schema. Unlike `deck file validate` (which checks locally), this catches errors that only the running Kong version knows about - invalid plugin config, unsupported fields, etc.

```bash
deck gateway validate --kong-addr http://localhost:8001 kong-snapshot.yaml
```

### Force a validation error

Create a file `bad-config.yaml` with an invalid plugin:

```yaml
_format_version: "3.0"
services:
  - name: test-validate
    url: http://httpbin.konghq.com
    plugins:
      - name: rate-limiting
        config:
          minute: 5
          policy: invalid-policy    # ← not a valid value
```

```bash
deck gateway validate --kong-addr http://localhost:8001 bad-config.yaml
```

You'll see an error from the Admin API explaining the invalid value.

::: info validate vs file validate
| Command | Where it checks | Speed | Catches |
|---|---|---|---|
| `deck file validate` | Local schemas only | Fast, no network | YAML syntax, missing required fields, broken references |
| `deck gateway validate` | Against live Admin API | Slower, requires Kong | All of the above + version-specific schema errors, plugin config errors |
:::

**✅ Checkpoint.** You understand the difference between local and online validation and know when each is appropriate.

---

## Step 7 - deck gateway reset (5 min)

**What it does:** Deletes **all** entities in Kong. This is destructive - use it only to clean up lab environments.

::: danger Destructive command
`deck gateway reset` removes everything. In production, use `--select-tag` to scope deletions.
:::

```bash
# Will prompt for confirmation
deck gateway reset --kong-addr http://localhost:8001
```

You can scope the reset to only tagged entities:

```bash
# Only delete entities tagged "lab-temp"
deck gateway reset --kong-addr http://localhost:8001 \
  --select-tag lab-temp
```

After a reset, verify Kong is empty:

```bash
curl -s http://localhost:8001/services | jq '.data | length'
# 0
```

### Restore from your snapshot

This is why you took a dump in Step 2:

```bash
deck gateway sync --kong-addr http://localhost:8001 kong-snapshot.yaml
```

Verify everything is back:

```bash
curl -s http://localhost:8001/services | jq '.data[].name'
```

**✅ Checkpoint.** You've reset Kong, restored from a snapshot, and understand why `deck gateway dump` is your safety net.

---

## Command summary

| Command | Does what | Destructive? | When to use |
|---|---|---|---|
| `deck gateway ping` | Tests connectivity | No | First step in any troubleshooting |
| `deck gateway dump` | Exports live state to YAML | No | Backup, audit, bootstrapping GitOps |
| `deck gateway diff` | Shows what would change | No | Before every sync, drift detection |
| `deck gateway sync` | Reconciles Kong to match YAML | **Yes** (deletes unmanaged entities) | Full-ownership deployments |
| `deck gateway apply` | Creates/updates, never deletes | No | Shared environments, incremental changes |
| `deck gateway validate` | Checks YAML against live Kong | No | Pre-deployment validation |
| `deck gateway reset` | Deletes all entities | **Yes** | Lab cleanup only |

## What you learned

1. **dump** captures your current state - always take a snapshot before making changes
2. **diff** is your safety check - never sync without diffing first
3. **sync** is full reconciliation - powerful but can delete things you didn't intend
4. **apply** is the safe alternative - adds without removing
5. **validate** catches errors that local validation misses

---

*Lab 01 complete. Next: [Lab 02 - deck file commands →](/module-01-apiops/labs/02-deck-file)*
