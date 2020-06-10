'use strict'

import * as ml from 'marklogic'
import * as fs from 'fs'

export const MLDBCLIENT = 'mldbClient'
export const MLSETTINGSFLAG = /mlxprs:settings/
const SJS = 'sjs'
export const XQY = 'xqy'

export class MlClientParameters {
    contentDb: string;
    modulesDb: string;

    host: string;
    port: number;
    user: string;
    pwd: string;
    authType: string;
    ssl: boolean;
    pathToCa: string;

    /**
     * note: defaults not applied here. Properties can remain undefined so that
     *       per-query overrides don't clobber the existing config with default values.
     *       (using the spread operator in `getDbClient`)
     **/
    constructor(rawParams: Record<string, any>) {
        this.host = rawParams.host
        this.port = Number(rawParams.port)
        this.user = rawParams.user
        this.pwd = rawParams.pwd
        this.contentDb = rawParams.contentDb || rawParams.documentsDb
        this.modulesDb = rawParams.modulesDb
        this.authType = rawParams.authType
        this.ssl = Boolean(rawParams.ssl)
        this.pathToCa = rawParams.pathToCa
    }

    toString(): string {
        return [this.host, this.port, this.user,
            this.pwd.replace(/./g, '*'),
            this.authType,
            this.contentDb, this.modulesDb,
            this.ssl, this.pathToCa].join(':')
    }

    sameAs(other: MlClientParameters): boolean {
        return (
            this.host === other.host &&
            this.port === other.port &&
            this.contentDb === other.contentDb &&
            this.modulesDb === other.modulesDb &&
            this.user === other.user &&
            this.pwd === other.pwd &&
            this.authType === other.authType &&
            this.ssl === other.ssl &&
            this.pathToCa === other.pathToCa
        )
    }
}

export class MarklogicClient {
    params: MlClientParameters;
    ca: string;

    mldbClient: ml.DatabaseClient;
    constructor(params: MlClientParameters) {
        this.params = params
        this.params.authType = params.authType.toUpperCase()

        if (params.pathToCa !== '') {
            try {
                this.ca = fs.readFileSync(this.params.pathToCa, 'utf8')
            } catch (e) {
                throw new Error('Error reading CA file: ' + e.message)
            }
        }
        if (this.params.authType !== 'DIGEST' && this.params.authType !== 'BASIC') {
            this.params.authType = 'DIGEST'
        }
        this.mldbClient = ml.createDatabaseClient({
            host: this.params.host, port: this.params.port,
            user: this.params.user, password: this.params.pwd,
            database: this.params.contentDb,
            authType: this.params.authType, ssl: this.params.ssl,
            ca: this.ca
        })
    }

    toString(): string {
        return this.params.toString()
    }

    hasSameParamsAs(newParams: MlClientParameters): boolean {
        return this.params.sameAs(newParams)
    }
}

export function buildNewClient(params: MlClientParameters): MarklogicClient {
    let newClient: MarklogicClient
    try {
        newClient = new MarklogicClient(params)
    } catch (e) {
        console.error('Error: ' + JSON.stringify(e))
        throw (e)
    }
    return newClient
}

export function parseXQueryForOverrides(queryText: string): Record<string, any> {
    let overrides: Record<string, any> = {}
    const firstContentLine: string = queryText.trim().split(/[\r\n]+/)[0]
    const startsWithComment: RegExpMatchArray = firstContentLine.match(/^\(:[\s\t]*/)
    const overridesFlagPresent: RegExpMatchArray = firstContentLine.match(MLSETTINGSFLAG)

    if (startsWithComment && overridesFlagPresent) {
        const overridePayload: string = queryText.trim()
            .match(/\(:.+:\)/sg)[0]       // take the first comment (greedy, multiline)
            .split(/:\)/)[0]              // end at the comment close (un-greedy the match)
            .replace(MLSETTINGSFLAG, '')  // get rid of the flag
            .replace(/^\(:/, '')          // get rid of the comment opener
            .trim()
        overrides = JSON.parse(overridePayload)
    }
    return overrides
}


export function sendJSQuery(
    db: MarklogicClient,
    actualQuery: string): ml.ResultProvider<Record<string, any>>
{
    const query = 'xdmp.eval(actualQuery, {actualQuery: actualQuery},' +
        '{database: xdmp.database(contentDb), modules: xdmp.database(modulesDb)});'

    const extVars = {
        'actualQuery': actualQuery,
        'contentDb': db.params.contentDb,
        'modulesDb': db.params.modulesDb
    } as ml.Variables

    return db.mldbClient.eval(query, extVars)
}


export function sendXQuery(
    db: MarklogicClient,
    actualQuery: string,
    prefix: 'xdmp' | 'dbg' = 'xdmp'): ml.ResultProvider<Record<string, any>>
{
    const query =
        'xquery version "1.0-ml";' +
        'declare variable $actualQuery as xs:string external;' +
        'declare variable $documentsDb as xs:string external;' +
        'declare variable $modulesDb as xs:string external;' +
        'let $options := ' +
        '<options xmlns="xdmp:eval">' +
        '   <database>{xdmp:database($documentsDb)}</database>' +
        '   <modules>{xdmp:database($modulesDb)}</modules>' +
        '</options>' +
        `return ${prefix}:eval($actualQuery, (), $options)`
    const extVars = {
        'actualQuery': actualQuery,
        'documentsDb': db.params.contentDb,
        'modulesDb': db.params.modulesDb
    } as ml.Variables

    return db.mldbClient.xqueryEval(query, extVars)
}
