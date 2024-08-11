// Define the parameters
param location string = 'UK South'

// Define the storage account
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: 'jobsitestoracc'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

// Define the App Service plan (Linux)
resource appServicePlan 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: 'jobsite-app'
  location: location
  sku: {
    tier: 'Standard'
    name: 'S1'
  }
  kind: 'Linux'
  properties: {
    reserved: true
  }
}


// Define the web app
resource webApp 'Microsoft.Web/sites@2021-02-01' = {
  name: 'jobsite-app'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
    }
  }
}

// Define the SQL Server
resource sqlServer 'Microsoft.Sql/servers@2021-02-01-preview' = {
  name: 'jobsitesqlserver'
  location: location
  properties: {
    administratorLogin: 'sqladmin'
    administratorLoginPassword: 'Password123!' // Use a secure password in practice
  }
}

// Define the SQL database
resource sqlDatabase 'Microsoft.Sql/servers/databases@2021-02-01-preview' = {
  name: 'jobsite-db'
  location: location
  parent: sqlServer
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648
  }
  sku: {
    name: 'S0'
  }
}

// Output the web app URL
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
