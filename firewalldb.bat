@echo off
setlocal

:: Set your variables
set RESOURCE_GROUP=practicenodeapp1
set SQL_SERVER_NAME=jobsitesqlserver

:: List of IPs
set IPS=51.103.0.54,51.103.4.31,51.103.5.0,51.103.5.19,51.103.5.26,51.103.5.53,51.103.5.67,51.103.5.120,51.103.5.122,51.103.5.156,51.103.5.163,51.103.5.188,51.103.7.4,51.103.7.59,51.103.7.60,51.103.7.91,51.103.7.107,51.103.7.113,51.103.7.117,51.103.7.135,51.103.6.4,51.103.7.150,51.103.7.162,51.103.7.167,51.103.4.157,51.103.7.177,51.103.7.201,51.103.7.206,51.103.3.118,51.103.7.208,20.111.1.0

set index=1


:: Loop through the IP addresses
:: Loop through the IP addresses
for %%i in (%IPS%) do (
    echo Adding firewall rule for IP: %%i
    az sql server firewall-rule create --resource-group %RESOURCE_GROUP% --server %SQL_SERVER_NAME% --name "AllowIP_%%i" --start-ip-address %%i --end-ip-address %%i
)

endlocal

