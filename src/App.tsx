import './App.css'
import Page_table, { page_table_entry } from './components/Page_table/Page_table';
import Input_table, { InputFields } from './components/Input_table/Input_table';
import { useEffect, useState } from 'react';
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


export const InputFieldsMap = {
  VirtualAddress: 'Virtual address',
  VPN: 'VPN',
  TLBI: 'TLBI',
  TLBT: 'TLBT',
  TLBHIT: 'TLB hit',
  PageFault: 'Page fault',
  PPN: 'PPN',
  PhysicalAddress: 'Physical address'
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
export type Result = Pick<typeof InputFieldsMap, 'TLBHIT' | 'PageFault'>[keyof Pick<typeof InputFieldsMap, 'TLBHIT' | 'PageFault'>];
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

const VPO = Math.log2(pageSize);
const TLBI = Math.log2(TLBSets);

// -----------


// ----------- Test choices
const ChosenResult: Result = InputFieldsMap.TLBHIT;
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



const facitObj: InputFields = {
  VirtualAddress: '',
  VPN: '',
  TLBI: '',
  TLBT: '',
  TLBHIT: '',
  PageFault: '',
  PPN: '',
  PhysicalAddress: ''
}

function App() {
  const [facit, setFacit] = useState<InputFields>(facitObj);


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
  function createFacit(ChosenResult: Result): void {

    const addressInBits = [...generatedVirtualAddress.toString(2)];
    debugger

    const VPO_bits: string = addressInBits.splice(-VPO).join('');     // VPO_bits = the last VPO bits of the address
    const TLBI_bits: string = addressInBits.splice(-TLBI).join('');     // TLBI_bits = the next TLBI bits of the address
    const TLBT_bits: string = addressInBits.join('');     // TLBT_bits = the remaining bits of the address

    // Convert the bits to a number
    const VPO_value: number = Number(addressPrefixMap.Binary + VPO_bits);
    const TLBI_value: number = Number(addressPrefixMap.Binary + TLBI_bits);
    const TLBT_value: number = Number(addressPrefixMap.Binary + TLBT_bits);



    switch (ChosenResult) {
      case InputFieldsMap.TLBHIT:

        const index = TLB_TABLE[TLBI_value][Math.floor(Math.random() * TLB_TABLE[0].length)];
        index.tag = TLBT_value;
        index.valid = 1;
        const PPN = index.ppn.toString(2);

        setFacit({
          VirtualAddress: generatedVirtualAddress.toString(2),
          VPN: (TLBT_value + TLBI_value).toString(16),
          TLBI: TLBI_value.toString(16),
          TLBT: TLBT_value.toString(16),
          TLBHIT: 'Y',
          PageFault: 'N',
          PPN: PPN,
          PhysicalAddress: PPN + VPO_bits
        })

        console.log("facit", facit)
        break;
      case InputFieldsMap.PageFault:
        console.log("Page hit")
        break;
      // TODO: Add the page hit case
      default:
        break;
    }
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

      <button onClick={() => createFacit(ChosenResult)}>Check answers</button>
    </>
  )
}

export default App
