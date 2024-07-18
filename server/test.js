async function test(link) {
    const response = await fetch(link, {
        method: "GET",
    });
    let str = await response.text();

    try {
        let date_re = /<div class=".*u-text-normal.*?\/div>/;
        let date_str = str.match(date_re)[0];
        date_re = /[a-zA-Z]{3}\.? \d+(\u2013\d+)?, \d+/;
        console.log(date_str.match(date_re)[0]);
        let re = /<table class=".*?table.*?">[\s\S]*?<\/table>/m;
        let ret = str.match(re);
        str = ret[0];
        re = /<td>\s*\d+[\s\S]*?<\/td>[\s]*<td[\s\S]*?<\/td>/gm;
        ret = str.match(re);
        for (const r of ret) {
            console.log(r.split('\n')[1].trim());
            re = />.*?<\/span>/;
            console.log(r.match(re)[0].splice(0, 1).splice(-7, 7));
            re = /\d*\:?\d+\.\d+/;
            console.log(r.match(re)[0]);
        }
    } catch {
        console.log(str);
    }
    
}

const links = ["https://www.swimcloud.com/swimmer/2700350",
"https://www.swimcloud.com/swimmer/2192088",
"https://www.swimcloud.com/swimmer/2320506",
"https://www.swimcloud.com/swimmer/2580487",
"https://www.swimcloud.com/swimmer/1626729",
"https://www.swimcloud.com/swimmer/612239",
"https://www.swimcloud.com/swimmer/1427957",
"https://www.swimcloud.com/swimmer/1870152",
"https://www.swimcloud.com/swimmer/2197916",
"https://www.swimcloud.com/swimmer/1123120",
"https://www.swimcloud.com/swimmer/2204689",
"https://www.swimcloud.com/swimmer/768473",
"https://www.swimcloud.com/swimmer/2248291",
"https://www.swimcloud.com/swimmer/2248752",
"https://www.swimcloud.com/swimmer/2371298",
"https://www.swimcloud.com/swimmer/2683521",
"https://www.swimcloud.com/swimmer/1626724",
"https://www.swimcloud.com/swimmer/735675",
"https://www.swimcloud.com/swimmer/2178177",
"https://www.swimcloud.com/swimmer/1877005",
"https://www.swimcloud.com/swimmer/2580488",
"https://www.swimcloud.com/swimmer/1548007",
"https://www.swimcloud.com/swimmer/2663775",
"https://www.swimcloud.com/swimmer/1691814",
"https://www.swimcloud.com/swimmer/1640637",
"https://www.swimcloud.com/swimmer/1401814",
"https://www.swimcloud.com/swimmer/2197922",
"https://www.swimcloud.com/swimmer/1153488",
"https://www.swimcloud.com/swimmer/2575910",
"https://www.swimcloud.com/swimmer/1208084",
"https://www.swimcloud.com/swimmer/1249846",
"https://www.swimcloud.com/swimmer/2576675",
"https://www.swimcloud.com/swimmer/2197923",
"https://www.swimcloud.com/swimmer/2580489",
"https://www.swimcloud.com/swimmer/1870396",
"https://www.swimcloud.com/swimmer/1240378",
"https://www.swimcloud.com/swimmer/1518277",
"https://www.swimcloud.com/swimmer/1904585",
"https://www.swimcloud.com/swimmer/1793100",
"https://www.swimcloud.com/swimmer/2335735",
"https://www.swimcloud.com/swimmer/2241136",
"https://www.swimcloud.com/swimmer/611244",
"https://www.swimcloud.com/swimmer/738505",
"https://www.swimcloud.com/swimmer/1279816",
"https://www.swimcloud.com/swimmer/1479847",
"https://www.swimcloud.com/swimmer/611496",
"https://www.swimcloud.com/swimmer/2668653",
"https://www.swimcloud.com/swimmer/1401817",
"https://www.swimcloud.com/swimmer/2192054",
"https://www.swimcloud.com/swimmer/2277853",
"https://www.swimcloud.com/swimmer/1208096",
"https://www.swimcloud.com/swimmer/2580493",
"https://www.swimcloud.com/swimmer/2197926",
"https://www.swimcloud.com/swimmer/1462653",
"https://www.swimcloud.com/swimmer/2250320",
"https://www.swimcloud.com/swimmer/1714152",
"https://www.swimcloud.com/swimmer/1770984",
"https://www.swimcloud.com/swimmer/2470656",
"https://www.swimcloud.com/swimmer/1904074",
"https://www.swimcloud.com/swimmer/1347369",
"https://www.swimcloud.com/swimmer/2010657",
"https://www.swimcloud.com/swimmer/2495504",
"https://www.swimcloud.com/swimmer/1427939",
"https://www.swimcloud.com/swimmer/1111212",
"https://www.swimcloud.com/swimmer/1347363",
"https://www.swimcloud.com/swimmer/1504764",
"https://www.swimcloud.com/swimmer/1504752",
"https://www.swimcloud.com/swimmer/1976688",
"https://www.swimcloud.com/swimmer/1504753",
"https://www.swimcloud.com/swimmer/2450323",
"https://www.swimcloud.com/swimmer/828313",
"https://www.swimcloud.com/swimmer/1504773",
"https://www.swimcloud.com/swimmer/2450324",
"https://www.swimcloud.com/swimmer/738645",
"https://www.swimcloud.com/swimmer/1504765",
"https://www.swimcloud.com/swimmer/1504774",
"https://www.swimcloud.com/swimmer/2366436",
"https://www.swimcloud.com/swimmer/1347370",
"https://www.swimcloud.com/swimmer/611608",
"https://www.swimcloud.com/swimmer/1504754",
"https://www.swimcloud.com/swimmer/2254421",
"https://www.swimcloud.com/swimmer/2412198",
"https://www.swimcloud.com/swimmer/1347364",
"https://www.swimcloud.com/swimmer/1311688",
"https://www.swimcloud.com/swimmer/651521",
"https://www.swimcloud.com/swimmer/1870724",
"https://www.swimcloud.com/swimmer/828288",
"https://www.swimcloud.com/swimmer/1462656",
"https://www.swimcloud.com/swimmer/2020727",
"https://www.swimcloud.com/swimmer/827973",
"https://www.swimcloud.com/swimmer/1547952",
"https://www.swimcloud.com/swimmer/933726",
"https://www.swimcloud.com/swimmer/2450325",
"https://www.swimcloud.com/swimmer/1347374",
"https://www.swimcloud.com/swimmer/2020744",
"https://www.swimcloud.com/swimmer/2450326",
"https://www.swimcloud.com/swimmer/773593",
"https://www.swimcloud.com/swimmer/2453863",
"https://www.swimcloud.com/swimmer/1976687"];

for (let l of links) {
    test(l);
}