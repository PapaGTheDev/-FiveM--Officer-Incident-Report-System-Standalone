# [FiveM] Officer Incident Report System Standalone
 [Standalone] FiveM OIS Report SYstem

 Preview: https://medal.tv/games/gta-v/clips/2fLpkBKkjyi8JI/d1337V4qiUHN?invite=cr-MSw4dXEsMTY0Mjk5NTAzLA


 You will need to edit this to fit your departments, you will need to edit two files

server.lua

Change the department names and webhooks for each departments

law_enforcement_report.html

You need to change around line 27-40 to each department that you have changed in server.lua

ensure OISReports

Command:
/lawenforcementreport

Command can be changed in server.lua
Line 28
RegisterCommand('lawenforcementreport', function()

Change lawenforcementreport to what you want it to be keep in mind the ''
