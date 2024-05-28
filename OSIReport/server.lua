local departmentWebhooks = {
    ["BCSO"] = "Webhook 1",
    ["ASP"] = "Webhook 2",
    ["SPD"] = "Webhook 3",
    ["DNR"] = "Webhook 4"

}

RegisterServerEvent('lawEnforcementReport:submitReport')
AddEventHandler('lawEnforcementReport:submitReport', function(data)
    print('Received data: ' .. json.encode(data))

    local webhookUrl = departmentWebhooks[data.department]
    if not webhookUrl then
        print("Invalid department selected")
        TriggerClientEvent('lawEnforcementReport:submissionResponse', source, { success = false })
        return
    end

    local embed = {
        {
            title = data.reportType .. " Submitted",
            description = "A new report has been submitted.",
            fields = {
                { name = "Report Type", value = data.reportType, inline = true },
                { name = "Date", value = data.date, inline = true },
                { name = "Officer", value = data.officer, inline = true },
                { name = "Details", value = data.details or data.description or data.damage or data.cause or data.location or data.reason, inline = false }
            },
            color = 16711680 -- Red color
        }
    }


    sendWebhook(webhookUrl, embed)


    local response = { success = true }
    print('Sending response to client: ' .. json.encode(response))
    TriggerClientEvent('lawEnforcementReport:submissionResponse', source, response)
end)

RegisterServerEvent('releaseFocus')
AddEventHandler('releaseFocus', function()
    TriggerClientEvent('releaseFocus', source)
end)


function sendWebhook(url, embed)
    local payload = {
        username = "Law Enforcement Report Bot",
        embeds = embed
    }

    PerformHttpRequest(url, function(err, text, headers)
        if err ~= 200 then
            print("Error sending webhook: " .. err)
        else
            print("Webhook sent successfully: " .. text)
        end
    end, 'POST', json.encode(payload), { ['Content-Type'] = 'application/json' })
end
