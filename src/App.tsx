import './App.css'
import Page_table, { PAGE_TABLE_ENTRY } from './components/Page_table/Page_table';
import Input_table, { InputFields } from './components/Input_table/Input_table';
import { useEffect, useState } from 'react';
import Tlb_table, { TLB_TABLE_ENTRY } from './components/Tlb_table/Tlb_table';


// --------- Glossary 
// VPN : Virtual Page Number (TLB tag + TLB index)
// PPN : Physical Page Number, PPO : Physical Page Offset
// TLB : Translation Lookaside Buffer
// VPT : Virtual Page Table , VPI : Virtual Page Index, VPO : Virtual Page Offset
// TLBI : TLB index
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
  PhysicalAddress: 'PhysicalAddress'
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
export type Result = Pick<typeof InputFieldsMap, 'TLBHIT' | 'PageFault'>[keyof Pick<typeof InputFieldsMap, 'TLBHIT' | 'PageFault'>];
export type Bit = typeof bitMap[keyof typeof bitMap];
// ------



// ----- Given parameters for exercis
const virtualAddressBitWidth = createRandomNumber(10, 14); // VAS
const physicalAddressBitWidth = createRandomNumber(10, 14); // PAS
export const TLBSets = 2 ** createRandomNumber(2, 4);
export const TLBWays = createRandomNumber(3, 5);

// divide by two because we don't want the user to be flooded with information but, 4 -> [4], 3 -> [4,8], 2 -> [4,8,16]
const possiblePageSizes = [16, 32, 64] as const;
export const pageSize = possiblePageSizes[Math.floor(Math.random() * possiblePageSizes.length)];
export const PageTableSize = createRandomNumber(3, 5); // PTS                                              

const VPO = Math.log2(pageSize);
console.log("VPO", VPO)
const TLBI = Math.log2(TLBSets);



// -----------


// ----------- Test choices
const ChosenResult: Result = InputFieldsMap.TLBHIT;
const ChosenAddressPrefix: AddressPrefix = addressPrefixMap.Hexadecimal;
const ChosenBaseConversion: BaseConversion = baseConversionMap.Hexadecimal;
// ----------- 


// ----------- Helper functions

function reverseString(str: string) {
  str.split("").reverse().join("");
}
// ------------

// create a random number from bitlength by taking a random number between
// the previous number of bits and the current max of the bits we want 
function createRandomNumberWith(bitLength: number): number {
  return createRandomNumber(2 ** (bitLength - 1), 2 ** bitLength)
}

// Create a random number between a and b
function createRandomNumber(a: number, b: number) {
  return Math.floor(Math.random() * (b - a)) + a;
}

// Function to create a TLB entry
function createTableEntry<TObj extends TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY>(entry: TObj): TObj {

  const valid: Bit = Math.floor(Math.random() * 2) as Bit;
  const ppn: number = createRandomNumber(0, 6666);
  const tag: number = createRandomNumber(0, 6666);
  const vpn: number = createRandomNumber(0, 6666);

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

function isPageTableEntry(entry: TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY): entry is PAGE_TABLE_ENTRY {
  return 'vpn' in entry;
}

// Function to create a geniric table of entries of type TLB_TABLE_ENTRY or PAGE_TABLE_ENTRY
// tlb_enty = rows = sets | column =  ways
// page_entry = rows = pageSize | column = pageTableSize ?????
function createTableEntries<TObj extends TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY>(
  numOfRows: number,
  numOfCols: number,
  tableEntry: TObj
): TObj[][] {
  const entries: TObj[][] = [];

  for (let i = 0; i < numOfCols; i++) {
    const array: TObj[] = [];
    for (let j = 0; j < numOfRows; j++) {
      let entry = createTableEntry<TObj>(tableEntry)
      array.push(entry);
    }
    entries.push(array);
  }
  return entries;
}

const generatedVirtualAddress = createRandomNumberWith(virtualAddressBitWidth);

// TLB  table information
const NumTlbEntries: number = TLBSets * TLBWays;
//const TLB_TABLE: TLB_TABLE_ENTRY[][] = createTLBEntries(TLBWays, TLBSets);
const tlbTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 });
const TLB_TABLE: TLB_TABLE_ENTRY[][] = createTableEntries<TLB_TABLE_ENTRY>(
  TLBWays,
  TLBSets,
  tlbTableEntry
);

// Page table information
const pageTableEntry = createTableEntry<PAGE_TABLE_ENTRY>({ vpn: 0, ppn: 0, valid: 0 });
const PAGE_TABLE: PAGE_TABLE_ENTRY[][] = createTableEntries<PAGE_TABLE_ENTRY>(
  4, // I chose 4 because of all the old exams all look like that. 
  //Be sure to see the page size given in those exams
  3, // I choose 3 because of all the old exams all look like that. 
  // Make sure to see the PTE's in the old exams. Hint: they are all 12 entries.
  pageTableEntry
);


function App(): JSX.Element {
  const [facit, setFacit] = useState<InputFields>(createFacit(ChosenResult));


  console.log("facit", facit)
  const testing = true;
  useEffect(() => {
    if (testing) {
      console.log('------------------------------------')
      console.log("virtualAddressBitWidth", virtualAddressBitWidth)
      console.log("physicalAddressBitWidth", physicalAddressBitWidth)
      console.log("pageSize", pageSize)
      console.log("TLBSets", TLBSets)
      console.log("TLBWays", TLBWays)
      console.log("PageTableSize", PageTableSize)
      console.log("VPO", VPO)
      console.log("TLBI", TLBI)

    }

  }, [0])


  // TODO : Add the page hit case
  // TODO: Make the facit required and complete this function
  // POSTCONDITION : sets facit object in the Facit state
  function createFacit(ChosenResult: Result): InputFields {

    const addressInBits = [...generatedVirtualAddress.toString(2)];

    const VPO_bits: string = addressInBits.splice(-VPO).join('');     // VPO_bits = the last VPO bits of the address / log2(pageSize)
    const TLBI_bits: string = addressInBits.splice(-TLBI).join('');     // TLBI_bits = the next TLBI bits of the address / log2(sets)
    const TLBT_bits: string = addressInBits.join('');     // TLBT_bits = the remaining bits of the address

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
      PhysicalAddress: ''
    }

    switch (ChosenResult) {
      case InputFieldsMap.TLBHIT:

        const index = TLB_TABLE[TLBI_value][Math.floor(Math.random() * TLB_TABLE[0].length)];
        index.tag = TLBT_value;
        index.valid = 1;
        const PPN = index.ppn.toString(16);

        facitObj = {
          VirtualAddress: generatedVirtualAddress.toString(2),
          VPN: (TLBT_value + TLBI_value).toString(16),
          TLBI: TLBI_value.toString(16),
          TLBT: TLBT_value.toString(16),
          TLBHIT: 'Y',
          PageFault: 'N',
          PPN: PPN,
          PhysicalAddress: index.ppn.toString(2) + VPO_bits // TODO bug : this becomes much longer than the random physical address in bits
        }

        break;
      case InputFieldsMap.PageFault:
        console.log("Page hit")
        break;
      // TODO: Add the page hit case
      default:
        console.log("No case found");
        break;

    }

    return facitObj;
  }


  return (
    <>
      <div className='wrapper'>
        <div className='wrapper-tables'>

          <Tlb_table
            tlb_entries={TLB_TABLE}
            addressPrefix={ChosenAddressPrefix}
            baseConversion={ChosenBaseConversion}
          />

          <Page_table
            page_table_entries={PAGE_TABLE}
            addressPrefix={ChosenAddressPrefix}
            baseConversion={ChosenBaseConversion}
          />
        </div>

        <Input_table
          VirtualAddress={generatedVirtualAddress}
          virtualAddressWidth={virtualAddressBitWidth}
          physcialAddressWidth={physicalAddressBitWidth}
          pageSize={pageSize}
          facit={facit}
          addressPrefix={ChosenAddressPrefix}
          baseConversion={ChosenBaseConversion}
        />
      </div >
    </>
  )
}

export default App
