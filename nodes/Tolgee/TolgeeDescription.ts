import { INodeProperties } from 'n8n-workflow';

export const tolgeeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,

		displayOptions: {
			show: {
				resource: ['translations'],
			},
		},
		options: [
			{
				name: 'Create Key',
				value: 'createKey',
				description: 'Create a new key',
				action: 'Create a key',
			},
			{
				name: 'Create Or Update Translation',
				value: 'createOrUpdateTranslation',
				description: 'Create or update a translation',
				action: 'Create or update a translation',
			},
			{
				name: "Get All Translations",
				value: 'getAllTranslations',
				description: 'Get all translations for every language',
				action: 'Get all translations',
				routing: {
					request: {
						method: 'GET',
						url: '=/v2/projects/{{$parameter.projectId}}/translations',
						headers: {
							'Accept': 'application/json',
						},
					},
				},
			},
			{
				name: 'Get Translations',
				value: 'get',
				description: 'Get translations by filter',
				action: 'Get translations by filter',
				routing: {
					request: {
						method: 'GET',
						url: '=/v2/projects/{{$parameter.projectId}}/translations',
						headers: {
							'Accept': 'application/json',
						},
						qs: {
							languages: '={{$parameter.languages.join(",")}}',
							search: '={{$parameter.search}}',
							filterState: '={{$parameter.filterOptions.filterState}}',
							filterKeyName: '={{$parameter.filterOptions.filterKeyName}}',
							filterKeyId: '={{$parameter.filterOptions.filterKeyId}}',
							filterUntranslatedAny: '={{$parameter.filterOptions.filterUntranslatedAny}}',
							filterTranslatedAny: '={{$parameter.filterOptions.filterTranslatedAny}}',
							filterUntranslatedInLang: '={{$parameter.filterOptions.filterUntranslatedInLang}}',
							filterTranslatedInLang: '={{$parameter.filterOptions.filterTranslatedInLang}}',
							filterAutoTranslatedInLang: '={{$parameter.filterOptions.filterAutoTranslatedInLang}}',
							filterHasScreenshot: '={{$parameter.filterOptions.filterHasScreenshot}}',
							filterHasNoScreenshot: '={{$parameter.filterOptions.filterHasNoScreenshot}}',
							filterNamespace: '={{$parameter.filterOptions.filterNamespace}}',
							filterNoNamespace: '={{$parameter.filterOptions.filterNoNamespace}}',
							filterTag: '={{$parameter.filterOptions.filterTag}}',
							filterNoTag: '={{$parameter.filterOptions.filterNoTag}}',
							filterOutdatedLanguage: '={{$parameter.filterOptions.filterOutdatedLanguage}}',
							filterNotOutdatedLanguage: '={{$parameter.filterOptions.filterNotOutdatedLanguage}}',
							page: '={{$parameter.pagination.page}}',
							size: '={{$parameter.pagination.size}}',
							sort: '={{$parameter.pagination.sort}}',
						},
					},
				},
			},
		],
		default: 'get',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,

		displayOptions: {
			show: {
				resource: ['import'],
			},
		},
		options: [
			{
				name: 'Single Step Import From Body',
				value: 'singleStepImportFromBody',
				action: 'Single step import from body',
				routing: {
					request: {
						method: 'POST',
						url: '=/v2/projects/{{$parameter.projectId}}/single-step-import-resolvable',
						body: {
							errorOnUnresolvedConflict: '={{$parameter.errorOnUnresolvedConflict}}',
							keys: '={{$parameter.keys}}',
							overrideMode: '={{$parameter.overrideMode}}',
						},
					},
				},
			},
		],
		default: 'singleStepImportFromBody',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,

		displayOptions: {
			show: {
				resource: ['export'],
			},
		},
		options: [
			{
				name: 'Export Data',
				value: 'exportData',
				description: 'Export project data in various formats. Returns a single JSON file when one language is selected, or a ZIP file containing multiple JSON files when multiple languages are selected.',
				action: 'Export project data',
				routing: {
					request: {
						method: 'POST',
						url: '=/v2/projects/{{$parameter.projectId}}/export',
						body: {
							languages: '={{$parameter.languages}}',
							format: '={{$parameter.format}}',
							structureDelimiter: '={{$parameter.options.structureDelimiter}}',
							filterKeyName: '={{$parameter.options.filterKeyName}}',
							filterKeyId: '={{$parameter.options.filterKeyId}}',
							filterNamespace: '={{$parameter.options.filterNamespace}}',
							filterTag: '={{$parameter.options.filterTag}}',
							filterKeyPrefix: '={{$parameter.options.filterKeyPrefix}}',
							filterKeySuffix: '={{$parameter.options.filterKeySuffix}}',
							filterUntranslatedAny: '={{$parameter.options.filterUntranslatedAny}}',
							filterTranslatedAny: '={{$parameter.options.filterTranslatedAny}}',
							filterUntranslatedInLang: '={{$parameter.options.filterUntranslatedInLang}}',
							filterTranslatedInLang: '={{$parameter.options.filterTranslatedInLang}}',
							filterAutoTranslatedInLang: '={{$parameter.options.filterAutoTranslatedInLang}}',
							filterHasScreenshot: '={{$parameter.options.filterHasScreenshot}}',
							filterHasNoScreenshot: '={{$parameter.options.filterHasNoScreenshot}}',
							filterNoNamespace: '={{$parameter.options.filterNoNamespace}}',
							filterNoTag: '={{$parameter.options.filterNoTag}}',
							filterOutdatedLanguage: '={{$parameter.options.filterOutdatedLanguage}}',
							filterNotOutdatedLanguage: '={{$parameter.options.filterNotOutdatedLanguage}}',
							filterState: '={{$parameter.options.filterState}}',
							zip: '={{$parameter.options.zip}}',
						},
					},
					output: {
						postReceive: [
							{
								type: 'binaryData',
								properties: {
									destinationProperty: 'data',
								},
							},
						],
					},
				},
			},
		],
		default: 'exportData',
	},
];

// Here we define what to show when the `get` operation is selected.
const getOperation: INodeProperties[] = [
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		default: '',
		required: true,
		description: 'The ID of the Tolgee project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['translations'],
				operation: ['get', 'getAllTranslations'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getProjects'
		},
	},
	{
		displayName: 'Language Names or IDs',
		name: 'languages',
		type: 'multiOptions',
		default: [],
		description: 'The ID of a language from the Tolgee project. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['translations'],
				operation: ['get'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getLanguages',
			loadOptionsDependsOn: ['projectId'],
		},
	},
	{
		displayName: 'Search',
		name: 'search',
		type: 'string',
		default: '',
		description: 'String to search in key name or translation text',
		displayOptions: {
			show: {
				resource: ['translations'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Filter Options',
		name: 'filterOptions',
		type: 'collection',
		default: {},
		description: 'Additional filter options for the translation query',
		displayOptions: {
			show: {
				resource: ['translations'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Filter Auto Translated In Language',
				name: 'filterAutoTranslatedInLang',
				type: 'string',
				default: '',
				description: 'Selects only keys, where translation was auto translated for specified languages (comma-separated)',
			},
			{
				displayName: 'Filter Has No Screenshot',
				name: 'filterHasNoScreenshot',
				type: 'boolean',
				default: false,
				description: 'Whether to select only keys without screenshots',
			},
			{
				displayName: 'Filter Has Screenshot',
				name: 'filterHasScreenshot',
				type: 'boolean',
				default: false,
				description: 'Whether to select only keys with screenshots',
			},
			{
				displayName: 'Filter Key IDs',
				name: 'filterKeyId',
				type: 'string',
				default: '',
				description: 'Selects key with provided IDs (comma-separated)',
			},
			{
				displayName: 'Filter Key Names',
				name: 'filterKeyName',
				type: 'string',
				default: '',
				description: 'Selects key with provided names (comma-separated)',
			},
			{
				displayName: 'Filter Namespace',
				name: 'filterNamespace',
				type: 'string',
				default: '',
				description: 'Selects only keys with provided namespaces (comma-separated)',
			},
			{
				displayName: 'Filter No Namespace',
				name: 'filterNoNamespace',
				type: 'string',
				default: '',
				description: 'Selects only keys without provided namespaces (comma-separated)',
			},
			{
				displayName: 'Filter No Tag',
				name: 'filterNoTag',
				type: 'string',
				default: '',
				description: 'Selects only keys without provided tag (comma-separated)',
			},
			{
				displayName: 'Filter Not Outdated Language',
				name: 'filterNotOutdatedLanguage',
				type: 'string',
				default: '',
				description: 'Selects only keys, where translation in provided langs is not in outdated state (comma-separated)',
			},
			{
				displayName: 'Filter Outdated Language',
				name: 'filterOutdatedLanguage',
				type: 'string',
				default: '',
				description: 'Selects only keys, where translation in provided langs is in outdated state (comma-separated)',
			},
			{
				displayName: 'Filter State',
				name: 'filterState',
				type: 'string',
				default: '',
				description: 'Translation state in the format: languageTag,state (e.g., en,TRANSLATED)',
			},
			{
				displayName: 'Filter Tag',
				name: 'filterTag',
				type: 'string',
				default: '',
				description: 'Selects only keys with provided tag (comma-separated)',
			},
			{
				displayName: 'Filter Translated Any',
				name: 'filterTranslatedAny',
				type: 'boolean',
				default: false,
				description: 'Whether to select only keys, where translation is provided in any language',
			},
			{
				displayName: 'Filter Translated In Language',
				name: 'filterTranslatedInLang',
				type: 'string',
				default: '',
				description: 'Selects only keys, where translation is provided in specified language (e.g., en-US)',
			},
			{
				displayName: 'Filter Untranslated Any',
				name: 'filterUntranslatedAny',
				type: 'boolean',
				default: false,
				description: 'Whether to select only keys for which the translation is missing in any returned language',
			},
			{
				displayName: 'Filter Untranslated In Language',
				name: 'filterUntranslatedInLang',
				type: 'string',
				default: '',
				description: 'Selects only keys where the translation is missing for the specified language (e.g., en-US)',
			},
		],
	},
	{
		displayName: 'Filter Options',
		name: 'filterOptions',
		type: 'collection',
		default: {},
		description: 'Additional filter options for the translation query',
		displayOptions: {
			show: {
				resource: ['translations'],
				operation: ['getAllTranslations'],
			},
		},
		options: [
			{
				displayName: 'Filter By Namespace',
				name: 'ns',
				type: 'string',
				default: '',
				description: 'Selects only keys with provided namespace',
			},
			{
				displayName: 'Filter Tags',
				name: 'filterTag',
				type: 'string',
				default: '',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Tag',
				},
				description: 'Enables filtering of returned keys by their tags. Only keys with at least one provided tag will be returned.',
			},
		],
	},
	{
		displayName: 'Pagination',
		name: 'pagination',
		type: 'collection',
		default: {},
		description: 'Pagination options for the query',
		displayOptions: {
			show: {
				resource: ['translations'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 0,
				description: 'Zero-based page index (0..N)',
			},
			{
				displayName: 'Size',
				name: 'size',
				type: 'number',
				default: 20,
				description: 'The size of the page to be returned',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'string',
				default: '',
				description: 'Sorting criteria in the format: property,(asc|desc). Multiple sort criteria supported (comma-separated).',
			},
		],
	},
];

const projectIdField: INodeProperties = {
	displayName: 'Project Name or ID',
	name: 'projectId',
	type: 'options',
	default: '',
	required: true,
	description: 'The ID of the Tolgee project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	typeOptions: {
		loadOptionsMethod: 'getProjects',
		editorIsReadOnly: true,
	},
};

// Here we define what to show when the `create` operation is selected.
const createOperation: INodeProperties[] = [
	{
		displayName: 'Key Name',
		name: 'key',
		type: 'string',
		default: '',
		required: true,
		description: 'The translation key name to create',
		displayOptions: {
			show: {
				resource: ['translations'],
				operation: ['createOrUpdateTranslation', 'createKey'],
			},
		},
	},
	{
		displayName: 'Translations',
		name: 'translations',
		type: 'fixedCollection',
		default: {},
		description: 'The translations for different languages',
		displayOptions: {
			show: {
				resource: ['translations'],
				operation: ['createOrUpdateTranslation', 'createKey'],
			},
		},
		options: [
			{
				name: 'translation',
				displayName: 'Translation',
				values: [
					{
						displayName: 'Language Name or ID',
						name: 'language',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getLanguages',
							loadOptionsDependsOn: ['projectId'],
						},
						default: '',
						required: true,
						description: 'Language code (e.g., en, es, fr). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Text',
						name: 'text',
						type: 'string',
						default: '',
						required: true,
						description: 'The translation text',
					},
				],
			},
		],
		typeOptions: {
			multipleValues: true,
		},
	},
	{
		displayName: "Options",
		name: 'options',
		type: 'collection',
		default: {},
		description: 'Additional options for the translation creation',
		displayOptions: {
			show: {
				resource: ['translations'],
				operation: ['createOrUpdateTranslation', 'createKey'],
			},
		},
		options: [
			{
				displayName: 'Languages To Return Name or ID',
				name: 'languagesToReturn',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getLanguages',
					loadOptionsDependsOn: ['projectId'],
					multipleValues: true,
					editorIsReadOnly: true,
				},
				default: '',
				description: 'The languages to return. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Namespace Name or ID',
				name: 'namespace',
				type: 'options',
				default: '',
				description: 'The namespace to create the translation in. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getNamespaces',
					loadOptionsDependsOn: ['projectId'],
					editorIsReadOnly: true,
				},
			}
		],
	},
];

// Here we define what to show when the `update` operation is selected.
const singleStepImportFromBodyOperation: INodeProperties[] = [
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		default: '',
		required: true,
		description: 'The ID of the Tolgee project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['singleStepImportFromBody'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getProjects'
		},
	},
	{
		displayName: 'Error On Unresolved Conflict',
		name: 'errorOnUnresolvedConflict',
		type: 'boolean',
		default: false,
		required: true,
		description: 'Whether import will apply all non-failed overrides and reports unresolvedConflict .If true, import will fail completely on unresolved conflict and won\'t apply any changes. Unresolved conflicts are reported in the params of the error response.',
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['singleStepImportFromBody'],
			},
		},
	},
	{
		displayName: 'Keys',
		name: 'keys',
		type: 'json',
		default: null,
		required: true,
		description: 'The keys to import. Can be provided as JSON or use expressions to reference data from previous nodes. Expected format: {"keys": [{"name": "key_name", "namespace": "string", "screenshots": [{"positions": [{"height": 0, "width": 0, "x": 0, "y": 0}], "text": "string", "uploadedImageId": number}], "translations": {"langugageCode": {"text": "string", resolution: "EXPECT_NO_CONFLICT" | "OVERRIDE"}}}]}. For more details see https://docs.tolgee.io/api/single-step-resolvable-import.',
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['singleStepImportFromBody'],
			},
		},
	},
	{
		displayName: 'Override Mode',
		name: 'overrideMode',
		type: 'options',
		default: 'RECOMMENDED',
		required: true,
		description: 'The override mode to use. Some translations are forbidden or protected: When set to RECOMMENDED it will fail for DISABLED translations and protected REVIEWED translations. When set to ALL it will fail for DISABLED translations, but will try to update protected REVIEWED translations (fails only if user has no permission)',
		displayOptions: {
			show: {
				resource: ['import'],
				operation: ['singleStepImportFromBody'],
			},
		},
		options: [
			{
				name: 'Recommended',
				value: 'RECOMMENDED',
			},
			{
				name: 'All',
				value: 'ALL',
			},
		],
	},
];

// Here we define what to show when the `delete` operation is selected.
const deleteOperation: INodeProperties[] = [
	{
		displayName: 'Key',
		name: 'key',
		type: 'string',
		default: '',
		required: true,
		description: 'The translation key to delete',
		displayOptions: {
			show: {
				resource: ['translations'],
				operation: ['delete'],
			},
		},
	},
];

// Here we define what to show when the `exportData` operation is selected.
const exportDataOperation: INodeProperties[] = [
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		default: '',
		required: true,
		description: 'The ID of the Tolgee project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['exportData'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getProjects'
		},
	},
	{
		displayName: 'Language Names or IDs',
		name: 'languages',
		type: 'multiOptions',
		default: [],
		required: true,
		description: 'The languages to export. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Note: Selecting one language returns a single JSON file, while selecting multiple languages returns a ZIP file containing separate JSON files for each language. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['exportData'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getLanguages',
			loadOptionsDependsOn: ['projectId'],
		},
	},
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		default: 'JSON',
		required: true,
		description: 'The export format',
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['exportData'],
			},
		},
		options: [
			{
				name: 'ANDROID',
				value: 'ANDROID',
			},
			{
				name: 'APPLE',
				value: 'APPLE',
			},
			{
				name: 'FLUTTER',
				value: 'FLUTTER',
			},
			{
				name: 'JSON',
				value: 'JSON',
			},
			{
				name: 'PO',
				value: 'PO',
			},
			{
				name: 'PROPERTIES',
				value: 'PROPERTIES',
			},
			{
				name: 'XLIFF',
				value: 'XLIFF',
			},
			{
				name: 'YAML',
				value: 'YAML',
			},
			{
				name: 'YAML_FLAT',
				value: 'YAML_FLAT',
			},
			{
				name: 'YAML_NESTED',
				value: 'YAML_NESTED',
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		default: {},
		description: 'Additional export options',
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['exportData'],
			},
		},
		options: [
			{
				displayName: 'Filter Auto Translated In Language',
				name: 'filterAutoTranslatedInLang',
				type: 'string',
				default: '',
				description: 'Filter auto-translated keys in specific language (comma-separated)',
			},
			{
				displayName: 'Filter Has No Screenshot',
				name: 'filterHasNoScreenshot',
				type: 'boolean',
				default: false,
				description: 'Whether to filter keys that have no screenshots',
			},
			{
				displayName: 'Filter Has Screenshot',
				name: 'filterHasScreenshot',
				type: 'boolean',
				default: false,
				description: 'Whether to filter keys that have screenshots',
			},
			{
				displayName: 'Filter Key ID',
				name: 'filterKeyId',
				type: 'string',
				default: '',
				description: 'Filter by key IDs (comma-separated)',
			},
			{
				displayName: 'Filter Key Name',
				name: 'filterKeyName',
				type: 'string',
				default: '',
				description: 'Filter by key names (comma-separated)',
			},
			{
				displayName: 'Filter Key Prefix',
				name: 'filterKeyPrefix',
				type: 'string',
				default: '',
				description: 'Filter by key prefix',
			},
			{
				displayName: 'Filter Key Suffix',
				name: 'filterKeySuffix',
				type: 'string',
				default: '',
				description: 'Filter by key suffix',
			},
			{
				displayName: 'Filter Namespace',
				name: 'filterNamespace',
				type: 'string',
				default: '',
				description: 'Filter by namespace (comma-separated)',
			},
			{
				displayName: 'Filter No Namespace',
				name: 'filterNoNamespace',
				type: 'string',
				default: '',
				description: 'Filter keys without specific namespace (comma-separated)',
			},
			{
				displayName: 'Filter No Tag',
				name: 'filterNoTag',
				type: 'string',
				default: '',
				description: 'Filter keys without specific tags (comma-separated)',
			},
			{
				displayName: 'Filter Not Outdated Language',
				name: 'filterNotOutdatedLanguage',
				type: 'string',
				default: '',
				description: 'Filter keys with non-outdated translations in specific language (comma-separated)',
			},
			{
				displayName: 'Filter Outdated Language',
				name: 'filterOutdatedLanguage',
				type: 'string',
				default: '',
				description: 'Filter keys with outdated translations in specific language (comma-separated)',
			},
			{
				displayName: 'Filter State',
				name: 'filterState',
				type: 'string',
				default: '',
				description: 'Filter by translation state in format: languageTag,state (e.g., en,TRANSLATED)',
			},
			{
				displayName: 'Filter Tag',
				name: 'filterTag',
				type: 'string',
				default: '',
				description: 'Filter by tags (comma-separated)',
			},
			{
				displayName: 'Filter Translated Any',
				name: 'filterTranslatedAny',
				type: 'boolean',
				default: false,
				description: 'Whether to filter keys that are translated in any language',
			},
			{
				displayName: 'Filter Translated In Language',
				name: 'filterTranslatedInLang',
				type: 'string',
				default: '',
				description: 'Filter keys translated in specific language (comma-separated)',
			},
			{
				displayName: 'Filter Untranslated Any',
				name: 'filterUntranslatedAny',
				type: 'boolean',
				default: false,
				description: 'Whether to filter keys that are untranslated in any language',
			},
			{
				displayName: 'Filter Untranslated In Language',
				name: 'filterUntranslatedInLang',
				type: 'string',
				default: '',
				description: 'Filter keys untranslated in specific language (comma-separated)',
			},
			{
				displayName: 'Structure Delimiter',
				name: 'structureDelimiter',
				type: 'string',
				default: '.',
				description: 'Delimiter for nested structure in export format',
			},
			{
				displayName: 'Support Arrays',
				name: 'supportArrays',
				type: 'boolean',
				default: false,
				description: 'Whether to return the export as a ZIP file',
			},
			{
				displayName: 'Zip',
				name: 'zip',
				type: 'boolean',
				default: false,
				description: 'Whether to return the export as a ZIP file',
			},
		],
	},
];

export const tolgeeFields: INodeProperties[] = [
	projectIdField,
	/* -------------------------------------------------------------------------- */
	/*                                translation:get                             */
	/* -------------------------------------------------------------------------- */
	...getOperation,

	/* -------------------------------------------------------------------------- */
	/*                              translation:create                            */
	/* -------------------------------------------------------------------------- */
	...createOperation,

	/* -------------------------------------------------------------------------- */
	/*                              singleStepImportFromBody                            */
	/* -------------------------------------------------------------------------- */
	...singleStepImportFromBodyOperation,

	/* -------------------------------------------------------------------------- */
	/*                              translation:delete                            */
	/* -------------------------------------------------------------------------- */
	...deleteOperation,

	/* -------------------------------------------------------------------------- */
	/*                              export:exportData                            */
	/* -------------------------------------------------------------------------- */
	...exportDataOperation,
];