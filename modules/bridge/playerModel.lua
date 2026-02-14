-- TODO: install `screenshot-basic` on the server
local cam = nil
local active = false

-- Helper to start camera
function StartPlayerCamera()
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)

    -- create scripted camera
    cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)
    SetCamCoord(cam, coords.x + 1.5, coords.y, coords.z + 0.9)
    PointCamAtEntity(cam, playerPed, 0.0, 0.0, 0.0, true)
    SetCamActive(cam, true)
    RenderScriptCams(true, false, 0, true, true)

    active = true

    -- start a thread to update camera
    Citizen.CreateThread(function()
        local heading = 0.0
        while active do
            heading = heading + 0.5
            SetCamRot(cam, 0.0, 0.0, heading, 2)
            Wait(100) -- ~10 FPS is enough for inventory preview

            -- capture frame and send to NUI
            if exports['screenshot-basic'] then
                local screenshot = exports['screenshot-basic']:requestScreenshot() -- returns base64
                SendNUIMessage({
                    action = "setupPlayerModel",
                    imageBase64 = screenshot
                })
            end
        end
    end)
end

-- Stop camera
function StopPlayerCamera()
    if cam then
        RenderScriptCams(false, false, 0, true, true)
        DestroyCam(cam, false)
        cam = nil
    end
    active = false
end

-- Example: start camera when inventory opens
RegisterNetEvent('ox_inventory:openInventory', function()
    StartPlayerCamera()
end)

-- Stop camera when inventory closes
RegisterNetEvent('ox_inventory:closeInventory', function()
    StopPlayerCamera()
end)
