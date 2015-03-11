var data = {
    success: true,
    bridge_payments: [
        {
            state: 'quote',
            created: '2015-03-10T00:22:40.605Z',
            source: {
                uri: 'acct:test1@localhost:5000',
                address: 'rhY5y4NB7A1TuKgVNrRoSfk41uZasmbDnS',
                account_number: 1111
            },
            wallet_payment: {
                destination: 'rphrLBy39abbhUTta1CWtHryYHVcvrTWeX?dt=3',
                primary_amount: {
                    amount: 1,
                    currency: 'XRP',
                    issuer: ''
                },
                destination_account_number: '4123'
            },
            destination: {
                uri: 'acct:test2@localhost:5000'
            },
            destination_amount: {
                amount: 1,
                currency: 'XRP',
                issuer: ''
            },
            parties: {},
            uuid: '38e48a98-7e6d-4a39-ab49-528da78af959'
        }
    ]
};

module.exports = data;
