local isNuiOpen = false


function openLawEnforcementReport()
    if not isNuiOpen then
        SetNuiFocus(true, true)
        SendNUIMessage({
            action = 'openLawEnforcementReport'
        })
        print("Law Enforcement Report NUI opened")
        isNuiOpen = true
    else
        print("Law Enforcement Report NUI is already open")
    end
end

function closeLawEnforcementReport()
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'closeLawEnforcementReport'
    })
    print("Law Enforcement Report NUI closed")
    isNuiOpen = false
end


RegisterCommand('lawenforcementreport', function()
    print("lawenforcementreport command executed")
    openLawEnforcementReport()
end, false)


RegisterNetEvent('lawEnforcementReport:submissionResponse')
AddEventHandler('lawEnforcementReport:submissionResponse', function(response)
    print("Received response from server: ", response)
    if response.success then
        closeLawEnforcementReport()
    else
        print("Error submitting form")
    end
end)


Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if isNuiOpen then
            if IsControlJustReleased(0, 322) then -- ESC key
                closeLawEnforcementReport()
            end
        end
    end
end)

RegisterNUICallback('releaseFocus', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)


RegisterNUICallback('submitForm', function(data, cb)
    print("Form data received in client: ", json.encode(data))
    TriggerServerEvent('lawEnforcementReport:submitReport', data)
    cb('ok')
end)
