@description('Azure resource deployment location.')
param location string = resourceGroup().location // Bicep function returning the resource group location

@description('The text to replace the default subtitle with.')
param textToReplaceSubtitleWith string = 'This is my default subtitle text. Boring, right?'

@description('Branch of the repository for deployment.')
param repositoryBranch string = 'test'

// App Service Plan Creation
resource appServicePlan 'Microsoft.Web/serverfarms@2020-12-01' = {
  name: 'myAppServicePlan'
  location: location
  sku: {
    name: 'F1'
  }
  kind: 'Linux'
  properties: {
    reserved: false
  }
}

// Web App Creation
resource appService 'Microsoft.Web/sites@2020-12-01' = {
  name: 'this-is-a-unique-name-for-the-web-app'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      appSettings: [
        {
          name: 'TEXT_TO_REPLACE_SUBTITLE_WITH' // This value needs to match the name of the environment variable in the application code
          value: textToReplaceSubtitleWith
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT' // Build the application during deployment
          value: 'true'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION' // Set the default node version
          value: '~20'
        }
      ]
      publicNetworkAccess: 'Enabled'
    }
  }
}

// Source Control Integration
resource srcControls 'Microsoft.Web/sites/sourcecontrols@2021-01-01' = {
  parent: appService
  name: 'web'
  properties: {
    repoUrl: 'https://github.com/FarzamMohammadi/hello-world'
    branch: repositoryBranch
    isManualIntegration: true
  }
}

