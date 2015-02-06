# Gatewayd Quoting App

The gatewayd quoting app allows a gateway's external customers to query and accept quotes enabling them to send funds from their account to another customer account at a local or remote gateway.

### Table of Contents
- **[Dependencies](#dependencies)**
- **[How To Set Up](#how-to-set-up)**
- **[How To Use](#how-to-use)**
- **[Developers](#developers)**

## Dependencies

[Gatewayd - develop branch](https://github.com/ripple/gatewayd/tree/develop)

```
$ git checkout develop
$ git pull
$ npm install
```

[Quoting App - task/demo branch](https://github.com/gatewayd/gatewayd-quoting-app/tree/task/demo)

```
$ git checkout task/demo
$ git reset --hard origin/task/demo
```

[Banking App - task/demo branch](https://github.com/gatewayd/gatewayd-banking-app/tree/task/demo)

```
$ git checkout task/demo
$ git reset --hard origin/task/demo
```

[Basic App - task/demo branch](https://github.com/gatewayd/gatewayd-basic-app/tree/task/demo)

```
$ git checkout task/demo
$ git reset --hard origin/task/demo
```

## How To Set Up

1. [Set up your gateway(s)](https://ripple.com/build/gatewayd/#gatewayd-usage) and make sure the branch is correct as per the [app dependencies](#dependencies).

2. Edit each gateway's config file:

    ```
    $ vim config/config.json
    ```
    Make sure these attributes are set as follows:

        {
            ...
            "SSL": true,
            "USER_AUTH": false,
            "BASIC_AUTH": false,
            "PORT": 5000,
            "DOMAIN": "localhost:5000",
            ...
        }

    PORT and DOMAIN can be changed accordingly (e.g. changing PORT to 5050 and DOMAIN to localhost:5050 on a second gateway).

3. Visit each gateway's host url in the browser to trust and accept the security authorization.

    ```
    "Advanced" => "Proceed anyway"
    ```

4. Clone the webapp repo from [Github](https://github.com/gatewayd/gatewayd-quoting-app):

    ```
    $ git clone git@github.com:gatewayd/gatewayd-quoting-app.git
    ```

5. Navigate to the cloned directory, make sure the branch is correct as per the [app dependencies](#dependencies), and install its dependencies:

    ```
    $ npm install
    $ bower install
    ```

6. Edit the **app-config.json** file to configure which gatewayd instance you want to send quotes from (*baseUrl*) and which port on localhost you want to access the app from (*connectPort*):
    ```
    $ vim app-config.json
    ```

7. Run the gulp build process/live reload server:

    ```
    npm run dev
    ```
    If you get an EMFILE error, you need to increase the maximum number of files than can be opened and processes that can be used:

    ```
    $ ulimit -n 1000
    $ ulimit -u 1000
    ```

8. In your browser, access the local webapp via the default url or the port at localhost specified from step 6:

    ```
    http://localhost:7070
    ```

## How To Use:

_* This app assumes that you have set up your external accounts (a single gateway account and at least one customer account) on your gateway, so if you haven't done so, please create these accounts via the [Banking App](https://github.com/gatewayd/gatewayd-banking-app) and make sure the branch is correct as per the [app dependencies](#dependencies)._

1. Enter the federated address (e.g. *alice*) of the customer requesting quotes and eventually sending funds.

2. Enter the federated address appended with '@' + the domain of the receiving customer's gateway (e.g. *bob@localhost:5050*) as well as the receiver's desired amount and currency.

3. Select a quote detailing the sending customer's options for payment from the ones available (in the sending customer's available currency and including fees from the entirety of the path that results in the final value matching the receiver's desired amount).

## Developers

1. If you are using Chrome, install [Live Reload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) and click the Live Reload icon to activate live reloading when your files are modified and rebuilt.

2. This application uses [React](http://facebook.github.io/react/docs/tutorial.html) views and [Backbone stores](http://www.toptal.com/front-end/simple-data-flow-in-react-applications-using-flux-and-backbone?utm_source=javascriptweekly&utm_medium=email) within the [Flux architecture](http://facebook.github.io/flux/docs/overview.html). [React Router](https://github.com/rackt/react-router) is used for client-side routing. It also has Bootstrap styling supported with [React Bootstrap](http://react-bootstrap.github.io/).

3. You can find the root of the of app at:

    ```
    /app/scripts/main.jsx
    ```
