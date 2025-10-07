import {
  IPollFunctions,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  INodeExecutionData,
  NodeApiError,
  IDataObject,
  JsonObject,
} from 'n8n-workflow';


export class TolgeeTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Tolgee Trigger',
    name: 'tolgeeTrigger',
    icon: { light: 'file:tolgee.svg', dark: 'file:tolgee.svg' },
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["eventTypes"].join(", ")}}',
    description: 'Triggers when activity occurs in Tolgee project',
    defaults: {
      name: 'Tolgee Trigger',
    },
    polling: true,
    inputs: [],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'tolgeeApi',
        displayName: 'Tolgee API',
        required: true,
        testedBy: 'testCredential',
      },
    ],
    requestDefaults: {
      baseURL: '={{$credentials.domain}}',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Project Name or ID',
        name: 'projectId',
        type: 'options',
        default: '',
        required: true,
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: {
          loadOptionsMethod: 'getProjects',
        },
      },
      {
        displayName: 'Event Types',
        name: 'eventTypes',
        type: 'multiOptions',
        default: [],
        description: 'Select which activity types to listen for',
        options: [
          {
            name: 'Auto Translate',
            value: 'AUTO_TRANSLATE',
          },
          {
            name: 'Auto Translation Dismissed',
            value: 'DISMISS_AUTO_TRANSLATED_STATE',
          },
          {
            name: 'Automation',
            value: 'AUTOMATION',
          },
          {
            name: 'Batch Assign Translation Label',
            value: 'BATCH_ASSIGN_TRANSLATION_LABEL',
          },
          {
            name: 'Batch Clear Translations',
            value: 'BATCH_CLEAR_TRANSLATIONS',
          },
          {
            name: 'Batch Copy Translations',
            value: 'BATCH_COPY_TRANSLATIONS',
          },
          {
            name: 'Batch Machine Translate',
            value: 'BATCH_MACHINE_TRANSLATE',
          },
          {
            name: 'Batch Pre-Translate By TM',
            value: 'BATCH_PRE_TRANSLATE_BY_TM',
          },
          {
            name: 'Batch Set Keys Namespace',
            value: 'BATCH_SET_KEYS_NAMESPACE',
          },
          {
            name: 'Batch Set Translation State',
            value: 'BATCH_SET_TRANSLATION_STATE',
          },
          {
            name: 'Batch Tag Keys',
            value: 'BATCH_TAG_KEYS',
          },
          {
            name: 'Batch Unassign Translation Label',
            value: 'BATCH_UNASSIGN_TRANSLATION_LABEL',
          },
          {
            name: 'Batch Untag Keys',
            value: 'BATCH_UNTAG_KEYS',
          },
          {
            name: 'Complex Edit',
            value: 'COMPLEX_EDIT',
          },
          {
            name: 'Complex Tag Operation',
            value: 'COMPLEX_TAG_OPERATION',
          },
          {
            name: 'Content Delivery Config Created',
            value: 'CONTENT_DELIVERY_CONFIG_CREATE',
          },
          {
            name: 'Content Delivery Config Deleted',
            value: 'CONTENT_DELIVERY_CONFIG_DELETE',
          },
          {
            name: 'Content Delivery Config Updated',
            value: 'CONTENT_DELIVERY_CONFIG_UPDATE',
          },
          {
            name: 'Content Storage Created',
            value: 'CONTENT_STORAGE_CREATE',
          },
          {
            name: 'Content Storage Deleted',
            value: 'CONTENT_STORAGE_DELETE',
          },
          {
            name: 'Content Storage Updated',
            value: 'CONTENT_STORAGE_UPDATE',
          },
          {
            name: 'Glossary Created',
            value: 'GLOSSARY_CREATE',
          },
          {
            name: 'Glossary Deleted',
            value: 'GLOSSARY_DELETE',
          },
          {
            name: 'Glossary Term Created',
            value: 'GLOSSARY_TERM_CREATE',
          },
          {
            name: 'Glossary Term Deleted',
            value: 'GLOSSARY_TERM_DELETE',
          },
          {
            name: 'Glossary Term Translation Updated',
            value: 'GLOSSARY_TERM_TRANSLATION_UPDATE',
          },
          {
            name: 'Glossary Term Updated',
            value: 'GLOSSARY_TERM_UPDATE',
          },
          {
            name: 'Glossary Updated',
            value: 'GLOSSARY_UPDATE',
          },
          {
            name: 'Import',
            value: 'IMPORT',
          },
          {
            name: 'Key Created',
            value: 'CREATE_KEY',
          },
          {
            name: 'Key Deleted',
            value: 'KEY_DELETE',
          },
          {
            name: 'Key Name Edited',
            value: 'KEY_NAME_EDIT',
          },
          {
            name: 'Key Tags Edited',
            value: 'KEY_TAGS_EDIT',
          },
          {
            name: 'Language Created',
            value: 'CREATE_LANGUAGE',
          },
          {
            name: 'Language Deleted',
            value: 'DELETE_LANGUAGE',
          },
          {
            name: 'Language Edited',
            value: 'EDIT_LANGUAGE',
          },
          {
            name: 'Language Hard Deleted',
            value: 'HARD_DELETE_LANGUAGE',
          },
          {
            name: 'Namespace Edited',
            value: 'NAMESPACE_EDIT',
          },
          {
            name: 'Order Translation',
            value: 'ORDER_TRANSLATION',
          },
          {
            name: 'Outdated Flag Set',
            value: 'SET_OUTDATED_FLAG',
          },
          {
            name: 'Project Created',
            value: 'CREATE_PROJECT',
          },
          {
            name: 'Project Edited',
            value: 'EDIT_PROJECT',
          },
          {
            name: 'Screenshot Added',
            value: 'SCREENSHOT_ADD',
          },
          {
            name: 'Screenshot Deleted',
            value: 'SCREENSHOT_DELETE',
          },
          {
            name: 'Suggestion Accepted',
            value: 'ACCEPT_SUGGESTION',
          },
          {
            name: 'Suggestion Created',
            value: 'CREATE_SUGGESTION',
          },
          {
            name: 'Suggestion Declined',
            value: 'DECLINE_SUGGESTION',
          },
          {
            name: 'Suggestion Deleted',
            value: 'DELETE_SUGGESTION',
          },
          {
            name: 'Suggestion Reversed',
            value: 'REVERSE_SUGGESTION',
          },
          {
            name: 'Suggestion Set Active',
            value: 'SUGGESTION_SET_ACTIVE',
          },
          {
            name: 'Task Closed',
            value: 'TASK_CLOSE',
          },
          {
            name: 'Task Created',
            value: 'TASK_CREATE',
          },
          {
            name: 'Task Finished',
            value: 'TASK_FINISH',
          },
          {
            name: 'Task Key Updated',
            value: 'TASK_KEY_UPDATE',
          },
          {
            name: 'Task Keys Updated',
            value: 'TASK_KEYS_UPDATE',
          },
          {
            name: 'Task Reopened',
            value: 'TASK_REOPEN',
          },
          {
            name: 'Task Updated',
            value: 'TASK_UPDATE',
          },
          {
            name: 'Tasks Created',
            value: 'TASKS_CREATE',
          },
          {
            name: 'Translation Comment Added',
            value: 'TRANSLATION_COMMENT_ADD',
          },
          {
            name: 'Translation Comment Deleted',
            value: 'TRANSLATION_COMMENT_DELETE',
          },
          {
            name: 'Translation Comment Edited',
            value: 'TRANSLATION_COMMENT_EDIT',
          },
          {
            name: 'Translation Comment State Changed',
            value: 'TRANSLATION_COMMENT_SET_STATE',
          },
          {
            name: 'Translation Label Assigned',
            value: 'TRANSLATION_LABEL_ASSIGN',
          },
          {
            name: 'Translation Label Created',
            value: 'TRANSLATION_LABEL_CREATE',
          },
          {
            name: 'Translation Label Deleted',
            value: 'TRANSLATION_LABEL_DELETE',
          },
          {
            name: 'Translation Label Updated',
            value: 'TRANSLATION_LABEL_UPDATE',
          },
          {
            name: 'Translation Labels Edited',
            value: 'TRANSLATION_LABELS_EDIT',
          },
          {
            name: 'Translation State Changes',
            value: 'SET_TRANSLATION_STATE',
          },
          {
            name: 'Translation Updates',
            value: 'SET_TRANSLATIONS',
          },
          {
            name: 'Unknown',
            value: 'UNKNOWN',
          },
          {
            name: 'Webhook Config Created',
            value: 'WEBHOOK_CONFIG_CREATE',
          },
          {
            name: 'Webhook Config Deleted',
            value: 'WEBHOOK_CONFIG_DELETE',
          },
          {
            name: 'Webhook Config Updated',
            value: 'WEBHOOK_CONFIG_UPDATE',
          },
        ],
      },
    ],
  };

  methods = {
    loadOptions: {
      getProjects: async function (this: any): Promise<any[]> {
        const credentials = await this.getCredentials('tolgeeApi');
        const baseURL = credentials?.domain as string;

        try {
          const response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseURL}/v2/api-keys/current`,
            headers: {
              'X-API-Key': credentials?.token,
              'Accept': 'application/json',
            },
          });

          const parsedResponse = response;

          return [{
            name: `${parsedResponse.projectName} (${parsedResponse.projectId})`,
            value: parsedResponse.projectId,
          }];
        } catch (error) {
          throw new NodeApiError(this.getNode(), { message: `Failed to load projects: ${error.message}` });
        }
      },
      testCredential: async function (this: any): Promise<any> {
        const credentials = await this.getCredentials('tolgeeApi');
        const baseURL = credentials?.domain as string;
        const apiKey = credentials?.token as string;
        const isProjectApiKey = apiKey.startsWith('tgpak_');

        try {

          // Test basic API key validity
          const response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseURL}/v2/api-keys/current`,
            headers: {
              'X-API-Key': isProjectApiKey ? apiKey : credentials?.token,
              'Accept': 'application/json',
            },
          });

          const apiKeyInfo = response;

          // Define required scopes for our nodes
          const requiredScopes = [
            'PROJECTS_VIEW', // For accessing project information
            'TRANSLATIONS_VIEW', // For reading translations
            'TRANSLATIONS_EDIT', // For creating/updating translations
            'KEYS_VIEW', // For reading keys
            'KEYS_EDIT', // For creating/updating keys
            'ACTIVITY_VIEW', // For accessing activity feed (trigger node)
          ];

          // Check if API key has required scopes
          const apiKeyScopes = apiKeyInfo.scopes || [];
          const missingScopes = requiredScopes.filter(scope => !apiKeyScopes.includes(scope));

          if (missingScopes.length > 0) {
            return {
              status: 'Error',
              message: `API key is missing required scopes: ${missingScopes.join(', ')}. Please ensure your API key has the following scopes: ${requiredScopes.join(', ')}`,
            };
          }

          return {
            status: 'OK',
            message: `API key is valid and has all required scopes. Project: ${apiKeyInfo.projectName || 'Unknown'}`,
          };

        } catch (error) {
          return {
            status: 'Error',
            message: `Failed to validate API key: ${error.message}`,
          };
        }
      }
    }
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    const webhookData = this.getWorkflowStaticData('node');
    const projectId = this.getNodeParameter('projectId') as string;
    const eventTypes = this.getNodeParameter('eventTypes') as string[];

    const qs: IDataObject = {};
    let activities = [];

    // Use timestamp-based filtering
    qs.size = 10;
    qs.sort = 'timestamp,desc';

    // If we have a last timestamp, we could potentially use it for filtering
    // but for now, let's get recent activities and filter them
    const lastTimestamp = webhookData.lastTimestamp as number || 0;

    try {
      const credentials = await this.getCredentials('tolgeeApi');
      const baseURL = credentials?.domain as string;

      // Fetch activities from Tolgee API
      const response = await this.helpers.httpRequest({
        method: 'GET',
        url: `${baseURL}/v2/projects/${projectId}/activity`,
        headers: {
          'X-API-Key': credentials?.token,
          'Accept': 'application/json',
        },
        qs,
      });

      const parsedResponse = response;
      activities = parsedResponse._embedded?.activities || [];

      // Filter activities that occurred after the last timestamp
      const newActivities = activities.filter((activity: any) => {
        return activity.timestamp > lastTimestamp;
      });

      // Filter activities by event types if specified
      const filteredActivities = eventTypes.length > 0
        ? newActivities.filter((activity: any) => eventTypes.includes(activity.type))
        : newActivities;

      // Update the last timestamp to the most recent activity
      if (newActivities.length > 0) {
        const latestTimestamp = Math.max(...newActivities.map((activity: any) => activity.timestamp));
        webhookData.lastTimestamp = latestTimestamp;
      }

      // Return the filtered activities if any
      if (filteredActivities.length > 0) {
        return [this.helpers.returnJsonArray(filteredActivities)];
      }

      return null;
    } catch (error) {
      throw new NodeApiError(this.getNode(), error as JsonObject);
    }
  }
}
