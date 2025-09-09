import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TolgeeApi implements ICredentialType {
	name = 'tolgeeApi';
	displayName = 'Tolgee API';
	icon?: Icon = {
		light: 'file:tolgee.svg',
		dark: 'file:tolgee.svg',
	};
	documentationUrl = 'https://docs.tolgee.io/api';
	properties: INodeProperties[] = [
		{
			displayName: 'Tolgee Project API Key',
			name: 'token',
			type: 'string',
			description: "Project API key, with at least the required scopes [PROJECTS_VIEW, TRANSLATIONS_VIEW, TRANSLATIONS_EDIT, KEYS_VIEW, KEYS_EDIT, ACTIVITY_VIEW]",
			default: '',
			validateType: "string-alphanumeric",
			required: true,
			typeOptions: {
				password: true,
			}
		},
		{
			displayName: 'Tolgee Domain',
			name: 'domain',
			type: 'string',
			required: true,
			validateType: "url",
			default: 'https://app.tolgee.io',
			description: 'Your Tolgee instance URL (e.g., https://app.tolgee.io for cloud or your self-hosted instance)',
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				"X-API-Key": '={{$credentials.token}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	// This test validates that the API key has the required scopes for our nodes
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.domain}}',
			url: '/v2/api-keys/current',
			method: 'GET',
			headers: {
				'X-API-Key': '={{$credentials.token}}',
				'Accept': 'application/json',
			},
		},
	};
}
