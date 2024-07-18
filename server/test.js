async function test() {
    const response = await fetch('https://www.swimcloud.com/team/3951/roster/', {
        method: "GET",
    });
    let str = await response.text();

    let re = /<td>[\s\S]*?<\/td>/gm;
    let swimmers = str.match(re);
    for (const s of swimmers) {
        re = /[a-zA-z]+, [a-zA-z]+/;
        let name = s.match(re)[0];
        re = /\/swimmer\/\d+/;
        let link = s.match(re)[0];
        console.log(name);
        console.log(link);
    } 
}

await test();