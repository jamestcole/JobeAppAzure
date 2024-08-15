# JavaScript on Azure Learn Path - Module 2 - Deploying a basic app to Azure

This Learn module deploys a basic app to Azure App Service.

## Requirements

- Node.js LTS

## Local development

- Create Azure resources
    - Azure App Service
- Install npm dependencies: `npm install`
- Start the server: `npm start`
- Access Web App at: `http://127.0.0.1:8080`

## Azure portal: Configure git to push to Azure App Service

1. In the Azure portal, for your web app, select **Deployment -> Deployment Center**.
1. On the **Settings** tab, copy the **Git Clone URI**. This will become your local git value for your remote named `Azure`.
1. On the **Local Git/FTPS credentials** tab, copy the **Username** and **Password** under the application scope. These credentials allow you to deploy _only_ to this web app.  

## Azure CLI: Configure git to push to Azure App Service

1. Create a user scope credential for the web app.

    ```azurecli
    az webapp deployment user set --user-name <username> --password <password>
    ```

1. After app is created, configure deployment from local git

    ```azurecli
    az webapp deployment source config-local-git --name <app-name> --resource-group <group-name>
    ```

    The output contains a URL like: https://<deployment-username>@<app-name>.scm.azurewebsites.net/<app-name>.git. Use this URL to deploy your app in the next step.

    to remove the group and all your resources

    ```
    az group delete --name <app-name> --yes --no-wait
    ```

## Create local git remote to Azure App Service

1. In a local terminal window, change the directory to the root of your Git repository, and add a Git remote using the URL you got from your app. If your chosen method doesn't give you a URL, use https://<app-name>.scm.azurewebsites.net/<app-name>.git with your app name in <app-name>.

    ```bash
    git remote add azure <url>
    ```

1. Push to the Azure remote with:

    ```bash
    git push azure <branchname>
    ```

1. In the Git Credential Manager window, enter your user-scope or application-scope credentials, not your Azure sign-in credentials.

    If your Git remote URL already contains the username and password, you won't be prompted.

1. Review the output. You may see runtime-specific automation.

1. Browse to your cloud app to verify that the content is deployed:

    ```http
    http://<app-name>.azurewebsites.net
    ```

## Upload the SQL data

1. there should be a file .bacpac , which you can download from your sql db containining all of your data, use an uploaddb.bat file to send this data back to the db through the cloud.

```
@echo off
setlocal

:: Set variables
set RESOURCE_GROUP=<>
set LOCATION=<>
set BICEP_FILE=<>
set PARAMETERS_FILE=<>
set BACPAC_URI=<>
set STORAGE_ACCOUNT_NAME=j<>
set CONTAINER_NAME=<>
set LOCAL_BACPAC_FILE=<>
set BACPAC_BLOB_NAME=<>
:: you need to fill this in with your storage account key before running !!!!!!!!!
set STORAGE_ACCOUNT_KEY=<>

set SQL_SERVER_NAME=<>
set DATABASE_NAME=<>
set SQL_ADMIN_USER=<>
set SQL_ADMIN_PASSWORD=<>
:: Create blob container if it doesn't exist
echo Creating blob container %CONTAINER_NAME% if it does not exist...
az storage container create --name %CONTAINER_NAME% --account-name %STORAGE_ACCOUNT_NAME% --account-key %STORAGE_ACCOUNT_KEY%
:: Upload .bacpac file to Azure Blob Storage
echo Uploading .bacpac file to Azure Blob Storage...
az storage blob upload --account-name %STORAGE_ACCOUNT_NAME% ^
                        --container-name %CONTAINER_NAME% ^
                        --name %BACPAC_BLOB_NAME% ^
                        --file %LOCAL_BACPAC_FILE% ^
                        --account-key %STORAGE_ACCOUNT_KEY%
:: Import .bacpac file
az sql db import --resource-group %RESOURCE_GROUP% ^
                  --server %SQL_SERVER_NAME% ^
                  --name %DATABASE_NAME% ^
                  --storage-uri %BACPAC_URI% ^
                  --storage-key %STORAGE_ACCOUNT_KEY% ^
                  --admin-password %SQL_ADMIN_PASSWORD% ^
                  --admin-user %SQL_ADMIN_USER%

endlocal
```

