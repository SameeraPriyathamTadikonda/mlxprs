[![](https://vsmarketplacebadges.dev/version/mlxprs.mlxprs.png)](https://marketplace.visualstudio.com/items?itemName=mlxprs.mlxprs)
[![](https://vsmarketplacebadges.dev/installs-short/mlxprs.mlxprs.png)](https://marketplace.visualstudio.com/items?itemName=mlxprs.mlxprs)
[![](https://vsmarketplacebadges.dev/rating-short/mlxprs.mlxprs.png)](https://marketplace.visualstudio.com/items?itemName=mlxprs.mlxprs)

# MLXPRS: MarkLogic Extension for Visual Studio Code

_Develop, run, and debug code for MarkLogic in the popular VS Code IDE_

[Visual Studio Code](https://code.visualstudio.com), also known as VS Code, is a free, cross-platform code editor and development tool from Microsoft. [**MLXPRS**](https://marketplace.visualstudio.com/items?itemName=mlxprs.mlxprs) is a free, open-source extension for VS Code that increases the productivity of developers creating applications on MarkLogic.

## Features

* Syntax highlighting and IntelliSense for MarkLogic Server-Side JavaScript and XQuery
* Interactive debugging of JavaScript and XQuery running in MarkLogic, including attaching to in-flight requests and inspecting live variables
* Real-time query evaluation of JavaScript, XQuery, SQL, SPARQL, and Optic against a MarkLogic instance
* View modules (read-only) in the editor
* Run [marklogic-unit-test module](https://github.com/marklogic-community/marklogic-unit-test)
* Validate TDE templates and test the templates with node extraction

_JavaScript debugging requires version 2.0.0+ of the MarkLogic extension and [MarkLogic 10.0-4+](https://developer.marklogic.com/products/marklogic-server/10.0)._


## Getting started

Install this tool using the VS Code built-in [marketplace](https://marketplace.visualstudio.com/items?itemName=mlxprs.mlxprs). Search “MarkLogic” from the Extension tab of the activity bar. Click “Install” to download and install the extension.

### Configuration

The MarkLogic extension exposes several configuration options from the standard VS Code `settings.json` file:

```json
{
  "marklogic.host": "marklogic-instance.geocities.com",
  "marklogic.port": 8040,
  "marklogic.managePort": 8002,
  "marklogic.testPort": 8054,
  "marklogic.username": "username",
  "marklogic.password": "****************",
  "marklogic.documentsDb": "myproject-content",
  "marklogic.modulesDb": "myproject-modules"
}
```
**Note: marklogic.documentsDb *must* be declared in order to attach to remote JavaScript request.

You can also set `marklogic.authType` to `DIGEST` or `BASIC`. Digest is the default,
and works even if the server is running basic authentication.


### Evaluate Queries

To evaluate JavaScript, XQuery, SQL, or SPARQL:

1. Type a valid query in the editor.
2. Open the VS Code command palette.
3. Select `MarkLogic: Eval JS`, `MarkLogic: Eval XQuery`, `MarkLogic: Eval SQL`, or `MarkLogic: Eval SPARQL` - depending on the type of query.

Query results will apper in the `MLXPRS: RESULTS` tab in the bottom panel, or open in a new editor tab - depending on the value of the `Marklogic: Results In Editor Tab` setting.


### Submit Optic Queries

To run an Optic query (either DSL or serialized):

1. Type a valid query in the editor.
2. Open the VS Code command palette.
3. Select one of the `MarkLogic: Submit Optic Query - <Response Format>` commands, depending on the desired response format.

Query results will apper in the `MLXPRS: RESULTS` tab in the bottom panel, or open in a new editor tab - depending on the value of the `Marklogic: Results In Editor Tab` setting.


### Submit GraphQL Queries

To run a GraphQL query:

1. Type a valid query in the editor.
2. Open the VS Code command palette.
3. Select the `MarkLogic: Submit GraphQL Query` command.

Query results will apper in the `MLXPRS: RESULTS` tab in the bottom panel, or open in a new editor tab - depending on the value of the `Marklogic: Results In Editor Tab` setting.

For more information on sending GraphQL request to MarkLogic, please refer to [GET /v1/rows/graphql](https://docs.marklogic.com/REST/GET/v1/rows/graphql) and [Introduction to GraphQL with MarkLogic](https://www.marklogic.com/blog/introduction-to-graphql-with-marklogic/).

### Inspect a module

To view a module from the configured modules database:

1. Open the VS Code command palette.
2. Select `MarkLogic: Show Module` from the list.
3. Choose the module you'd like to view from the resulting list. The list searches and filters as you type.

The module will appear read-only in a new text buffer.


### Run marklogic-unit-test module

This plugin provides a convenient method for running a [marklogic-unit-test module](https://marklogic-community.github.io/marklogic-unit-test/) within your MarkLogic server. To get started, your test suites and files must be organized under a "src/test/ml-modules/root/test/suites" directory. See this [ml-gradle sample project](https://github.com/marklogic/ml-gradle/tree/master/examples/unit-test-project) for an example of how to setup the project to use marklogic-unit-test. Additionally, you need to set the `Marklogic: Test Port` setting to the port number of the App Server that can run your unit tests. Finally, to run a test file:

1. In an editor tab, open the test file that you wish to be executed.
2. Open the VS Code command palette.
3. Select `MarkLogic: Run marklogic-unit-test Module` from the list.

The results of the tests will appear in the `MLXPRS: RESULTS` tab in the bottom panel.


### Validate & Test TDE templates

While developing TDE templates, you may verify that your templates are valid TDE templates. Additionally, if the template is valid, you may also use the template to extract nodes from data documents. That permits you to verify that template is extracting data as intended.

To validate a TDE template:
1. In an editor tab, open the template file that you wish to be validated.
2. Open the VS Code command palette.
3. Select `MarkLogic: Validate TDE Template` from the list

The results of the validation will appear in the `MLXPRS: RESULTS` tab in the bottom panel.

To extract nodes from a data document using a TDE template:
1. In an editor tab, open the template file that you wish to use for node extraction.
2. Add a "var" property with a "name" of "MLXPRS_TEST_URI" and a "val" that is the URI of the data document in the database. If there is not already a "vars" property, you will need to also add that as a child of the "template" property. Alternatively, you can extract data from a local file by using the var "name" of "MLXPRS_TEST_FILE" setting the "val" property to the path to the file. When using "MLXPRS_TEST_FILE", the path in the "val" property may be either an absolute path or a path relative to the current workspace.

For a JSON document the vars section will look something like the following:
```
    "vars":[
      {
        "name":"MLXPRS_TEST_URI",
        "val":"/citations.xml"
      }
    ]
```

For an XML document the vars section will look something like this:
```
  <vars>
    <var>
      <name>MLXPRS_TEST_FILE</name>
      <val>src/main/ml-data/citations.xml</val>
    </var>
  </vars>
```

3. Open the VS Code command palette.
4. Select `MarkLogic: Extract Data Via TDE` from the list

The results of the node extraction will appear in the `MLXPRS: RESULTS` tab in the bottom panel.


### SSL Configuration

You can turn on SSL with the `marklogic.ssl` configuration property.
If the CA is not in your chain of trust (for example, if the certificate is self-signed),
you need to point to the CA in your configuration as well using `marklogic.pathToCa`.
The configuration will look something like this:

```json
{
  "marklogic.ssl": true,
  "marklogic.pathToCa": "/Users/myself/certs/my.own.ca.crt"
}
```

You can acquire the CA file from the MarkLogic admin pane (usually port 8001), by
going to 'Security' -> 'Certificate Templates' -> (cert host name), and then
selecting the `Status` tab. There is a `download` button in the `certificate template status` section. Click the `download` button to download a copy of your root CA.

Alternatively, you can turn off client certificate checks altogether.
Set `marklogic.rejectUnauthorized` to `false` in your VS Code configuration.
This is less secure, but may be useful for situations where you can't obtain or use a your own CA,
such as when connecting to a IP address rather than a hostname.

Testing with some versions of VS Code has shown that if the project has a file named build.gradle and the VS Code Java Extension is enabled, the `marklogic.rejectUnauthorized` setting may be ignored. If you see this behavior, disabling the Java Extension is recommended to ensure the setting works properly. 

**Note: Currently, all configured ports (port, managePort, and testPort) must have the same SSL settings and they must either use certs that pass the configured CA verification or have CA verification turned off.

### Query Eval configuration override

You can override your VS Code configured settings by using a block comment as the first language token
in a JavaScript or XQuery query. The comment should conform to the following:

- First line includes the string `mlxprs:settings`
- The rest of the comment is valid JSON
- Includes at least one of the following keys: `host`, `port`, `user`, `pwd`, `contentDb`, `modulesDb`, `authType`, `ssl`, `pathToCa`
- The corresponding value should be of the right type for the configuration (number for `port`, boolean for `ssl`, string otherwise)

The values defined in the JSON will override VS Code's MarkLogic client configuration.

For example:

```js
/* mlxprs:settings
{
  "host": "my-test-host",
  "port": 8079,
  "contentDb": "unit-test-database",
  "note": "These settings are for testing only"
}
*/
'use strict';
cts.doc('/my-testing-doc.json');
```

or:

```xquery
(: mlxprs:settings
{
  "host": "my-test-host",
  "contentDb": "unit-test-database",
  "modulesDb": "unit-test-MODULES",
  "user": "unit-tester",
  "pwd": "red,green,refactor",
  "note": "These settings are for testing only"
}
:)
xquery version "1.0-ml";
fn:doc('/my-testing-doc.json')
```

When this query runs, it will use the host, port, and `contentDb` specified in the comment, along with the VS Code configuration parameters for the rest of the MarkLogic client definition. (The `note` will be ignored.) Other queries in other editor tabs will not be affected.

**Note: This configuration override is only applied when using one of the "MarkLogic: Eval <language>" commands.

## Debugging

Both JavaScript and XQuery debuggers support two modes of debugging:

1. Launch: Evaluates a main module (for JavaScript) or non-library module (for XQuery)
2. Attach: Intecepts an existing request, such as from an integration test

Where it can, query debugging uses the same VS Code settings used for running queries (for example, `marklogic.host`, `marklogic.username`). In addition to these code settings, you will need a [**launch config**](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations) in your project (under `.vscode/launch.json`) for debug-specific parameters.

Open the `launch.json` from the VS Code command palette with the command: “Debug: Open launch.json” or `Debug`.

Below is an example of a `launch.json` file, with JavaScript and XQuery configurations for both launch and attach:

```json
{
  "version": "2.0.0",
  "configurations": [
    {
      "request": "launch",
      "type": "ml-jsdebugger",
      "name": "Evaluate Current JavaScript Module"
    },
    {
      "request": "attach",
      "type": "ml-jsdebugger",
      "name": "Attach to Debug Request",
      "root": "${workspaceFolder}/src/main/ml-modules/root",
      "debugServerName": "Enter debug server name"
    },
    {
      "request": "launch",
      "type": "xquery-ml",
      "name": "Launch XQY Debug Request",
      "program": "",
      "root": "${workspaceFolder}/src/main/ml-modules/root"
    },
    {
      "request": "attach",
      "type": "xquery-ml",
      "name": "Attach to XQY Debug request",
      "root": "${workspaceFolder}/plugins"
    }
  ]
}
```

VS Code is syntax-aware of what information should go into `launch.json`, so take advantage of auto-complete and hover hints as you edit.

### Launch

Example 'launch' type configuration items for JavaScript and XQuery:

```json
    {
      "type": "ml-jsdebugger",
      "request": "launch",
      "name": "Evaluate Current JavaScript Module"
    },
    {
      "type": "xquery-ml",
      "request": "launch",
      "name": "Launch XQY Debug Request",
      "program": "",
      "root": "${workspaceFolder}/src/main/ml-modules/root"
    }
```

By default, launch mode will launch the currently opened file for debugging.
An optional `program` property can be provided in a `launch.json` task configuration to specify another file for debugging.
Additionally, older versions of this extension permitted the use of `path` for JS. However, while `path` still works, its use is deprecated and will be removed in mlxprs 4.0

### Attach

Here's an example of _attach_ configurations for JavaScript and XQuery:

```json
    {
      "type": "ml-jsdebugger",
      "request": "attach",
      "name": "Attach to Remote JavaScript Request",
      "debugServerName": "jsdbg",
      "path": "${workspaceFolder}/src/main/ml-modules/root"
    },
    {
      "type": "xquery-ml",
      "request": "attach",
      "name": "Attach to XQY Debug request",
      "root": "${workspaceFolder}/plugins"
    }
```

Attach mode intercepts a paused request in a given *debug server*, an App Server connected to the VS Code debugger. To connect to an App Server for debugging:

1. open the command palette, start typing <kbd>MarkLogic: Connect...</kbd> until autocomplete prompts you with `MarkLogic: Connect JavaScript Debug Server` or `MarkLogic: Connect XQuery Debug Server`, and choose the command you want.
2. You'll be prompted to choose a server. Use the name of the App Server in the MarkLogic configuration, _not_ its hostname or IP address.
3. You should see a confirmation message once you're connected

Connecting a server will automatically pause all requests so that you can attach the debugger. When you're done, use either <kbd>MarkLogic: Disconnect...</kbd> command to disable debugging and resume handling requests as normal. Note that while the server is in "Connect" mode, you should not change any of the configured ports to the port number of the connected server. This will cause requests from the plugin to pause, leading to unexpected results. 

Once you start debugging, a dropdown menu will pop up listing all paused requests on the debug server. Choose the one you want to debug.

**Note: Only requests that are launched after a server is connected/made debug server can be attached.**

![Attach screenshot](images/attach_screenshot.png "attach screenshot")

Use the optional parameter `rid` to specify a request ID in advance and avoid being prompted for it.

In attach mode for JavaScript, `debugServerName` is a required parameter in the `launch.json`. This should be the same server (by name) that you connected to in the [Attach](#attach) section. XQuery attach mode will simply list all attachable queries.



## Notes

### Debugger module mapping

In order to step through modules that get imported in your code, you need to tell the debugger where to find the modules root in your local project. This is the `path` parameter (for JavaScript) and `root` (for XQuery). These parameters are required.

In order to step into the built-in MarkLogic modules, create a soft link in the root of your source directory to the Modules/MarkLogic directory in your local MarkLogic install. For example, from the root directory of your source files, use the following command:
```
ln -s <path-to-marklogic-install>/Modules/MarkLogic .
```

### Debugging Limitations

In XQuery attach-mode debugging, you should not 'connect' to the same server you use for queries. Since connecting stops all requests on that App Server, you'd lock yourself out. For this reason, the extension will not offer to connect to your configured query client's port. Admin, Manage, HealthCheck, and App-Services are also excluded from debugging.

Due to the nature of XQuery, the XQuery debugger functions a bit differently than many developers are accustomed to. Multiple lines of XQuery may be reported as a single expression by the MarkLogic debugger functions.
Since the three primary stepping functions, `Step Over`, `Step Into`, and `Step Out`, all operate based on XQuery expressions, using those functions does not have the same result as using those functions in the JavaScript debugger.
- `Step Over` continues evaluation of the request until the beginning or end of an expression that is not a descendant of the current expression.
- `Step Into` continues evaluation of the request until the beginning or end of an expression. Using this function most closely resembles the expected functionality of a debugger.
- `Step Out` continues evaluation of the request until the end of the current expression.

Watch expressions do not currently work with the XQuery debugger.

'Launch' debugging initiated from an unsaved ('Untitled') buffer in VS Code will not work. If you want to launch and debug an ad-hoc query, save it somewhere on disk beforehand.

Neither debugger can cross from one server-side language mode into another. XQuery debugging cannot step into `xdmp:javascript-eval()` calls, and JavaScript debugging cannot step into `xdmp.xqueryEval()`. The debugger should step over these calls if you try to step into them.

Evaluating variables in module scope may throw reference error. Possible workarounds:

- use the variables of interest inside a function, and inspect
- place an `eval()` statement inside the affected module

### Error Reporting

While every effort is made to catch and handle error conditions, unexpected errors do occur from time to time and must be handled by VS Code internally. Those errors are sometimes reported only in the debug console and that tab is not automatically given focus in the UI. This means that it can be easy to miss that an error has occurred. Therefore, if a feature does not seem to be working properly but no error popup is shown, then check the debug console for errors.

### Required Privileges for Evaluation and Debugging

To run queries with the MarkLogic JavaScript and XQuery Debugger, a user will need eval priviliges on your MarkLogic server. These include:

- **xdmp-eval**: absolute minimum
- **xdmp-eval-in**: to use a non-default content database
- **xdmp-eval-modules-change**: to use a non-default modules database or modules root
- **xdmp-eval-modules-change-file**: to use the filesystem for modules

For debugging, a user must also have at least one of these privileges to evaluate a JavaScript or XQuery module in debug mode.

- **debug-my-requests**: for debugging requests launched by the debug user only
- **debug-any-requests**: for debugging requests launched by any user

If a user wants to attach to paused requests within a MarkLogic App Server, in order to debug requests, they must have the **debug-any-requests** privilege.

For more about privileges, see [xdmp:eval](https://docs.marklogic.com/10.0/xdmp:eval) and [Debug functions](https://docs.marklogic.com/dbg) in the API docs, along with [Pre-defined Executive Privileges](https://docs.marklogic.com/guide/admin/exec_privs) in the MarkLogic server documentation.

## Credit

Aside from excellent development and extension support from Visual Studio Code,

- Portions of Josh Johnson's [vscode-xml](https://github.com/DotJoshJohnson/vscode-xml) project are re-used
for XML formatting. The MIT license and source code are kept in the `client/xmlFormatting` folder of this project.
- Christy Haragan's [marklogic-node-typescript-definitions](https://github.com/christyharagan/ml-typescript-definitions)
made this project possible.
- Paxton Hare's [marklogic-sublime](https://github.com/paxtonhare/MarkLogic-Sublime)
`xquery-ml.tmLanguage` code is used for XQuery-ML syntax and snippets, and the MarkLogic Sublime project inspired this one.
