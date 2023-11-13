import { Bit } from "./App";
import { PAGE_TABLE_ENTRY } from "./components/Page_table/Page_table";
import { TLB_TABLE_ENTRY } from "./components/Tlb_table/Tlb_table";

// create a random number from bitlength by taking a random number between
// the previous number of bits and the current max of the bits we want 
export function createRandomNumberWith(bitLength: number): number {
    return createRandomNumber(2 ** (bitLength - 1), 2 ** bitLength)
}

// Create a random number between a and b
export function createRandomNumber(a: number, b: number) {
    return Math.floor(Math.random() * (b - a)) + a;
}

export function createUniqe(fromNum: number, size: number): number {
    // A random address is able to be created to be the actual tag of the virtual
    // address, We have to check for that.
    let unique = createRandomNumber(0, createRandomNumberWith(size))
    // Check if the tag already exists in the TLB table
    while (unique === fromNum) {
        unique = createRandomNumber(0, createRandomNumberWith(size))
    }

    return unique;
}

export function generateTLBSets(): number {
    return 2 ** createRandomNumber(2, 4);
}

export function generateTLBWays(): number {
    return createRandomNumber(3, 5);
}


export function isPageTableEntry(entry: TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY): entry is PAGE_TABLE_ENTRY {
    return 'vpn' in entry;
}

// Function to create a TLB entry
export function createTableEntry<TObj extends TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY>(entry: TObj, TLBT_bits: string, VPN: string): TObj {

    const valid: Bit = Math.floor(Math.random() * 2) as Bit;
    const ppn: number = createRandomNumberWith(8);
    // create unique TLBT address
    const tag: number = createUniqe(Number('0b' + TLBT_bits), 4 * 2)
    const vpn: number = createUniqe(Number(VPN), 4 * 2)

    let newEntry: TObj;
    if (isPageTableEntry(entry)) {
        newEntry = {
            ...entry,
            vpn,
            ppn,
            valid
        };
    } else {
        newEntry = {
            ...entry,
            ppn,
            tag,
            valid
        };
    }

    return newEntry;
}


// Function to create a geniric table of entries of type TLB_TABLE_ENTRY or PAGE_TABLE_ENTRY
// tlb_enty = rows = sets | column = ways
// page_entry = rows = pageSize | column = pageTableSize ?????
export function createTableEntries<TObj extends TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY>(
    numOfRows: number,
    numOfCols: number,
    tableEntry: TObj,
    TLB_bits: string,
    VPN: string
): TObj[][] {
    const entries: TObj[][] = [];

    for (let i = 0; i < numOfRows; i++) {
        const array: TObj[] = [];
        for (let j = 0; j < numOfCols; j++) {
            let entry = createTableEntry<TObj>(tableEntry, TLB_bits, VPN)
            array.push(entry);
        }
        entries.push(array);
    }
    return entries;
}