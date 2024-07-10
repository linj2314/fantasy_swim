const base_times = {
    "50 Y Free": 17.63,
    "100 Y Free": 39.90,
    "200 Y Free": 88.81,
    "500 Y Free": 246.32,
    "1000 Y Free": 513.93,
    "1650 Y Free": 852.08,
    "100 Y Back": 43.35,
    "200 Y Back": 95.37,
    "100 Y Breast": 49.53,
    "200 Y Breast": 107.91,
    "100 Y Fly": 42.80,
    "100 Y IM": 46.33,
    "200 Y Fly": 97.35,
    "200 Y IM": 97.91,
    "400 Y IM": 213.42,
    "50 L Free": 20.91,
    "100 L Free": 46.80,
    "200 L Free": 102.00,
    "400 L Free": 220.07,
    "800 L Free": 452.12,
    "1500 L Free": 871.02,
    "50 L Back": 23.55,
    "100 L Back": 51.60,
    "200 L Back": 111.92,
    "50 L Breast": 25.95,
    "100 L Breast": 56.88,
    "200 L Breast": 125.48,
    "50 L Fly": 22.27,
    "100 L Fly": 49.45,
    "200 L Fly": 110.34,
    "200 L IM": 114.00,
    "400 L IM": 242.50,
}

export default function score(event, time) {
    let seconds;
    const split1 = time.split(":");
    if (split1.length == 1) {
        seconds = Number(split1[0]);
    } else {
        const [secs, milli] = split1[1].split(".");
        seconds = 60 * parseInt(split1[0], 10) + parseInt(secs, 10) + 0.01 * parseInt(milli, 10);
    }
    if (!base_times[event]) {
        return -1;
    } else {
        return(Math.round(100000 * (base_times[event] / seconds) ** 3) / 100);
    }
}