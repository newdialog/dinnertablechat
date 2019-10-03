import Ajv from 'ajv';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
// import SimpleSchema from'uniforms-bridge-simple-schema-2';

const ajv = new Ajv({ allErrors: true, useDefaults: true });
const schema = {
    title: 'Guest',
    type: 'object',
    definitions: {
        question: {
            type: 'object',
            properties: {
                question: { type: 'string', minimum: 2 },
                answer: { type: 'string', minimum: 2, value: 'Yes, No', disabled: true }
            },
            required: ['question', 'answer']
        },
    },
    properties: {
        conf: { type: 'string', min: 3, label: 'Debate ID' },
        maxGroups: {
            description: 'maximum number of groups',
            type: 'integer',
            minimum: 1,
            maximum: 200,
            // defaultValue: 20
        },
        minGroupUserPairs: {
            description: 'Minimum pairs of users per group',
            type: 'integer',
            minimum: 1,
            maximum: 100,
            // defaultValue: 1
        },
        curl: { type: 'string', label: 'custom short url (optional)' },

        questions: {
            type: 'array', items: {
                $ref: '#/definitions/question'
            },
            // minCount: 1, 
            // defaultValue: [{question:'', answer: ''}]
        },
    },
    required: [
        'conf',
        'maxGroups',
        'minGroupUserPairs'
    ]
};
function createValidator(schema) {
    const validator = ajv.compile(schema);
    return model => {
        validator(model);
        if (validator.errors && validator.errors.length) {
            throw { details: validator.errors };
        }
    };
}
const schemaValidator = createValidator(schema);
export default new JSONSchemaBridge(schema, schemaValidator);

const fields = [
    { name: 'conf', label: 'Provide a short ID for this session', type: 'input', short: true },
    { name: 'maxGroups', label: 'Max number of groups', type: 'input' },
    { name: 'minGroupUserPairs', label: 'Minimum pairs per group', type: 'input' },
    { name: 'curl', label: 'short url (optional)', type: 'input' },
    { name: 'questions', type: 'array' }
];