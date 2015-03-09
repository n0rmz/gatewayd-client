# Ripple Connect Client

The Ripple Connect Client integrates with API endpoints of Ripple Connect to fetch and submit quotes, process external transactions, create external accounts, and view all of the gateway's external and Ripple transactions.

## Table of Contents
- Description:
    - **[Quoting Section](#quoting-section)**
    - **[Accounts Section](#accounts-section)**
    - **[Ripple Section](#ripple-section)**
- **[Dependencies](#dependencies)**
- **[How To Set Up](#how-to-set-up)**
- **[How To Use Quoting App](#how-to-use-quoting-app)**
- **[How To Use Manual Integration App](#how-to-use-manual-integration-app)**
- **[How To Use Ripple App](#how-to-use-ripple-app)**
- **[Developers](#developers)**

### Quoting Section

The quoting app allows a gateway's external customers to query and accept quotes enabling them to send funds from their account to another customer account at a local or remote gateway.

### Manual Integration Section

The banking/manual integration app is a proof of concept that consumes Ripple Connect's endpoints involving external transactions (**/v1/external_transactions**) and external accounts (**/v1/external_accounts**).

Features:
- Monitor transactions in real time
- Check transaction details
- Process deposits (sender debits) to pay off quoted invoices which move funds from the bank to the Ripple network
- Process withdrawals (receiver credits) paid out to the recipient from funds moved from the Ripple network to the bank
- Create a gateway account and customer accounts
- Display accounts and their details

### Accounts Section
The accounts section integrates with Ripple Connect's api to view and
create accounts for the gateway features.

Features:
- View/create gateway accounts
- View/create Customer Accounts

### Ripple Section

The Ripple Connect Ripple app allows users to send Ripple payments to Ripple addresses.

Features:
- Monitor incoming/outgoing ripple transactions in real time
- Check transaction details
- Send payments (issue currency) to a ripple address or ripple name

## Dependencies

[Ripple Connect - master branch](git@github.com:ripple/ripple-connect.git)

```
$ git clone git@github.com:ripple/ripple-connect.git
$ cd ripple-connect
$ git pull
$ npm install
```

[Ripple Connect Client App - develop branch](git@github.com:ripple/ripple-connect-client.git)

```
$ git clone git@github.com:ripple/ripple-connect-client.git
$ cd ripple-connect-client
$ git checkout develop
$ git pull
$ bower install
$ npm install
```

## How To Set Up

1. [Set up your gateway(s)](https://ripple.com/build/gatewayd/#installation) and make sure the branch is correct as per the [app dependencies](#dependencies).

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

4. Clone the webapp repo from [Github](https://github.com/ripple/ripple-connect-client):

    ```
    $ git clone git@github.com:ripple/ripple-connect-client.git
    ```

5. Navigate to the cloned directory, make sure the branch is correct as per the [app dependencies](#dependencies), and install its dependencies:

    ```
    $ cd ripple-connect-client
    $ git checkout develop
    $ npm install
    $ bower install
    ```

6. Edit the **app/app-config.json** file to configure which Ripple Connect instance you want to send quotes from (*baseUrl*):

    ```
    $ vim app-config.json
    ```

        {
            ...
            "baseUrl": "https://localhost:5000",
            ...
        }

7. Edit the **package.json** file to configure which port you want to run the live reload server from (*dev-port*):

    ```
    $ vim package.json
    ```

        {
            ...
            "dev-port": "7070",
            ...
        }

8. Run the gulp build process/live reload server:

    ```
    npm run dev
    ```
    If you get an EMFILE error, you need to increase the maximum number of files than can be opened and processes that can be used:

    ```
    $ ulimit -n 1000
    $ ulimit -u 1000
    ```

9. In your browser, access the local webapp via the default url or the port at localhost specified from step 6:

    ```
    http://localhost:7070
    ```

10. If you want a production build (make sure you stop the live reload server first):

    ```
    npm run prod
    ```
    The build is a tar file in the **build/** directory.

## How To Use Quoting App

_* This app assumes that you have set up your external accounts (a single gateway account and at least one customer account) on your gateway, so if you haven't done so, please create these accounts via the [Manual Integration App](#how-to-use-manual-integration-app)._

1. Enter the federated address (e.g. *alice*) of the customer requesting quotes and eventually sending funds.

2. Enter the federated address appended with '@' + the domain of the receiving customer's gateway (e.g. *bob@localhost:5050*) as well as the receiver's desired amount and currency.

3. Select a quote detailing the sending customer's options for payment from the ones available (in the sending customer's available currency, including fees from the entirety of the path, and resulting in the final value matching the receiver's desired amount).

## How To Use Manual Integration App

1. Navigate the links to filter between the Transactions and Accounts sections as well as the transaction/account types and statuses.

2. Click on a transaction/account's arrow icon to show/hide its details.

5. Click the 'Execute/Confirm Debit' button on any unprocessed transaction (a Sender Debit with *invoice* status or a Receiver Credit with *queued* status) to open a form that allows you to confirm the details and clear or fail the transaction.

6. Click the 'Create' link in the Accounts section to open a form for creating accounts. **IMPORTANT: Please create one 'gateway' account and at least one 'customer' account.**

- Type: *type* column in external_accounts table with values: **acct** for customers (the bank's customers), **gateway** for gateway account (your gateway's designated parking account)
- Name: *name* column in external_accounts table
- Bank Name: *data* column in external_accounts table
- Bank Account Number: *uid* column in external_accounts table
- Federation Address: used for quotes, *address* column in external_accounts table

7. Payments will be constantly refreshed while the app's tab/window is active/open.

## How To Use Ripple App

1. Navigate the links to filter between transaction types.

2. Click on a 'Ripple Graph Link' within the payments list to see a graphical representation of the transaction.

3. Click on a transaction's arrow icon to show/hide its details.

4. Click the 'Send Payment' link to open a form for sending payments specifying a Ripple address or Ripple name.

5. Payments will be constantly refreshed while app's tab/window is active/open.

## Developers

1. If you are using Chrome, install [Live Reload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) and click the Live Reload icon to activate live reloading when your files are modified and rebuilt.

2. This application uses [React](http://facebook.github.io/react/docs/tutorial.html) views and [Backbone stores](http://www.toptal.com/front-end/simple-data-flow-in-react-applications-using-flux-and-backbone?utm_source=javascriptweekly&utm_medium=email) within the [Flux architecture](http://facebook.github.io/flux/docs/overview.html). [React Router](https://github.com/rackt/react-router) is used for client-side routing. It also has Bootstrap styling supported with [React Bootstrap](http://react-bootstrap.github.io/).

3. You can find the root of the of app at:

    ```
    /app/scripts/main.jsx
    ```
