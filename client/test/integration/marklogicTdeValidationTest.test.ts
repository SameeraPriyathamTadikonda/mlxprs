/*
 * Copyright (c) 2023 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as assert from 'assert';
import * as fs from 'fs';
import * as Path from 'path';

import { MarkLogicTdeValidateClient } from '../../marklogicTdeValidateClient';
import { IntegrationTestHelper } from './markLogicIntegrationTestHelper';

suite('Testing TDE Validation functionality', async () => {
    const integrationTestHelper: IntegrationTestHelper = globalThis.integrationTestHelper;
    const mlClient = integrationTestHelper.mlClient;
    const markLogicTdeValidateClient = new MarkLogicTdeValidateClient(null);

    test('When a valid JSON TDE is validated', async () => {
        const validationResult = await validateFile('test-app/src/main/ml-schemas/authors-TDE.tdej');
        assert.equal(validationResult['valid'], true, 'Then the validation result should true');
    }).timeout(5000);

    test('When a valid XML TDE is validated', async () => {
        const validationResult = await validateFile('test-app/src/main/ml-schemas/someXml-TDE.tde');
        assert.equal(validationResult['valid'], true, 'Then the validation result should true');
    }).timeout(5000);

    test('When an invalid JSON TDE is validated', async () => {
        const validationResult = await validateFile('test-app/src/main/ml-bad-schemas/invalid-authors-TDE.tdej');
        assert.equal(validationResult['valid'], false, 'Then the validation result should false');
        assert.equal(validationResult['error'], 'TDE-INVALIDTEMPLATENODE', 'Then the validation error should match the expected error');
    }).timeout(5000);

    test('When an invalid XML TDE is validated', async () => {
        const validationResult = await validateFile('test-app/src/main/ml-bad-schemas/invalid-someXml-TDE.tde');
        assert.equal(validationResult['valid'], false, 'Then the validation result should false');
        assert.equal(validationResult['error'], 'TDE-INVALIDTEMPLATENODE', 'Then the validation error should match the expected error');
    }).timeout(5000);

    test('When an unparsable JSON TDE is validated', async () => {
        const validationResult = await validateFile('test-app/src/main/ml-bad-schemas/invalid-json-TDE.tdej');
        assert.equal(validationResult, 'To be validated, the template must be either valid JSON or XML.',
            'Then the validation result should be an error message');
    }).timeout(5000);

    test('When an unparsable XML TDE is validated', async () => {
        const validationResult = await validateFile('test-app/src/main/ml-bad-schemas/invalid-xml-TDE.tde');
        assert.equal(validationResult, 'Unable to validate the template: XDMP-UNEXPECTED: (err:XPST0003) Unexpected token syntax error, unexpected $end, expecting EndTagOpen_',
            'Then the validation result should be an error message');
    }).timeout(5000);

    async function validateFile(jsonTdeRelativeFilePath: string) {
        const jsonTdeFilePath = Path.join(integrationTestHelper.rootFolder, jsonTdeRelativeFilePath);
        const module = fs.readFileSync(jsonTdeFilePath);
        return await markLogicTdeValidateClient.validateTdeTemplate(mlClient, module.toString('utf8'));
    }
});
