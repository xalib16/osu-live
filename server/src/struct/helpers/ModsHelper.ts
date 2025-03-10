const modBits: Record<string, number> = {
    NF: 1,
    EZ: 2,
    HD: 8,
    HR: 16,
    DT: 64,
    FL: 1024,
};

export function encodeModBits(modsArray: { acronym: string }[]): number {
    let combinedValue = 0;

    modsArray.forEach((mod) => {
        const modValue = modBits[mod.acronym];
        if (modValue) {
            combinedValue |= modValue;
        };
    });

    return combinedValue;
};

export function decodeModBits(combinedValue: number): { acronym: string }[] {
    const modArray: { acronym: string }[] = [];

    for (const [key, value] of Object.entries(modBits)) {
        if ((combinedValue & value) !== 0) { 
            modArray.push({ acronym: key });
        };
    };

    return modArray;
};