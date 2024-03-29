/* Yeaaaaaah :3 AzPepoze https://www.youtube.com/channel/UCJ2C0UTfxQo6iGTfudPfoRQ */

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(async tab => {
                try {
                    if (tab.url.substring(0, 23) === "https://www.youtube.com") {
                        chrome.tabs.reload(tab.id)
                    }
                } catch (e) {

                }
            });
        });
    } else if (details.reason == "update") {
        console.log("Updated from " + details.previousVersion + " to " + chrome.runtime.getManifest().version);
    }
})

chrome.commands.onCommand.addListener(async (command) => {
    console.log(`Command "${command}" triggered`);
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions)
    console.log(command)
    chrome.tabs.sendMessage(tab.id, command);
});

async function getNowtab() {
    let queryOptions = { active: true };
    let tabsArray = await chrome.tabs.query(queryOptions)

    return tabsArray
}

async function Test() {
    let AzCached
    await chrome.storage.local.get("CachedSave").then((Loaded) => {
        AzCached = Loaded["CachedSave"]
    })

    const code = AzCached["ADDScript"];
    setTimeout(code, 1);
}

chrome.runtime.onMessage.addListener(async (message) => {
    console.log(message)
    if (message == "OpenTheme") {
        OpenThemeStore()
        return
    }
    if (message == "RunScript") {

        console.log(await getNowtab())

        Array.from(await getNowtab()).forEach(async tab => {
            chrome.scripting
                .executeScript({
                    target: { tabId: tab.id },
                    func: Test,
                })
        });
        return
    }

    Array.from(await getNowtab()).forEach(tab => {
        chrome.tabs.sendMessage(tab.id, message);
    });
})

let ThemeStoreURL = "https://giscus.app/en/widget?callbyNewtube&repo=AzPepoze%2FNewtube&backLink=https%3A%2F%2Fazpepoze.github.io%2FNewtube-Web%2F&number=6"
let CreatedWindow

async function OpenThemeStore() {
    let GetHeight

    if (CreatedWindow) {
        chrome.windows.remove(CreatedWindow)
    }

    let GetPage = await chrome.windows.getCurrent({})

    GetHeight = GetPage.height

    console.log(GetHeight)
    await chrome.windows.create(
        {
            url: ThemeStoreURL,
            type: "panel",
            top: 0,
            left: 0,
            width: 500,
            height: GetHeight
        }, function (tab) {
            CreatedWindow = tab.id
        }
    )
}

chrome.windows.onRemoved.addListener(
    function (windowId) {
        if (CreatedWindow == windowId) {
            CreatedWindow = null
        }
    }
)