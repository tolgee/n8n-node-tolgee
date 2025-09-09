# n8n-nodes-tolgee

This is an n8n community node. It lets you use Tolgee in your n8n workflows.

Tolgee is an open-source translation management platform that helps you manage translations for your applications with features like in-context editing, automatic translation, and collaborative translation workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Translation Operations

- **Create Translation** - Create a new translation key with translations for multiple languages
- **Get All Translations** - Retrieve all translations for every language in the project
- **Get Translations** - Get translations by filter with advanced filtering options

### Import Operations

- **Single Step Import From Body** - Import translations directly from request body

### Export Operations

- **Export Translations** - Export translations in various formats (JSON, XLIFF, etc.)

## Credentials

To use this node, you need to authenticate with Tolgee. You can use either:

1. **Tolgee Cloud** (https://app.tolgee.io) - Sign up for a free account
2. **Self-hosted Tolgee instance** - Deploy your own Tolgee instance

### Setup Instructions

1. **Get your API Key:**
   - For Tolgee Cloud: Go to your project settings and generate a Project API Key
   - For self-hosted: Navigate to your project settings and create an API key

2. **Required Scopes:**
   Your API key needs at least these scopes:
   - `PROJECTS_VIEW`
   - `TRANSLATIONS_VIEW`
   - `TRANSLATIONS_EDIT`
   - `KEYS_VIEW`
   - `KEYS_EDIT`
   - `ACTIVITY_VIEW`

3. **Configure in n8n:**
   - Add the Tolgee API credential
   - Enter your Project API Key
   - Set your Tolgee domain (e.g., `https://app.tolgee.io` for cloud or your self-hosted URL)

## Compatibility

- **Minimum n8n version:** 1.0.0
- **Node.js version:** >=20.15
- **Tested with:** n8n 1.0+

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Tolgee API Documentation](https://docs.tolgee.io/api)
- [Tolgee Platform](https://tolgee.io)
- [Tolgee GitHub Repository](https://github.com/tolgee/tolgee)
