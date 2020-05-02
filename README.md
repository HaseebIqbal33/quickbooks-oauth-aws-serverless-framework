# QuickBooks API EndPoints

# QuickBooks API EndPoints
1. GET - https://<arn>.execute-api.<region-id>.amazonaws.com/dev/welcome
2. GET - https://<arn>.execute-api.<region-id>.amazonaws.com/dev/quickbooks/getAuthorizationCode
3. GET - https://<arn>.execute-api.<region-id>.amazonaws.com/dev/quickbooks/getTokenCallback
4. GET - https://<arn>.execute-api.<region-id>.amazonaws.com/dev/quickbooks/getCompanyInfo/{companyId}
5. POST - https://<arn>.execute-api.<region-id>.amazonaws.com/dev/quickbooks/createCustomer/{companyId}
6. GET - https://<arn>.execute-api.<region-id>.amazonaws.com/dev/quickbooks/getCustomerDetail/{companyId}/{customerId}

### Steps
1. Goto `getAuthorizationCode` API end point. It will return you `authUri`. Open link in the response in browser.
2. On visiting `authUri` from Step 1. It will require you to authenticate to quickbooks. And click yes to grant permission
3. It will auto redirect you to `getTokenCallback` API end point. Here in the response. You will have `access_token`, `refresh_token` and `realmId`. There will be more keys in response object but we only need these three. and `realmId` is the `companyId`. both are same.
4. Now to create customer. use `createCustomer` API Endpoint. But to create customer. You will have to pass `access_token` as `Bearer Token` in `Authorization Header`. So, use `POSTMAN` and API Endpoint 5. pass `realmId` in place of `companyId` as path parameter. Below is the min response object that is required to create new customer in quickbooks
---
```javascript
  {
  "DisplayName": "Guppu boss",
  "Suffix": "Mr.",
  "Title": "Developer",
  "MiddleName": "N/A",
  "FamilyName": "Arain",
  "GivenName": "Guppu boss"
  }
```
5. To see other(full) customer object to pass as post body [Click here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/customer#the-customer-object)


