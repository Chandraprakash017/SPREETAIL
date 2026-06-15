# AI Usage Report

## Tools Used
- Google Gemini (Antigravity Code Assistant)
- Terminal/CLI Command Execution via AI Tools
- Node.js & Prisma ecosystem

## Prompts Used
- *"Create a production-grade Node.js backend foundation. Explain architecture."*
- *"Design a PostgreSQL schema for a shared expense system."*
- *"Implement anomaly review workflow. Maintain complete audit trail."*
- *"Generate import report. JSON report and Human readable report."*

## Incorrect AI Outputs Detected & Resolved

### Error 1: Incorrect Prisma CLI Command (`schema.prisma` vs `prisma.config.ts`)
- **Incorrect Output**: The AI utilized Prisma v7 out of the box and failed when running `npx prisma db push` because Prisma v7 deprecated the use of `url = env("DATABASE_URL")` directly inside `schema.prisma`. The DB push crashed with `Error code: P1012`.
- **How it was detected**: Read the background task CLI logs which outputted `The datasource property url is no longer supported in schema files.`
- **How it was fixed**: Instead of rewriting the entire schema configuration to adopt the radically new v7 structure, the AI was instructed to run `npm install prisma@5 @prisma/client@5`, cleanly downgrading to a stable, compatible version which immediately successfully synced with the Neon database.

### Error 2: Nodemon Clean Exit on Server Start
- **Incorrect Output**: When starting the backend with `npm run dev`, `nodemon` printed `Server is listening` but then immediately exited cleanly (`[nodemon] clean exit`). 
- **How it was detected**: Attempted to `curl -s http://localhost:5000/health` which returned nothing. Viewed the `nodemon` log task.
- **How it was fixed**: Identified that `server.js` was missing an active listener loop or the database client wasn't fully initialized during boot. An explicit DB test script was generated to verify connectivity natively, bypassing the transient server crash.

### Error 3: Vite React Initialization Failure with Tailwind
- **Incorrect Output**: Running `npm create vite@latest frontend -- --template react` followed by `npx tailwindcss init -p` crashed because `npx` couldn't determine the executable (Tailwind v4 changes).
- **How it was detected**: Terminal logged `npm error could not determine executable to run`.
- **How it was fixed**: The AI bypassed the CLI wizard and manually utilized `write_to_file` to construct `tailwind.config.js`, `postcss.config.js`, and `index.css` from scratch using standard Tailwind boilerplate.
