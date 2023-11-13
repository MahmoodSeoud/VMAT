import './App.css'
import Page_table, { PAGE_TABLE_ENTRY } from './components/Page_table/Page_table';
import Input_table, { InputFields } from './components/Input_table/Input_table';
import { RefObject, useEffect, useMemo, useState } from 'react';
import Tlb_table, { TLB_TABLE_ENTRY } from './components/Tlb_table/Tlb_table';
import { Dropdown } from 'primereact/dropdown';


import 'primeicons/primeicons.css';
import { SelectItemOptionsType } from 'primereact/selectitem';
import Settings from './components/Settings/Settings';



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
// TODO: add the PageHit case

export type Result = Pick<typeof InputFieldsMap, 'TLBHIT' | 'PageFault' | 'PageHit'>[keyof Pick<typeof InputFieldsMap, 'TLBHIT' | 'PageFault' | 'PageHit'>];
export type Bit = typeof bitMap[keyof typeof bitMap];
// ------

// ----------- Test choices
const ChosenAddressPrefix: AddressPrefix = addressPrefixMap.Hexadecimal;
const ChosenBaseConversion: BaseConversion = baseConversionMap.Hexadecimal;
const testing = true;

// Sorting randomized https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const randomAssignmentType = [
  // InputFieldsMap.PageHit,
  InputFieldsMap.TLBHIT,
  // InputFieldsMap.PageFault
]
  .sort(() => (Math.random() > .5) ? 1 : -1)[0];
// ----------- 

// ----- Given parameters for exercis

let TLBSets = generateTLBSets();
let TLBWays = generateTLBWays();

const possiblePageSizes = [16, 32, 64] as const;
let pageSize = possiblePageSizes[Math.floor(Math.random() * possiblePageSizes.length)];
let PageTableSize = createRandomNumber(3, 5); // PTS                                              

let VPO = Math.log2(pageSize);
let TLBI = Math.log2(TLBSets);
let TLB_PPN = createRandomNumberWith(8);
let Page_PPN = createUniqe(TLB_PPN, 8)

let virtualAddressBitWidth = createRandomNumber(10, 14); // VAS
let physicalAddressBitWidth = TLB_PPN.toString(2).length + VPO;

let generatedVirtualAddress = createRandomNumberWith(virtualAddressBitWidth);
let addressInBits = [...generatedVirtualAddress.toString(2)];

let VPO_bits: string = addressInBits.splice(-VPO).join('');     // VPO_bits = the last VPO bits of the address / log2(pageSize)
let TLBI_bits: string = addressInBits.splice(-TLBI).join('');     // TLBI_bits = the next TLBI bits of the address / log2(sets)
let TLBT_bits: string = addressInBits.join('');     // TLBT_bits = the remaining bits of the address
let VPN = Number("0b" + TLBT_bits + TLBI_bits).toString(ChosenBaseConversion);
// ------ -Helper functions

// create a random number from bitlength by taking a random number between
// the previous number of bits and the current max of the bits we want 
export function createRandomNumberWith(bitLength: number): number {
  return createRandomNumber(2 ** (bitLength - 1), 2 ** bitLength)
}

// Create a random number between a and b
function createRandomNumber(a: number, b: number) {
  return Math.floor(Math.random() * (b - a)) + a;
}

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

function generateTLBSets(): number {
  return 2 ** createRandomNumber(2, 4);
}

function generateTLBWays(): number {
  return createRandomNumber(3, 5);
}

// -----------------


function isPageTableEntry(entry: TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY): entry is PAGE_TABLE_ENTRY {
  return 'vpn' in entry;
}

let empty: InputFields = {
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


// Function to create a TLB entry
function createTableEntry<TObj extends TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY>(entry: TObj, TLBT_bits: string, VPN: string): TObj {

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
function createTableEntries<TObj extends TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY>(
  numOfRows: number,
  numOfCols: number,
  tableEntry: TObj,
  TLBT_bits: string,
  VPN: string
): TObj[][] {
  const entries: TObj[][] = [];

  for (let i = 0; i < numOfRows; i++) {
    const array: TObj[] = [];
    for (let j = 0; j < numOfCols; j++) {
      let entry = createTableEntry<TObj>(tableEntry, TLBT_bits, VPN)
      array.push(entry);
    }
    entries.push(array);
  }
  return entries;
}


function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


function App(): JSX.Element {
  console.log('App rendered')
  const [assignmentType, setAssignmentType] = useState<Result>(randomAssignmentType);
  const [hasClearedInput, setHasClearedInput] = useState<boolean>(false);


  // TLB  table information
  const tlbTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 }, TLBI_bits, VPN);
  const tlbTableEntries = useMemo(() => createTableEntries<TLB_TABLE_ENTRY>(
    TLBSets,
    TLBWays,
    tlbTableEntry,
    TLBT_bits,
    VPN
  ), [TLBSets, TLBWays, tlbTableEntry]);

  const pageTableEntry = createTableEntry<PAGE_TABLE_ENTRY>({ vpn: 0, ppn: 0, valid: 0 }, TLBI_bits, VPN);
  const PageTableEntries: PAGE_TABLE_ENTRY[][] = useMemo(() => createTableEntries<PAGE_TABLE_ENTRY>(
    3, // I choose 3 because of all the old exams all look like that. 
    // Make sure to see the PTE's in the old exams. Hint: they are all 12 entries.
    4, // I chose 4 because of all the old exams all look like that. 
    //Be sure to see the page size given in those exams
    pageTableEntry,
    TLBT_bits,
    VPN
  ), [pageTableEntry]);



  const facit = useMemo(() => {
    TLBSets = generateTLBSets();
    TLBWays = generateTLBWays();

    pageSize = possiblePageSizes[Math.floor(Math.random() * possiblePageSizes.length)];
    PageTableSize = createRandomNumber(3, 5); // PTS                                              

    VPO = Math.log2(pageSize);
    TLBI = Math.log2(TLBSets);
    TLB_PPN = createRandomNumberWith(8);
    Page_PPN = createUniqe(TLB_PPN, 8)


    virtualAddressBitWidth = createRandomNumber(10, 14); // VAS
    physicalAddressBitWidth = TLB_PPN.toString(2).length + VPO;


    generatedVirtualAddress = createRandomNumberWith(virtualAddressBitWidth);
    addressInBits = [...generatedVirtualAddress.toString(2)];

    VPO_bits = addressInBits.splice(-VPO).join('');     // VPO_bits = the last VPO bits of the address / log2(pageSize)
    TLBI_bits = addressInBits.splice(-TLBI).join('');     // TLBI_bits = the next TLBI bits of the address / log2(sets)
    TLBT_bits = addressInBits.join('');     // TLBT_bits = the remaining bits of the address


    VPN = Number("0b" + TLBT_bits + TLBI_bits).toString(ChosenBaseConversion);
    
    return empty
  }, [assignmentType])


  // TODO : Add the page hit case
  // TODO: Make the facit required and complete this function
  // POSTCONDITION : sets facit object in the Facit state
  function createFacit(): InputFields {
    // Reset the user input

    // Convert the bits to a number
    const TLBI_value: number = Number(addressPrefixMap.Binary + TLBI_bits);
    const TLBT_value: number = Number(addressPrefixMap.Binary + TLBT_bits);

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
        shuffle(tlbTableEntries)
        const correctTagIndex = Math.floor(Math.random() * tlbTableEntries[0].length);
        const dummyTagIndex = createUniqe(correctTagIndex, Math.floor(Math.random() * tlbTableEntries[0].length));

        tlbTableEntries[TLBI_value][correctTagIndex] = {
          tag: TLBT_value,
          valid: 1,
          ppn: TLB_PPN
        };

        tlbTableEntries[TLBI_value][dummyTagIndex] = {
          tag: TLBT_value,
          valid: 0,
          ppn: createUniqe(TLB_PPN, 4 * 2)
        };

        console.log('TLBHIT')

        return facitObj = {
          VirtualAddress: generatedVirtualAddress.toString(2),
          VPN: VPN,
          TLBI: TLBI_value.toString(ChosenBaseConversion),
          TLBT: TLBT_value.toString(ChosenBaseConversion),
          TLBHIT: 'Y',
          PageFault: 'N',
          PPN: tlbTableEntries[TLBI_value][correctTagIndex].ppn.toString(ChosenBaseConversion),
          PhysicalAddress: tlbTableEntries[TLBI_value][correctTagIndex].ppn.toString(2) + VPO_bits,
          PageHit: ''
        }





      default:
        console.log('default')
        return facitObj
    }

    /* switch (assignmentType) {
      case InputFieldsMap.TLBHIT:
        // Step 1: Create a deep copy of the TLB table
        const tlbTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 }, TLBI_bits, VPN);
        const tlbTableEntries = createTableEntries<TLB_TABLE_ENTRY>(TLBSets, TLBWays, tlbTableEntry, TLBT_bits, VPN);
  
        // Step 2: Generate the correctIndex and dummyIndex
        const correctTagIndex = Math.floor(Math.random() * tlbTableEntries[0].length);
        const dummyTagIndex = createUniqe(correctTagIndex, Math.floor(Math.random() * tlbTableEntries[0].length));
  
        // Create a copy of the row
        const newRow = [...tlbTableEntries[TLBI_value]];
  
        // Modify the copy
        newRow[correctTagIndex] = {
          tag: TLBT_value,
          valid: 1,
          ppn: TLB_PPN
        };
  
        newRow[dummyTagIndex] = {
          tag: TLBT_value,
          valid: 0,
          ppn: createUniqe(TLB_PPN, 4 * 2)
        };
  
        // Replace the row in the table
        tlbTableEntries[TLBI_value] = newRow;
  
        // Update the state with the modified copy
        setTLB_TABLE(tlbTableEntries);
  
  
        facitObj = {
          VirtualAddress: generatedVirtualAddress.toString(2),
          VPN: VPN,
          TLBI: TLBI_value.toString(ChosenBaseConversion),
          TLBT: TLBT_value.toString(ChosenBaseConversion),
          TLBHIT: 'Y',
          PageFault: 'N',
          PPN: tlbTableEntries[TLBI_value][correctTagIndex].ppn.toString(ChosenBaseConversion),
          PhysicalAddress: tlbTableEntries[TLBI_value][correctTagIndex].ppn.toString(2) + VPO_bits,
          PageHit: ''
        }
  
  
        break;
      case InputFieldsMap.PageFault:
        // Case 1: VPN DOES NOT exists in Page Tables 
  
        // Case 2: VPN EXISTS and VALID bit is 0
  
        // 50% 50% of having a VPN address, but with valid bit 0
        if (Math.random() > 0.5) {
          // Create a copy of PAGE_TABLE
          const newPageTable = [...PAGE_TABLE];
  
          // Get a random row and column
          const randomRow = Math.floor(Math.random() * newPageTable.length);
          const randomCol = Math.floor(Math.random() * newPageTable[0].length);
  
          // Modify the copy
          newPageTable[randomRow][randomCol] = {
            ...newPageTable[randomRow][randomCol],
            vpn: Number("0x" + VPN),
            valid: 0
          };
  
          // Update the state with the modified copy
          setPAGE_TABLE(newPageTable);
        }
  
        facitObj = {
          VirtualAddress: generatedVirtualAddress.toString(2),
          VPN: VPN,
          TLBI: TLBI_value.toString(ChosenBaseConversion),
          TLBT: TLBT_value.toString(ChosenBaseConversion),
          TLBHIT: 'N',
          PageFault: 'Y',
          PPN: '',
          PhysicalAddress: '',
          PageHit: ''
        }
  
        break;
      case InputFieldsMap.PageHit:
        // CASE 1: An address in the pagetable with a valid bit 1
        // CASE 2: There is a VPN with a valid bit 0 and a the same address next
        // to the first address with a valid bit 1 ( both different PPNs )
        // Create a copy of PAGE_TABLE
        const newPageTable = [...PAGE_TABLE];
  
        // Get a random row and column
        const randomRow = Math.floor(Math.random() * newPageTable.length);
        const randomCol = Math.floor(Math.random() * newPageTable[0].length);
  
        // Modify the copy
        newPageTable[randomRow][randomCol] = {
          ...newPageTable[randomRow][randomCol],
          ppn: Page_PPN,
          vpn: Number("0x" + VPN),
          valid: 1
        };
  
        // Update the state with the modified copy
        setPAGE_TABLE(newPageTable);
        facitObj = {
          VirtualAddress: generatedVirtualAddress.toString(2),
          VPN: VPN,
          TLBI: TLBI_value.toString(ChosenBaseConversion),
          TLBT: TLBT_value.toString(ChosenBaseConversion),
          TLBHIT: 'N',
          PageFault: 'N',
          PPN: Page_PPN.toString(ChosenBaseConversion),
          PhysicalAddress: Page_PPN.toString(2) + VPO_bits,
          PageHit: ''
        }
        break;
      default:
        break;
  
    } */
    return facitObj;
  }

  // TODO: Add the third chosen result case



  return (
    <>

      <Settings
        setAssignmentType={setAssignmentType}

      />

      <div
        className=''
      >

      </div>
      <div className='wrapper'>


        <div className='wrapper-tables'>

          <Tlb_table
            tlb_entries={tlbTableEntries}
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
        />
      </div >
    </>
  )
}

export default App
