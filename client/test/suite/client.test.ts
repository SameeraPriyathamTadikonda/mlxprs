import * as assert from 'assert'
import { after } from 'mocha'

import { window, workspace } from 'vscode'
import { defaultDummyGlobalState } from './dummyGlobalState'
import { testOverrideQueryWithGoodJSON, testOverrideQueryWithBadJSON, testOverrideXQueryWithGoodJSON } from './testOverrideQuery'
import { getDbClient, MarklogicVSClient, parseQueryForOverrides } from '../../marklogicClient'

const SJS = 'sjs'
const XQY = 'xqy'

suite('Extension Test Suite', () => {
    after(() => {
        window.showInformationMessage('All tests done!')
    })

    test('getDbClient should cache its settings in the state passed to it', () => {
        const config = workspace.getConfiguration()
        const gstate = defaultDummyGlobalState()
        const newHost: string = Math.random().toString(36)

        // get the client and differentiate it from the one in gstate by host
        let mlClient1: MarklogicVSClient = getDbClient('', SJS, config, gstate)
        mlClient1.params.host = newHost

        // get a second client, should not be the same or deepequal to first
        const mlClient2: MarklogicVSClient = getDbClient('', SJS, config, gstate)
        assert.notEqual(mlClient1, mlClient2)
        assert.notDeepStrictEqual(mlClient1, mlClient2)

        // getting mlClient1 from getDbClient should overwrite with the exact
        // same instance as mlClient2
        mlClient1 = getDbClient('', SJS, config, gstate)
        assert.equal(mlClient1, mlClient2)
        assert.notEqual(mlClient1.params.host, newHost)
    })

    test('override parser should recognize config overrides', () => {
        const queryText: string = testOverrideQueryWithGoodJSON()
        const overrides = parseQueryForOverrides(queryText, SJS)
        assert.equal(overrides.host, 'overrideHost')
        assert.equal(overrides.port, 12345)
    })

    test('override parser should recognize XQuery config overrides', () => {
        const queryText: string = testOverrideXQueryWithGoodJSON()
        const overrides = parseQueryForOverrides(queryText, XQY)
        assert.equal(overrides.host, 'overrideHost')
        assert.equal(overrides.port, 12345)
    })

    test('overrides should not touch parameters they do not specify', () => {
        const config = workspace.getConfiguration()
        const cfgPwd = config.get('marklogic.password')
        const cfgPca = config.get('marklogic.pathToCa')
        const queryText: string = testOverrideQueryWithGoodJSON()
        const overrides = parseQueryForOverrides(queryText, SJS)
        const gstate = defaultDummyGlobalState()
        const mlClient1: MarklogicVSClient = getDbClient(queryText, SJS, config, gstate)

        assert.equal(overrides.host, mlClient1.params.host)
        assert.equal(mlClient1.params.pwd, cfgPwd)
        assert.equal(mlClient1.params.pathToCa, cfgPca)
    })

    test('override parser should throw if settings are invalid JSON', () => {
        const badQueryText: string = testOverrideQueryWithBadJSON()
        assert.throws(() => {
            parseQueryForOverrides(badQueryText, SJS)
        })
    })

    test('Sample test', () => {
        assert.equal(-1, [1, 2, 3].indexOf(5))
        assert.equal(-1, [1, 2, 3].indexOf(0))
    })
})
