import { INodeType, INodeTypeDescription, NodeConnectionType, ILoadOptionsFunctions, INodePropertyOptions, NodeApiError, IExecuteFunctions, INodeExecutionData, } from 'n8n-workflow';
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'translations') {
					if (operation === 'createKey' || operation === 'createOrUpdateTranslation') {
						const projectId = this.getNodeParameter('projectId', i) as number;
						const key = this.getNodeParameter('key', i) as string;
						const translations = this.getNodeParameter('translations.translation', i, []) as Array<{
							language: string;
							text: string;
						}>;
						const options = this.getNodeParameter('options', i, {}) as any;

						// Build translations object - this will properly evaluate expressions in item.text
						const translationsObj: Record<string, string> = {};
						for (const translation of translations) {
							translationsObj[translation.language] = translation.text;
						}

						// Build request body
						const body: any = {
							name: key,
							translations: translationsObj,
						};

						if (operation === 'createOrUpdateTranslation') {
							body.key = key;
						}

						if (options.languagesToReturn && Array.isArray(options.languagesToReturn)) {
							body.languagesToReturn = options.languagesToReturn.map((item: any) => item.value);
						}

						if (options.namespace) {
							body.namespace = options.namespace;
						}

						// Get credentials
						const credentials = await this.getCredentials('tolgeeApi');
						const baseURL = credentials?.domain as string;

						// Make the request
						const url = operation === 'createKey'
							? `${baseURL}/v2/projects/${projectId}/keys`
							: `${baseURL}/v2/projects/${projectId}/translations`;

						// Debug logging
						this.logger.info('=== TOLGEE DEBUG ===');
						this.logger.info('URL: ' + url);
						this.logger.info('Headers: ' + JSON.stringify({
							'X-API-Key': credentials?.token.toString().substring(0, 8) + '...',
							'Accept': '*/*',
							'Content-Type': 'application/json',
						}));
						this.logger.info('Body: ' + JSON.stringify(body, null, 2));
						this.logger.info('==================');

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url,
							headers: {
								'X-API-Key': credentials?.token,
								'Accept': '*/*',
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(body),
						});

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
				} else {
					throw new NodeApiError(this.getNode(), error);
				}
			}
		}

		return [returnData];
	}
}