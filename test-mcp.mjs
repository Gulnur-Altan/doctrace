const url = process.env.SANITY_CONTEXT_MCP_URL
const token = process.env.SANITY_ORGANIZATION_TOKEN

if (!url || !token) {
  throw new Error('Missing SANITY_CONTEXT_MCP_URL or SANITY_ORGANIZATION_TOKEN')
}

const response = await fetch(`${url}/initial-context`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

console.log('Status:', response.status)

const text = await response.text()

console.log(text)