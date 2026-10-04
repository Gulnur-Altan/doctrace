# DocTrace

**AI documentation investigation agent for Angular 20 → Angular 21 migration.**

DocTrace helps developers investigate Angular migration questions by querying structured technical documentation stored in Sanity.

Instead of relying only on the language model's general knowledge, DocTrace retrieves relevant documentation from a Sanity Knowledge Base through **Sanity Context MCP** and uses that context to formulate its answer.

## Demo

**Live Demo:** https://doctrace-nine.vercel.app/

## What I Built

DocTrace is a focused documentation investigation agent for one specific technical problem:

> **What should I know when migrating an Angular 20 application to Angular 21?**

The agent can investigate topics such as:

* Breaking changes
* Migration steps
* Zoneless change detection
* Testing configuration
* Compatibility considerations
* Angular 20 → 21 migration checklists

The project intentionally keeps the scope narrow so that the agent can provide grounded answers from a curated documentation set.

## Architecture

```text
                    ┌─────────────────────┐
                    │      DocTrace UI     │
                    │      Next.js         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next.js API Route │
                    │      AI SDK         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Sanity Context    │
                    │        MCP          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Sanity Knowledge  │
                    │        Base         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Structured Sanity   │
                    │    Documents        │
                    └─────────────────────┘

                               +
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Gemini AI Model   │
                    └─────────────────────┘
```

## How Sanity Is Used

Sanity is not only used as a CMS or content storage layer.

The project uses Sanity as the documentation source for the AI agent.

Each documentation entry is stored as structured content with fields including:

* `title`
* `technology`
* `version`
* `type`
* `summary`
* `content`
* `sourceUrl`
* `publishedAt`
* `relatedVersions`
* `breakingChanges`

This structure makes the documentation easier to organize, retrieve, and reason over.

## Knowledge Base

The project contains a dedicated Sanity Knowledge Base containing five Angular documentation entries:

1. Angular 21 Migration Guide
2. Angular 20 to 21 Migration Guide
3. Angular 21 Zoneless Change Detection
4. Angular 21 Testing with Vitest
5. Angular 20 vs Angular 21 Migration Checklist

These documents are based on Angular's official documentation and are organized as structured Sanity content.

## Sanity Context MCP

DocTrace connects its AI agent to the Sanity Knowledge Base through **Sanity Context MCP**.

The MCP endpoint provides the agent with access to the relevant documentation context and tools.

The application initializes the Sanity context and exposes the available MCP tools to the AI model.

The model is instructed to:

1. Use the Sanity Knowledge Base for Angular migration questions.
2. Prefer retrieved documentation over unsupported assumptions.
3. Avoid inventing information that is not present in the available documentation.
4. Indicate when the Knowledge Base does not contain enough information.

## AI Agent

The application uses the Vercel AI SDK to orchestrate the model and Sanity Context MCP tools.

The current model is:

```text
Gemini
```

The agent can perform multiple tool-calling steps when investigating a question rather than relying on a single model response.

## Tech Stack

* Next.js
* React
* TypeScript
* Vercel AI SDK
* Sanity
* Sanity Knowledge Base
* Sanity Context MCP
* Gemini
* Vercel

## Project Structure

```text
doctrace-app/
├── src/
│   └── app/
│       ├── api/
│       │   └── chat/
│       │       └── route.ts
│       ├── page.tsx
│       └── ...
├── public/
├── .env.local
├── package.json
└── README.md
```

## Local Development

Clone the repository:

```bash
git clone https://github.com/Gulnur-Altan/doctrace
cd doctrace
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
SANITY_CONTEXT_MCP_URL=your_sanity_mcp_url
SANITY_ORGANIZATION_TOKEN=your_sanity_token
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Environment Variables

The following variables are required:

| Variable                       | Purpose                               |
| ------------------------------ | ------------------------------------- |
| `SANITY_CONTEXT_MCP_URL`       | Sanity Context MCP endpoint           |
| `SANITY_ORGANIZATION_TOKEN`    | Server-side authentication for Sanity |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API access                     |

**Do not commit `.env.local` or expose these credentials through client-side environment variables.**

## Example Investigation

Example question:

> What are the main breaking changes I should consider when migrating from Angular 20 to Angular 21?

DocTrace investigates the connected documentation and generates an answer based on the retrieved Sanity content.

Other example questions:

> How does zoneless change detection affect migration?

> What should I review in my Angular testing setup?

> What migration steps are recommended for Angular 20 to Angular 21?

## Sanity Project

**Sanity Project ID:** 3fv91nvs

**Knowledge Base:** Angular migration documentation

**MCP Endpoint:** DocTrace Angular Agent

## Why This Approach?

Documentation questions often require finding information across several pages rather than answering from a single document.

DocTrace explores a small, structured documentation set through Sanity Context MCP and lets the model combine the retrieved information into an investigation result.

The goal is not to build a general-purpose chatbot, but to demonstrate how structured content in Sanity can become a useful knowledge source for an AI agent.

## Built for the DEV.to Sanity Challenge 2026

DocTrace was created for the **DEV.to Sanity Challenge 2026** using Sanity structured content, a Sanity Knowledge Base, and Sanity Context MCP.
