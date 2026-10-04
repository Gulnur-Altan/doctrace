import { createMCPClient } from '@ai-sdk/mcp'
import { google } from '@ai-sdk/google'
import { generateText, stepCountIs } from 'ai'

export async function POST(req: Request) {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
        return Response.json(
            { error: 'Message is required.' },
            { status: 400 }
        )
    }

    const mcpUrl = process.env.SANITY_CONTEXT_MCP_URL
    const token = process.env.SANITY_ORGANIZATION_TOKEN
    const openApiKey = process.env.OPEN_API_KEY

    if (!mcpUrl || !token) {
        return Response.json(
            { error: 'Sanity MCP environment variables are missing.' },
            { status: 500 }
        )
    }

    let mcpClient

    try {
        // 1. Fetch Sanity Context initial context
        const initialContextUrl = new URL(mcpUrl)

        initialContextUrl.pathname =
            `${initialContextUrl.pathname.replace(/\/$/, '')}/initial-context`

        const initialContextResponse = await fetch(initialContextUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!initialContextResponse.ok) {
            throw new Error(
                `Sanity initial context failed: ${initialContextResponse.status}`
            )
        }

        const initialContext = await initialContextResponse.text()

        // 2. Connect to Sanity Context MCP
        mcpClient = await createMCPClient({
            transport: {
                type: 'http',
                url: mcpUrl,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        })

        // 3. Get tools exposed by the Sanity Knowledge Base
        const allTools = await mcpClient.tools()

        // initial_context is already fetched above.
        const { initial_context: _, ...tools } = allTools

        // 4. Ask the model to investigate the user's question
        const result = await generateText({
            model: google('gemini-3.8-flash'),

            system: `
You are DocTrace, an AI documentation investigation agent.

Your job is to answer technical questions using the connected Sanity
Knowledge Base.

The Knowledge Base contains structured Angular documentation focused on
Angular 20 to Angular 21 migration.

IMPORTANT RULES:

1. Use the Sanity Knowledge Base tools whenever the question relates
   to Angular migration, breaking changes, configuration, testing,
   compatibility, or related documentation.

2. Do not invent documentation that is not supported by the Knowledge Base.

3. Prefer evidence retrieved from Sanity over general model knowledge.

4. Explain your reasoning clearly and concisely.

5. When possible, identify which documentation or source supports
   the answer.

6. If the Knowledge Base does not contain enough information,
   explicitly say that the available documentation is insufficient.

7. You are investigating documentation, not simply generating a generic
   Angular answer.

Here is the available Sanity Context:

${initialContext}
  `,

            tools,

            stopWhen: stepCountIs(5),

            prompt: message,
        })

        return Response.json({
            answer: result.text,
        })
    } catch (error) {
        console.error('DocTrace error:', error)

        return Response.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred.',
            },
            { status: 500 }
        )
    } finally {
        if (mcpClient) {
            await mcpClient.close()
        }
    }
}