import Page_table, { PAGE_TABLE_ENTRY } from './components/Page_table/Page_table';
import Input_table, { InputFields } from './components/Input_table/Input_table';
import { useEffect, useState } from 'react';
import Tlb_table, { TLB_TABLE_ENTRY } from './components/Tlb_table/Tlb_table';
import Settings from './components/Settings/Settings';
import 'primereact/resources/themes/lara-light-teal/theme.css';
import 'primeicons/primeicons.css';
import './App.css'



// --------- Glossary 
// VPN : Virtual Page Number (TLB tag + TLB Index)
// PPN : Physical Page Number, PPO : Physical Page Offset
// TLB : Translation Lookaside Buffer
// VPT : Virtual Page Table , VPI : Virtual Page Index, VPO : Virtual Page Offset
// TLBI : TLB Index
// TLBT : TLB tag
// VA : Virtual Address
// ------

// ------ Types and constants
// TODO bug, PPN random address må ikke være større the bits af physicalAddressBitWidth

export const InputFieldsMap = {
  VirtualAddress: 'VirtualAddress',
  VPN: 'VPN',
  TLBI: 'TLBI',
  TLBT: 'TLBT',
  TLBHIT: 'TLBHIT',
  PageFault: 'PageFault',
  PPN: 'PPN',
  PhysicalAddress: 'PhysicalAddress',
  PageHit: 'PageHit'
} as const;

const baseConversionMap = {
  Binary: 2,
  Decimal: 10,
  Hexadecimal: 16,
} as const;

const addressPrefixMap = {
  Binary: '0b',
  Decimal: '',
  Hexadecimal: '0x'
} as const;

const bitMap = {
  Zero: 0,
  One: 1
} as const;

export type BaseConversion = typeof baseConversionMap[keyof typeof baseConversionMap];
export type AddressPrefix = typeof addressPrefixMap[keyof typeof addressPrefixMap];
export type InputField = typeof InputFieldsMap[keyof typeof InputFieldsMap];
export type Result = Pick<typeof InputFieldsMap,
  'TLBHIT' |
  'PageFault' |
  'PageHit'>[keyof Pick<typeof InputFieldsMap,
    'TLBHIT' |
    'PageFault' |
    'PageHit'>];

export type Bit = typeof bitMap[keyof typeof bitMap];
// ------

// ----------- Test choices
const ChosenAddressPrefix: AddressPrefix = addressPrefixMap.Hexadecimal;
const ChosenBaseConversion: BaseConversion = baseConversionMap.Hexadecimal;
const possiblePageSizes = [16, 32, 64] as const;
//const testing = true;

// Sorting randomized https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const randomAssignmentType = [
  InputFieldsMap.TLBHIT,
  InputFieldsMap.PageHit,
  InputFieldsMap.PageFault
]
  .sort(() => (Math.random() > .5) ? 1 : -1)[0];
// ----------- 

const empty: InputFields = {
  VirtualAddress: '',
  VPN: '',
  TLBI: '',
  TLBT: '',
  TLBHIT: '',
  PageFault: '',
  PPN: '',
  PhysicalAddress: '',
  PageHit: ''
}

/**
 * Generates a random number within a range determined by the bit length.
 *
 * @param {number} bitLength - The bit length of the number to generate.
 * @returns {number} - A random number within the range [2^(bitLength-1), 2^bitLength).
 */
export function createRandomNumberWith(bitLength: number): number {
  return createRandomNumber(2 ** (bitLength - 1), 2 ** bitLength)
}


/**
 * Generates a random number within the range [a, b).
 *
 * @param {number} a - The lower bound of the range (inclusive).
 * @param {number} b - The upper bound of the range (exclusive).
 * @returns {number} - A random number within the range [a, b).
 */
export function createRandomNumber(a: number, b: number): number {
  return Math.floor(Math.random() * (b - a)) + a;
}


/**
 * Generates a unique number that is not equal to the provided number.
 *
 * @param {number} fromNum - The number that the generated number should not be equal to.
 * @param {number} size - The bit length of the number to generate.
 * @returns {number} - A unique number that is not equal to fromNum.
 */
function createUniqe(fromNum: number, size: number): number {
  // A random address is able to be created to be the actual tag of the virtual
  // address, We have to check for that.
  let unique = createRandomNumber(0, createRandomNumberWith(size))
  // Check if the tag already exists in the TLB table
  while (unique === fromNum) {

    unique = createRandomNumber(0, createRandomNumberWith(size))
  }

  return unique;
}

/**
 * Generates a random number of TLB sets.
 *
 * @returns {number} - A random number of TLB sets, which is a power of 2.
 */
function generateTLBSets(): number {
  return 2 ** createRandomNumber(2, 4);
}

/**
 * Generates a random number of TLB ways.
 *
 * @returns {number} - A random number of TLB ways within the range [3, 5).
 */
function generateTLBWays(): number {
  return createRandomNumber(3, 5);
}


/**
 * Type guard to check if a table entry is of type PAGE_TABLE_ENTRY.
 *
 * @param {TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY} entry - The table entry to check.
 * @returns {entry is PAGE_TABLE_ENTRY} - Returns true if the entry is of type PAGE_TABLE_ENTRY, false otherwise.
 */
function isPageTableEntry(entry: TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY): entry is PAGE_TABLE_ENTRY {
  return 'vpn' in entry;
}


/**
 * Creates a table entry of type TLB_TABLE_ENTRY or PAGE_TABLE_ENTRY.
 *
 * @template TObj - The type of the table entry, which extends TLB_TABLE_ENTRY or PAGE_TABLE_ENTRY.
 * @param {TObj} entry - The initial entry object.
 * @param {string} TLBT_bits - The TLB tag bits.
 * @param {string} VPN - The Virtual Page Number.
 * @returns {TObj} - The new table entry.
 */
function createTableEntry<TObj extends TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY>(entry: TObj, TLBT_bits: string, VPN: string, randomBitLength: number): TObj {

  const valid: Bit = Math.floor(Math.random() * 2) as Bit;
  const ppn: number = createRandomNumberWith(8);
  // create unique TLBT address
  const tag: number = createUniqe(Number('0b' + TLBT_bits), randomBitLength)

  let newEntry: TObj;
  if (isPageTableEntry(entry)) {
    const vpn: number = createUniqe(Number(VPN), randomBitLength)
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


/**
 * Creates a table of entries of type TLB_TABLE_ENTRY or PAGE_TABLE_ENTRY.
 *
 * @template TObj - The type of the table entries, which extends TLB_TABLE_ENTRY or PAGE_TABLE_ENTRY.
 * @param {number} numOfRows - The number of rows in the table.
 * @param {number} numOfCols - The number of columns in the table.
 * @param {TObj} tableEntry - The initial entry object for each entry in the table.
 * @param {string} TLBT_bits - The TLB tag bits.
 * @param {string} VPN - The Virtual Page Number.
 * @param {number} randomBitLength - The random bit length the Tag and VPN will be
 * @returns {TObj[][]} - The table of entries.
 */
function createTableEntries<TObj extends TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY>(
  numOfRows: number,
  numOfCols: number,
  tableEntry: TObj,
  TLBT_bits: string,
  VPN: string,
  randomBitLength: number
): TObj[][] {
  const entries: TObj[][] = [];

  for (let i = 0; i < numOfRows; i++) {
    const array: TObj[] = [];
    for (let j = 0; j < numOfCols; j++) {
      let entry = createTableEntry<TObj>(tableEntry, TLBT_bits, VPN, randomBitLength)
      array.push(entry);
    }
    entries.push(array);
  }
  return entries;
}


function App(): JSX.Element {
  console.log('App rendered')

  const [facit, setFacit] = useState<InputFields>(empty);

  const [assignmentType, setAssignmentType] = useState<Result>(randomAssignmentType);

  const [TLBSets, setTLBSets] = useState(generateTLBSets());
  const [TLBWays, setTLBWays] = useState(generateTLBWays());

  const [pageSize, setPageSize] = useState(possiblePageSizes[Math.floor(Math.random() * possiblePageSizes.length)]);
  //const [PageTableSize, setPageTableSize] = useState(createRandomNumber(3, 5)); // PTS

  const [VPO, setVPO] = useState(Math.log2(pageSize));
  const [TLBI, setTLBI] = useState(Math.log2(TLBSets));
  const [TLB_PPN, setTLB_PPN] = useState(createRandomNumberWith(8));

  const [virtualAddressBitWidth, setVirtualAddressBitWidth] = useState(createRandomNumber(10, 14)); // VAS
  const [physicalAddressBitWidth, setPhysicalAddressBitWidth] = useState(TLB_PPN.toString(2).length + VPO);

  const [generatedVirtualAddress, setGeneratedVirtualAddress] = useState(createRandomNumberWith(virtualAddressBitWidth));
  const [addressInBits, setAddressInBits] = useState([...generatedVirtualAddress.toString(2)]);
  const deepCopy = JSON.parse(JSON.stringify(addressInBits));


  //const [VPO_bits, setVPO_bits] = useState(deepCopy.splice(-VPO).join(''));     // VPO_bits = the last VPO bits of the address / log2(pageSize)
  const [TLBI_bits, setTLBI_bits] = useState(deepCopy.splice(-TLBI).join(''));     // TLBI_bits = the next TLBI bits of the address / log2(sets)
  const [TLBT_bits, setTLBT_bits] = useState(deepCopy.join(''));
  const [VPN, setVPN] = useState<string>(Number("0b" + TLBT_bits + TLBI_bits).toString(ChosenBaseConversion));


  const tlbTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 }, TLBT_bits, VPN, virtualAddressBitWidth);
  const tlbTableEntries = createTableEntries<TLB_TABLE_ENTRY>(
    TLBSets,
    TLBWays,
    tlbTableEntry,
    TLBT_bits,
    VPN,
    virtualAddressBitWidth
  );

  const pageTableEntry = createTableEntry<PAGE_TABLE_ENTRY>({ vpn: 0, ppn: 0, valid: 0 }, TLBT_bits, VPN, virtualAddressBitWidth);
  const pageTableEntries: PAGE_TABLE_ENTRY[][] = createTableEntries<PAGE_TABLE_ENTRY>(
    3, // I choose 3 because of all the old exams all look like that. 
    // Make sure to see the PTE's in the old exams. Hint: they are all 12 entries.
    4, // I chose 4 because of all the old exams all look like that. 
    //Be sure to see the page size given in those exams
    pageTableEntry,
    TLBT_bits,
    VPN,
    virtualAddressBitWidth
  );


  const [TLBTableEntries, setTLBTableEntries] = useState<TLB_TABLE_ENTRY[][]>(tlbTableEntries);
  const [PageTableEntries, setPageTableEntries] = useState<PAGE_TABLE_ENTRY[][]>(pageTableEntries);


  // Component did mount -> set a random assignmentType
  useEffect(() => {
    setAssignmentType(randomAssignmentType);
  }, [0])



  useEffect(() => {

    const newTLBSets = generateTLBSets();
    const newTLBWays = generateTLBWays();
    const newPageSize = possiblePageSizes[Math.floor(Math.random() * possiblePageSizes.length)];
    const newPageTableSize = createRandomNumber(3, 5); // PTS

    const newVPO = Math.log2(newPageSize);
    const newTLBI = Math.log2(newTLBSets);
    const newTLB_PPN = createRandomNumberWith(8);
    const newPage_PPN = createUniqe(newTLB_PPN, 8);

    const newVirtualAddressBitWidth = createRandomNumber(10, 14); // VAS
    let newPhysicalAddressBitWidth = newTLB_PPN.toString(2).length + newVPO;


    const newGeneratedVirtualAddress = createRandomNumberWith(newVirtualAddressBitWidth);
    const newAddressInBitsOrignal = [...newGeneratedVirtualAddress.toString(2)];
    const newAddressInBits = JSON.parse(JSON.stringify(newAddressInBitsOrignal));

    const newVPO_bits = newAddressInBits.splice(-newVPO).join('');     // VPO_bits = the last VPO bits of the address / log2(pageSize)
    const newTLBI_bits = newAddressInBits.splice(-newTLBI).join('');     // TLBI_bits = the next TLBI bits of the address / log2(sets)
    const newTLBT_bits = newAddressInBits.join('');     // TLBT_bits = the remaining bits of the address

    const newVPN = Number("0b" + newTLBT_bits + newTLBI_bits).toString(ChosenBaseConversion);
    const newTLBI_value: number = Number(addressPrefixMap.Binary + newTLBI_bits);
    const newTLBT_value: number = Number(addressPrefixMap.Binary + newTLBT_bits);

    const newTLBTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 }, newTLBI_bits, newVPN, virtualAddressBitWidth);
    const newTLBTableEntries = createTableEntries<TLB_TABLE_ENTRY>(
      newTLBSets,
      newTLBWays,
      newTLBTableEntry,
      newTLBT_bits,
      newVPN,
      virtualAddressBitWidth
    );

    const newPageTableEntry = createTableEntry<PAGE_TABLE_ENTRY>({ vpn: 0, ppn: 0, valid: 0 }, newTLBI_bits, newVPN, virtualAddressBitWidth);
    const newPageTableEntries: PAGE_TABLE_ENTRY[][] = createTableEntries<PAGE_TABLE_ENTRY>(
      3, // I choose 3 because of all the old exams all look like that. 
      // Make sure to see the PTE's in the old exams. Hint: they are all 12 entries.
      4, // I chose 4 because of all the old exams all look like that. 
      //Be sure to see the page size given in those exams
      newPageTableEntry,
      newTLBT_bits,
      newVPN,
      virtualAddressBitWidth
    );


    let facitObj: InputFields = {
      VirtualAddress: '',
      VPN: '',
      TLBI: '',
      TLBT: '',
      TLBHIT: '',
      PageFault: '',
      PPN: '',
      PhysicalAddress: '',
      PageHit: ''
    }

    switch (assignmentType) {
      case InputFieldsMap.TLBHIT:
        const dummyTagIndex = Math.floor(Math.random() * newTLBTableEntries[0].length);
        const correctTagIndex = Math.floor(Math.random() * newTLBTableEntries[0].length);

        newTLBTableEntries[newTLBI_value][dummyTagIndex] = {
          tag: newTLBT_value,
          valid: 0,
          ppn: createUniqe(newTLB_PPN, 4 * 2)
        };

        newTLBTableEntries[newTLBI_value][correctTagIndex] = {
          tag: newTLBT_value,
          valid: 1,
          ppn: newTLB_PPN
        };

        console.log('TLBHIT')

        facitObj = {
          VirtualAddress: newGeneratedVirtualAddress.toString(2),
          VPN: newVPN,
          TLBI: newTLBI_value.toString(ChosenBaseConversion),
          TLBT: newTLBT_value.toString(ChosenBaseConversion),
          TLBHIT: 'Y',
          PageFault: 'N',
          PPN: newTLBTableEntries[newTLBI_value][correctTagIndex].ppn.toString(ChosenBaseConversion),
          PhysicalAddress: newTLBTableEntries[newTLBI_value][correctTagIndex].ppn.toString(2) + newVPO_bits,
          PageHit: ''
        }

        break;

      case InputFieldsMap.PageHit:
        // CASE 1: An address in the pagetable with a valid bit 1
        // CASE 2: There is a VPN with a valid bit 0 and a the same address next
        // to the first address with a valid bit 1 ( both different PPNs )
        // Create a copy of PAGE_TABLE

        // Get a random row and column
        const randomRow = Math.floor(Math.random() * newPageTableEntries.length);
        const randomCol = Math.floor(Math.random() * newPageTableEntries[0].length);

        newPhysicalAddressBitWidth = newPage_PPN.toString(2).length + newVPO;
        let amountOfZeros = 14 - newPhysicalAddressBitWidth;
        newPhysicalAddressBitWidth = amountOfZeros + newPhysicalAddressBitWidth;


        // Modify the copy
        newPageTableEntries[randomRow][randomCol] = {
          ppn: newPage_PPN,
          vpn: Number("0x" + newVPN),
          valid: 1
        };


        facitObj = {
          VirtualAddress: newGeneratedVirtualAddress.toString(2),
          VPN: newVPN,
          TLBI: newTLBI_value.toString(ChosenBaseConversion),
          TLBT: newTLBT_value.toString(ChosenBaseConversion),
          TLBHIT: 'N',
          PageFault: 'N',
          PPN: newPage_PPN.toString(ChosenBaseConversion),
          PhysicalAddress: (newPage_PPN.toString(2) + newVPO_bits).padStart(14, '0'),
          PageHit: ''
        }

        break;


      case InputFieldsMap.PageFault:
        // Case 1: VPN DOES NOT exists in Page Tables 

        // Case 2: VPN EXISTS and VALID bit is 0

        // 50% 50% of having a VPN address, but with valid bit 0
        if (Math.random() > 0.5) {
          // Create a copy of PAGE_TABLE

          // Get a random row and column
          const randomRow = Math.floor(Math.random() * newPageTableEntries.length);
          const randomCol = Math.floor(Math.random() * newPageTableEntries[0].length);

          newPageTableEntries[randomRow][randomCol] = {
            ppn: newPage_PPN,
            vpn: Number("0x" + newVPN),
            valid: 0
          };

        }

        facitObj = {
          VirtualAddress: newGeneratedVirtualAddress.toString(2),
          VPN: newVPN,
          TLBI: newTLBI_value.toString(ChosenBaseConversion),
          TLBT: newTLBT_value.toString(ChosenBaseConversion),
          TLBHIT: 'N',
          PageFault: 'Y',
          PPN: '',
          PhysicalAddress: '',
          PageHit: ''
        }

        break;

      default:
        console.log('default')
    }


    setTLBSets(newTLBSets);
    setTLBWays(newTLBWays);
    setPageSize(newPageSize);
    // setPageTableSize(newPageTableSize);
    setVPO(newVPO);
    setTLBI(newTLBI);
    setTLB_PPN(newTLB_PPN);
    setVirtualAddressBitWidth(newVirtualAddressBitWidth);
    setPhysicalAddressBitWidth(newPhysicalAddressBitWidth);
    setGeneratedVirtualAddress(newGeneratedVirtualAddress);
    setAddressInBits(newAddressInBitsOrignal);
    // setVPO_bits(newVPO_bits);
    setTLBI_bits(newTLBI_bits);
    setTLBT_bits(newTLBT_bits);
    setVPN(newVPN);
    setFacit(facitObj);

    setPageTableEntries(newPageTableEntries);
    setTLBTableEntries(newTLBTableEntries);



    console.log('------------------------------------')
    console.log("facit", facitObj)
    console.log("Assignment type: ", assignmentType)
    console.log("virtualAddressBitWidth", newVirtualAddressBitWidth)
    console.log("physicalAddressBitWidth", newPhysicalAddressBitWidth)
    console.log("TLB_PPN", newTLB_PPN)
    console.log("TLB_PPN (hex)", newTLB_PPN.toString(16))
    console.log("TLB_PPN (bin)", newTLB_PPN.toString(2))
    console.log("pageSize", newPageSize)
    console.log("TLBSets", newTLBSets)
    console.log("TLBWays", newTLBWays)
    console.log("PageTableSize", newPageTableSize)
    console.log("VPO", newVPO)
    console.log("TLBI", newTLBI)
    console.log('TLBT_bits', newTLBT_bits)
    console.log('TLBI_bits', newTLBI_bits)
    console.log('VPO_bits', newVPO_bits)
    console.log('VPN', newVPN)
    console.log('newTLBI_value', newTLBI_value)
    console.log('newTLBT_value', newTLBT_value)
  }, [assignmentType])

  useEffect(() => {
    const newPageSize = possiblePageSizes[Math.floor(Math.random() * possiblePageSizes.length)];
    // const newPageTableSize = createRandomNumber(3, 5); // PTS

    const newVPO = Math.log2(newPageSize);
    const newTLBI = Math.log2(TLBSets);
    const newTLB_PPN = createRandomNumberWith(8);
    const newPage_PPN = createUniqe(newTLB_PPN, 8);

    const newVirtualAddressBitWidth = virtualAddressBitWidth; // VAS
    let newPhysicalAddressBitWidth = newTLB_PPN.toString(2).length + newVPO;


    const newGeneratedVirtualAddress = createRandomNumberWith(newVirtualAddressBitWidth);
    const newAddressInBitsOrignal = [...newGeneratedVirtualAddress.toString(2)];
    const newAddressInBits = JSON.parse(JSON.stringify(newAddressInBitsOrignal));

    const newVPO_bits = newAddressInBits.splice(-newVPO).join('');     // VPO_bits = the last VPO bits of the address / log2(pageSize)
    const newTLBI_bits = newAddressInBits.splice(-newTLBI).join('');     // TLBI_bits = the next TLBI bits of the address / log2(sets)
    const newTLBT_bits = newAddressInBits.join('');     // TLBT_bits = the remaining bits of the address

    const newVPN = Number("0b" + newTLBT_bits + newTLBI_bits).toString(ChosenBaseConversion);
    const newTLBI_value: number = Number(addressPrefixMap.Binary + newTLBI_bits);
    const newTLBT_value: number = Number(addressPrefixMap.Binary + newTLBT_bits);

    const newTLBTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 }, newTLBI_bits, newVPN, virtualAddressBitWidth);
    const newTLBTableEntries = createTableEntries<TLB_TABLE_ENTRY>(
      TLBSets,
      TLBWays,
      newTLBTableEntry,
      newTLBT_bits,
      newVPN,
      virtualAddressBitWidth
    );

    const newPageTableEntry = createTableEntry<PAGE_TABLE_ENTRY>({ vpn: 0, ppn: 0, valid: 0 }, newTLBI_bits, newVPN, virtualAddressBitWidth);
    const newPageTableEntries: PAGE_TABLE_ENTRY[][] = createTableEntries<PAGE_TABLE_ENTRY>(
      3, // I choose 3 because of all the old exams all look like that. 
      // Make sure to see the PTE's in the old exams. Hint: they are all 12 entries.
      4, // I chose 4 because of all the old exams all look like that. 
      //Be sure to see the page size given in those exams
      newPageTableEntry,
      newTLBT_bits,
      newVPN,
      virtualAddressBitWidth
    );


    let facitObj: InputFields = {
      VirtualAddress: '',
      VPN: '',
      TLBI: '',
      TLBT: '',
      TLBHIT: '',
      PageFault: '',
      PPN: '',
      PhysicalAddress: '',
      PageHit: ''
    }

    switch (assignmentType) {
      case InputFieldsMap.TLBHIT:
        const dummyTagIndex = Math.floor(Math.random() * newTLBTableEntries[0].length);
        const correctTagIndex = Math.floor(Math.random() * newTLBTableEntries[0].length);

        newTLBTableEntries[newTLBI_value][dummyTagIndex] = {
          tag: newTLBT_value,
          valid: 0,
          ppn: createUniqe(newTLB_PPN, 4 * 2)
        };

        newTLBTableEntries[newTLBI_value][correctTagIndex] = {
          tag: newTLBT_value,
          valid: 1,
          ppn: newTLB_PPN
        };

        console.log('TLBHIT')

        facitObj = {
          VirtualAddress: newGeneratedVirtualAddress.toString(2),
          VPN: newVPN,
          TLBI: newTLBI_value.toString(ChosenBaseConversion),
          TLBT: newTLBT_value.toString(ChosenBaseConversion),
          TLBHIT: 'Y',
          PageFault: 'N',
          PPN: newTLBTableEntries[newTLBI_value][correctTagIndex].ppn.toString(ChosenBaseConversion),
          PhysicalAddress: newTLBTableEntries[newTLBI_value][correctTagIndex].ppn.toString(2) + newVPO_bits,
          PageHit: ''
        }

        break;

      case InputFieldsMap.PageHit:
        // CASE 1: An address in the pagetable with a valid bit 1
        // CASE 2: There is a VPN with a valid bit 0 and a the same address next
        // to the first address with a valid bit 1 ( both different PPNs )
        // Create a copy of PAGE_TABLE

        // Get a random row and column
        const randomRow = Math.floor(Math.random() * newPageTableEntries.length);
        const randomCol = Math.floor(Math.random() * newPageTableEntries[0].length);

        newPhysicalAddressBitWidth = newPage_PPN.toString(2).length + newVPO;
        let amountOfZeros = 14 - newPhysicalAddressBitWidth;
        newPhysicalAddressBitWidth = amountOfZeros + newPhysicalAddressBitWidth;


        // Modify the copy
        newPageTableEntries[randomRow][randomCol] = {
          ppn: newPage_PPN,
          vpn: Number("0x" + newVPN),
          valid: 1
        };


        facitObj = {
          VirtualAddress: newGeneratedVirtualAddress.toString(2),
          VPN: newVPN,
          TLBI: newTLBI_value.toString(ChosenBaseConversion),
          TLBT: newTLBT_value.toString(ChosenBaseConversion),
          TLBHIT: 'N',
          PageFault: 'N',
          PPN: newPage_PPN.toString(ChosenBaseConversion),
          PhysicalAddress: (newPage_PPN.toString(2) + newVPO_bits).padStart(14, '0'),
          PageHit: ''
        }

        break;


      case InputFieldsMap.PageFault:
        // Case 1: VPN DOES NOT exists in Page Tables 

        // Case 2: VPN EXISTS and VALID bit is 0

        // 50% 50% of having a VPN address, but with valid bit 0
        if (Math.random() > 0.5) {
          // Create a copy of PAGE_TABLE

          // Get a random row and column
          const randomRow = Math.floor(Math.random() * newPageTableEntries.length);
          const randomCol = Math.floor(Math.random() * newPageTableEntries[0].length);

          newPageTableEntries[randomRow][randomCol] = {
            ppn: newPage_PPN,
            vpn: Number("0x" + newVPN),
            valid: 0
          };

        }

        facitObj = {
          VirtualAddress: newGeneratedVirtualAddress.toString(2),
          VPN: newVPN,
          TLBI: newTLBI_value.toString(ChosenBaseConversion),
          TLBT: newTLBT_value.toString(ChosenBaseConversion),
          TLBHIT: 'N',
          PageFault: 'Y',
          PPN: '',
          PhysicalAddress: '',
          PageHit: ''
        }

        break;

      default:
        console.log('default')
    }


    setPageSize(newPageSize);
    // setPageTableSize(newPageTableSize);
    setVPO(newVPO);
    setTLBI(newTLBI);
    setTLB_PPN(newTLB_PPN);
    setVirtualAddressBitWidth(newVirtualAddressBitWidth);
    setPhysicalAddressBitWidth(newPhysicalAddressBitWidth);
    setGeneratedVirtualAddress(newGeneratedVirtualAddress);
    setAddressInBits(newAddressInBitsOrignal);
    // setVPO_bits(newVPO_bits);
    setTLBI_bits(newTLBI_bits);
    setTLBT_bits(newTLBT_bits);
    setVPN(newVPN);
    setFacit(facitObj);

    setPageTableEntries(newPageTableEntries);
    setTLBTableEntries(newTLBTableEntries);


  }, [TLBWays, TLBSets, virtualAddressBitWidth])



  return (
    <>
      <Settings
        assignmentType={assignmentType}
        setAssignmentType={setAssignmentType}
        TLBWays={TLBWays}
        setTLBWays={setTLBWays}
        TLBSets={TLBSets}
        setTLBSets={setTLBSets}
        pageSize={pageSize}
        setPageSize={setPageSize}
        virtualAddressBitWidth={virtualAddressBitWidth}
        setVirtualAddressBitWidth={setVirtualAddressBitWidth}
        physicalAddressBitWidth={physicalAddressBitWidth}
        setPhysicalAddressBitWidth={setPhysicalAddressBitWidth}
      />

      <div className='wrapper'>
        <div className='wrapper-tables'>

          <Tlb_table
            tlb_entries={TLBTableEntries}
            addressPrefix={ChosenAddressPrefix}
            baseConversion={ChosenBaseConversion}
            TLBSets={TLBSets}
            TLBWays={TLBWays}
          />

          <Page_table
            page_table_entries={PageTableEntries}
            addressPrefix={ChosenAddressPrefix}
            baseConversion={ChosenBaseConversion}
            pageSize={pageSize}
          />
        </div>

        <Input_table
          VirtualAddress={generatedVirtualAddress}
          virtualAddressWidth={virtualAddressBitWidth}
          physcialAddressWidth={physicalAddressBitWidth}
          facit={facit}
          addressPrefix={ChosenAddressPrefix}
          baseConversion={ChosenBaseConversion}
          assignmentType={assignmentType}
        />
      </div>
    </>
  )
}


export default App
