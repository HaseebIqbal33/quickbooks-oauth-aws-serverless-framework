'use strict';

const OAuthClient = require('intuit-oauth');
const oauthClient = new OAuthClient({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    environment: 'sandbox',
    redirectUri: 'https://gah4qmyay6.execute-api.us-east-1.amazonaws.com/dev/quickbooks/getTokenCallback/',
    logging: true
});

module.exports.getAuthorizationCode = async event => {
    try {
        const authUri = oauthClient.authorizeUri({
            scope: [
                OAuthClient.scopes.Accounting,
                OAuthClient.scopes.OpenId
            ],
            state: 'testState'
        });
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'success',
                authUri
            })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: error.authResponse.json,
            }),
        };
    }
};

module.exports.getTokenCallback = async event => {
    try {
        // TODO: get uri from path parameters
        const redirectUri = `${event.path}?code=${event.queryStringParameters.code}&state=${event.queryStringParameters.state}&realmId=${event.queryStringParameters.realmId}`;
        const authResponse = await oauthClient.createToken(redirectUri);
        return {
            statusCode: 200,
            body: JSON.stringify({
                token: authResponse.getJson(),
                queryParams: event.queryStringParameters
            }),
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: error.authResponse.json,
            }),
        };
    }
};

module.exports.getCompanyInfo = async event => {
    try {
        const {companyId} = event.pathParameters;
        let url = OAuthClient.environment.sandbox;
        let getCompanyAPIUrl = `${url}v3/company/${companyId}/companyinfo/${companyId}`;
        const getCompanyDetails = await oauthClient.makeApiCall({
            url: getCompanyAPIUrl,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': event.headers.Authorization
            },
        });
        return {
            statusCode: 200,
            body: JSON.stringify({
                companyInfo: JSON.parse(getCompanyDetails.text())
            }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: error.authResponse.json,
            }),
        };
    }
}

module.exports.createCustomer = async event => {
    try {
        const {companyId} = event.pathParameters;
        const url = OAuthClient.environment.sandbox;
        const createCustomerAPIUrl = `${url}v3/company/${companyId}/customer`;
        const createCustomer = await oauthClient.makeApiCall({
            url: createCustomerAPIUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': event.headers.Authorization
            },
            body: JSON.parse(event.body)
        });
        return {
            statusCode: 200,
            body: JSON.stringify({
                customer: JSON.parse(createCustomer.text())
            }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: error.authResponse.json,
            }),
        };
    }
}

module.exports.getCustomerDetail = async event => {
    try {
        const {companyId, customerId} = event.pathParameters;
        let url = OAuthClient.environment.sandbox;
        let getCustomerAPIUrl = `${url}v3/company/${companyId}/account/${customerId}`;
        const getCustomerDetail = await oauthClient.makeApiCall({
            url: getCustomerAPIUrl,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': event.headers.Authorization
            },
        });
        return {
            statusCode: 200,
            body: JSON.stringify({
                getCustomerDetail: getCustomerDetail,
                companyDetail: JSON.parse(getCustomerDetail.text())
            }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: error.authResponse.json,
            }),
        };
    }
}