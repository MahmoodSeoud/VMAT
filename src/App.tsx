import './App.css'
import Page_table, { page_table_entry } from './components/Page_table/Page_table';
import Input_table, { InputFields } from './components/Input_table/Input_table';
import { useEffect } from 'react';
import Tlb_table, { tlb_entry } from './components/Tlb_table/Tlb_table';


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

const resultsMap = {
  Tlb_hit: 'TLB hit',
  Page_hit: 'Page hit',
  Page_fault: 'Page fault'
}

export type BaseConversion = typeof baseConversionMap[keyof typeof baseConversionMap];
export type AddressPrefix = typeof addressPrefixMap[keyof typeof addressPrefixMap];
export type Results = typeof resultsMap[keyof typeof resultsMap];
export type Bit = typeof bitMap[keyof typeof bitMap];
// ------


// ----- Given parameters for exercis
const virtualAddressBitWidth = createRandomNumber(10, 14); // VAS
const physicalAddressBitWidth = createRandomNumber(10, 14); // PAS
const TLBSets = 2 ** createRandomNumber(2, 4);
const TLBWays = createRandomNumber(3, 5);

// divide by two because we don't want the user to be flooded with information but, 4 -> [4], 3 -> [4,8], 2 -> [4,8,16]
const pageSize = 2 ** createRandomNumber(2, Math.min(virtualAddressBitWidth, physicalAddressBitWidth) / 3);
const PageTableSize = createRandomNumber(3, 5); // PTS                                              
// -----------


// ----------- Test choices
const ChosenResult: Results = resultsMap.Tlb_hit;
const ChosenAddressPrefix: AddressPrefix = addressPrefixMap.Hexadecimal;
const ChosenBaseConversion: BaseConversion = baseConversionMap.Hexadecimal;
// ----------- 

function reverseString(str: string) {
  str.split("").reverse().join("");
}

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
function createTLBEntry(
  tag: number = createRandomNumber(0, 6666),
  ppn: number = createRandomNumber(0, 6666),
  valid: Bit = Math.floor(Math.random() * 2) as Bit
): tlb_entry {
  return {
    tag: tag,
    ppn: ppn,
    valid: valid
  }
}

// Function to create a TLB table
function createTLBEntries(numOfWays: number, numOfSets: number): tlb_entry[][] {
  const entries: tlb_entry[][] = [];

  for (let i = 0; i < numOfSets; i++) {
    const array: tlb_entry[] = [];

    for (let j = 0; j < numOfWays; j++) {
      array.push(createTLBEntry());
    }
    entries.push(array);
  }
  return entries;
}

// Function to create a page table
function createPageTable(pageTableSize: number, pageSize: number): page_table_entry[][] {
  const entries: page_table_entry[][] = [];

  for (let i = 0; i < pageTableSize; i++) {
    const array: page_table_entry[] = [];

    for (let j = 0; j < pageSize; j++) {
      array.push({
        vpn: createRandomNumber(0, 6666),
        ppn: createRandomNumber(0, 6666),
        valid: Math.floor(Math.random() * 2) as Bit
      });
    }

    entries.push(array);
  }

  return entries;
}


const generatedVirtualAddress = createRandomNumberWith(virtualAddressBitWidth)

// TLB  table information
const NumTlbEntries: number = TLBSets * TLBWays;
const TLB_TABLE: tlb_entry[][] = createTLBEntries(TLBWays, TLBSets);

// Page table information
const PAGE_TABLE: page_table_entry[][] = createPageTable(PageTableSize, pageSize)

let facit: InputFields = {
  VirtualAddress: '',
  VPN: '',
  PhysicalAddress: '',
  TLBI: '',
  TLBT: '',
  TLBHIT: false,
  PageFault: false,
  PPN: ''
}

switch (ChosenResult) {
  case resultsMap.Tlb_hit:


    const VPO = Math.log2(pageSize)
    const TLBI = Math.log2(TLBSets)

    const VPO_bits: string = [...generatedVirtualAddress.toString(2)].slice(-VPO).join('');
    const TLBI_bits: string = [...generatedVirtualAddress.toString(2)].slice(-VPO - TLBI, TLBI).join('');
    const TLBT_bits: string = [...generatedVirtualAddress.toString(2)].slice(0, -VPO - TLBI).join('');

    const randomIndex = TLB_TABLE[Math.floor(Math.random() * TLB_TABLE.length)][Math.floor(Math.random() * TLB_TABLE[0].length)];
    randomIndex.tag = Number(TLBT_bits);
    randomIndex.valid = 1;
    const ppn = randomIndex.ppn.toString(2);


    facit = {
      VirtualAddress: generatedVirtualAddress.toString(2),
      VPN: TLBT_bits + TLBI_bits,
      TLBI: TLBI_bits,
      TLBT: TLBT_bits,
      TLBHIT: true,
      PageFault: false,
      PPN: '',
      PhysicalAddress: reverseString(ppn) + VPO_bits
    }


    console.log("VPO", VPO)
    console.log("TLBI", TLBI)
    console.log("generatedVirtualAddress", generatedVirtualAddress)
    console.log("VPO_bits", VPO_bits)
    console.log("TLBI_bits", TLBI_bits)
    console.log("TLBT_bits", TLBT_bits)
    console.log("generatedVirtualAddress2", generatedVirtualAddress)

    break;
  case resultsMap.Page_hit:
    console.log("Page hit")
    break;
  case resultsMap.Page_fault:
    console.log("Page fault")
    break;
  default:
    break;
}


function App() {

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
    }

  }, [])

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
