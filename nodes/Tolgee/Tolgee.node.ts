import { INodeType, INodeTypeDescription, NodeConnectionType, ILoadOptionsFunctions, INodePropertyOptions, NodeApiError, } from 'n8n-workflow';
import { tolgeeFields, tolgeeOperations } from './TolgeeDescription';

function apiKeyIsProjectApiKey(apiKey: string): boolean {
	return apiKey.startsWith('tgpak_');
}

export class Tolgee implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tolgee',
		name: 'tolgee',
		icon: { light: 'file:tolgee.svg', dark: 'file:tolgee.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Tolgee API for translation management',
		defaults: {
			name: 'Tolgee',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'tolgeeApi',
				required: true,
				testedBy: 'testCredential',
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.domain}}',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Translation',
						value: 'translations',
					},
					{
						name: 'Import',
						value: 'import',
					},
					{
						name: 'Export',
						value: 'export',
					}
				],
				default: 'translations',
			},

			...tolgeeOperations,
			...tolgeeFields,
		],
	};

	methods = {
		loadOptions: {
			getLanguages: async function (this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const projectId = this.getNodeParameter('projectId', 0) as number;

				if (!projectId) {
					return [];
				}

				const credentials = await this.getCredentials('tolgeeApi');
				const baseURL = credentials?.domain as string;

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseURL}/v2/projects/${projectId}/languages`,
						headers: {
							'X-API-Key': credentials?.token,
							'Accept': 'application/json',
						},
					});

					const parsedResponse = response;


					if ("_embedded" in parsedResponse && "languages" in parsedResponse._embedded && Array.isArray(parsedResponse._embedded.languages)) {
						return parsedResponse._embedded.languages.map((language: any) => ({
							name: `${language.name} (${language.tag})`,
							value: language.tag,
						}));
					}

					return [];
				} catch (error) {
					throw new NodeApiError(this.getNode(), { message: `Failed to load languages: ${error.message}` });
				}
			},
			getProjects: async function (this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('tolgeeApi');
				const baseURL = credentials?.domain as string;
				const apiKey = credentials?.token as string;
				const isProjectApiKey = apiKeyIsProjectApiKey(apiKey);

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseURL}/v2/api-keys/current`,
						headers: {
							'X-API-Key': isProjectApiKey ? apiKey : credentials?.token,
							'Accept': 'application/json',
						},
					});

					const parsedResponse = response;

					return [{
						name: `${parsedResponse.projectName} (${parsedResponse.projectId})`,
						value: parsedResponse.projectId,
					}];
				} catch (error) {
					throw new NodeApiError(this.getNode(), { message: `Failed to load languages: ${error.message}` });
				}
			},
			getNamespaces: async function (this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const projectId = this.getNodeParameter('projectId', 0) as number;

				if (!projectId) {
					return [];
				}

				const credentials = await this.getCredentials('tolgeeApi');
				const baseURL = credentials?.domain as string;

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseURL}/v2/projects/${projectId}/namespaces`,
						headers: {
							'X-API-Key': credentials?.token,
							'Accept': 'application/json',
						},
					});

					const parsedResponse = response;

					return parsedResponse._embedded.namespaces.map((namespace: any) => ({
						name: `${namespace.name} (${namespace.id})`,
						value: namespace.id,
					}));
				} catch (error) {
					throw new NodeApiError(this.getNode(), { message: `Failed to load namespaces: ${error.message}` });
				}
			}
		}
	}
}