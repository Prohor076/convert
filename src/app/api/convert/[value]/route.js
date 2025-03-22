import {NextResponse} from "next/server";

const resolveVanityURL = async (vanityUrl, apiKey) => {
    const response = await fetch(
        `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${vanityUrl}`
    );
    const data = await response.json();
    return data.response?.steamid || null;
};

const convert = async (steamid) => {
    const minSteam64 = BigInt('76561197960265728');
    let str = steamid.toString().trim();

    if (!/^STEAM_|^\d+$/.test(str)) {
        const data = await resolveVanityURL(str, process.env.STEAM_API_KEY);
        if (data == null) return null;
        str = data;
    }

    // Проверка SteamID32 (STEAM_X:Y:Z)
    const steamID32Match = str.match(/^STEAM_([0-1]):([0-1]):(\d+)$/i);
    if (steamID32Match) {
        const X = steamID32Match[1];
        const Y = parseInt(steamID32Match[2], 10);
        const Z = parseInt(steamID32Match[3], 10);
        const accountId = Z * 2 + Y;
        const steamId64 = BigInt(accountId) + minSteam64;

        return {
            steamid32: `STEAM_${X}:${Y}:${Z}`.toUpperCase(),
            steamid64: steamId64.toString(),
            accountid: accountId.toString()
        };
    }

    // Проверка числовых форматов (SteamID64 или AccountID)
    if (/^\d+$/.test(str)) {
        const num = BigInt(str);

        if (num >= minSteam64) { // SteamID64
            if (String(str).length != String(num).length) return null;
            const accountId = num - minSteam64;
            const Y = Number(accountId % BigInt(2));
            const Z = (accountId - BigInt(Y)) / BigInt(2);

            return {
                steamid32: `STEAM_1:${Y}:${Z}`,
                steamid64: num.toString(),
                accountid: accountId.toString()
            };
        } else { // AccountID
            const Y = Number(num % BigInt(2));
            const Z = (num - BigInt(Y)) / BigInt(2);
            const steamId64 = num + minSteam64;

            return {
                steamid32: `STEAM_1:${Y}:${Z}`,
                steamid64: steamId64.toString(),
                accountid: num.toString()
            };
        }
    }

    throw new Error('Invalid SteamID format');
};

export async function GET(request, {params} ) {
    try {
        const steamid = (await params).value;
        const data = await convert(steamid);
        if (data == null) return NextResponse.json({ "status": "error" });
        let result = {
            "status": "success",
            "data": {
                "steamid32": data.steamid32,
                "steamid64": data.steamid64,
                "accountid": data.accountid,
            },
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
    }
}