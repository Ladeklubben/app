export interface FunFact {
    text: string;
    scalingFactor: number;
}

export const funFacts: FunFact[] = [
    {
        text: "Same as {value} smartphone charges!",
        scalingFactor: 100, // 1 kWh = 100 smartphone charges
    },
    {
        text: "Could charge {value} tablets!",
        scalingFactor: 26, // 1 kWh = 26 tablet charges
    },
    {
        text: "Powers a laptop for {value} days!",
        scalingFactor: 18, // 1 kWh = 18 days of laptop use
    },
    {
        text: "Equals {value} hours of TV watching!",
        scalingFactor: 17, // 1 kWh = 17 hours of smart TV watching
    },
    {
        text: "Powers gaming for {value} hours!",
        scalingFactor: 5.6, // 1 kWh = 5.6 hours of gaming
    },
    {
        text: "Brews {value} pots of coffee!",
        scalingFactor: 8.3, // 1 kWh = 8.3 coffee brewing cycles
    },
    {
        text: "Runs microwave for {value} minutes!",
        scalingFactor: 42, // 1 kWh = 42 minutes of microwave time
    },
    {
        text: "Makes {value} rounds of toast!",
        scalingFactor: 25, // 1 kWh = 25 toaster cycles
    },
    {
        text: "Boils water {value} times!",
        scalingFactor: 13, // 1 kWh = 13 kettle boiling cycles
    },
    {
        text: "Runs dishwasher for {value} loads!",
        scalingFactor: 0.67, // 1 kWh = 0.67 dishwasher loads
    },
    {
        text: "Hair drying for {value} minutes!",
        scalingFactor: 33, // 1 kWh = 33 minutes of hair drying
    },
    {
        text: "Space heating for {value} minutes!",
        scalingFactor: 40, // 1 kWh = 40 minutes of space heating
    },
    {
        text: "Vacuuming for {value} hours!",
        scalingFactor: 1, // 1 kWh = 1 hour of vacuuming
    },
    {
        text: "Does {value} loads of laundry!",
        scalingFactor: 1.1, // 1 kWh = 1.1 washing machine cycles
    },
    {
        text: "Fully charges {value} e-bikes!",
        scalingFactor: 2, // 1 kWh = 2 e-bike full charges
    },
    {
        text: "Charges {value} electric scooters!",
        scalingFactor: 3.3, // 1 kWh = 3.3 e-scooter charges
    },
    {
        text: "Powers {value} e-skateboards!",
        scalingFactor: 2.9, // 1 kWh = 2.9 e-skateboard charges
    },
    {
        text: "Charges {value} electric wheelchairs!",
        scalingFactor: 2, // 1 kWh = 2 wheelchair full charges
    },
    {
        text: "Can charge a golf cart {value} times!",
        scalingFactor: 0.33, // 1 kWh = 0.33 golf cart charges
    },
    {
        text: "Energy of {value} AA batteries!",
        scalingFactor: 294, // 1 kWh = 294 AA batteries worth of energy
    },
    {
        text: "Fills {value} power banks!",
        scalingFactor: 27, // 1 kWh = 27 power bank charges
    },
    {
        text: "Same as {value} bananas!",
        scalingFactor: 9700, // 1 kWh = 9,700 bananas worth of energy
    },
    {
        text: "Energy of {value} bread slices!",
        scalingFactor: 12000, // 1 kWh = 12,000 slices of bread worth of energy
    },
    {
        text: "Same as {value} chocolate bars!",
        scalingFactor: 4100, // 1 kWh = 4,100 chocolate bars worth of energy
    },
    {
        text: "Powers LED bulb for {value} hours!",
        scalingFactor: 100, // 1 kWh = 100 hours of LED lighting        
    },
    {
        text: "Powers christmas lights for {value} hours!",
        scalingFactor: 133, // 1 kWh = 133 hours of Christmas lights
    },
    {
        text: "Powers a smart speaker for {value} hours!",
        scalingFactor: 333, // 1 kWh = 333 hours of smart speaker operation
    },
    {
        text: "Runs a refrigerator for {value} hours!",
        scalingFactor: 16, // 1 kWh = 16 hours of refrigerator operation
    },
    {
        text: "Powers desktop computer for {value} hours!",
        scalingFactor: 10, // 1 kWh = 10 hours of desktop computer use
    }
];

/**
 * Get a random fun fact with the calculated value based on kWh
 * @param kWh - The energy consumption in kilowatt-hours
 * @returns A formatted string with the fun fact
 */
export function getRandomFunFact(kWh: number): string {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    const fact = funFacts[randomIndex];
    const value = Math.round(kWh * fact.scalingFactor);

    // Format value with thousand separators
    const formattedValue = value.toLocaleString();

    return fact.text.replace('{value}', formattedValue);
}