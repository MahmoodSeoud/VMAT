import './App.css'
import Page_table, { page_table_entry } from './components/Page_table/Page_table';
import Input_table from './components/Input_table/Input_table';
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

// ------ preliminary variables
const BaseConversions = [2, 10, 16] as const;
type BaseConversionsArray = typeof BaseConversions;
export type BaseConversion = BaseConversionsArray[number];
const ChosenBaseConversion = BaseConversions[2]

const AddressPrefixes = ['0b', '', '0x'] as const;
type AddressPrefixesArray = typeof AddressPrefixes;
export type AddressPrefix = AddressPrefixesArray[number];
const ChosenAddressPrefix = AddressPrefixes[2]

const Bits = [0, 1] as const;
type BitsArray = typeof Bits;
export type Bit = BitsArray[number];

const Results = ['TLB_hit', 'Page_hit', 'Page_miss'] as const;
type ResultsArray = typeof Results;
export type Result = ResultsArray[number];
// ------


// ----- Given parameters for exercis
const virtualAddressBitWidth = createRandomNumber(10, 14); // VAS
const physicalAddressBitWidth = createRandomNumber(10, 14); // PAS
const TLBSets = createRandomNumber(3, 8);
const TLBWays = createRandomNumber(3, 5);

// divide by two because we don't want the user to be flooded with information
const pageSize = createRandomNumber(2, Math.min(virtualAddressBitWidth, physicalAddressBitWidth)/2);
const PageTableSize = createRandomNumber(3, 5); // PTS
const ExerciserResult: string = 'TLB_hit'
// -----------



// create a random number from bitlength by taking a random number between
// the previous number of bits and the current max of the bits we want 
function createRandomNumberWith(bitLength: number) : number {
  return createRandomNumber(2**(bitLength-1), 2**bitLength)
}


// Create a random number between a and b
function createRandomNumber(a: number, b: number) {
  return Math.floor(Math.random() * (b - a)) + a;
}

function createTLBEntry(
                        tag : number = createRandomNumber(0, 6666), 
                        ppn : number = createRandomNumber(0, 6666), 
                        valid : Bit = Math.floor(Math.random() * 2) as Bit
                      ) : tlb_entry {
  return {
    tag: tag,
    ppn : ppn,
    valid: valid
  }
}

function createTLBEntries(numOfWays: number, numOfSets: number) : tlb_entry[][] {
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

function createPageTable(pageTableSize: number, pageSize : number) : page_table_entry[][] {
  const entries: page_table_entry[][] = [];  
 
  for (let i = 0; i < pageTableSize; i++) {
    const array: page_table_entry[] = [];

    for (let j = 0; j < pageSize; j++) {
      array.push({
        vpn: createRandomNumber(0, 6666),
        ppn : createRandomNumber(0, 6666),
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
const TLB_TABLE : tlb_entry[][] = createTLBEntries(TLBWays, TLBSets);

// Page table information
const PAGE_TABLE : page_table_entry[][] = createPageTable(PageTableSize, pageSize)



switch (ExerciserResult) {
  case Results[0]:
      generatedVirtualAddress

      const VPO =  Math.log2(pageSize)
      const VPO_bits = generatedVirtualAddress << VPO
      const TLBI = Math.log2(TLBSets)
      const TLBT = Number(String(generatedVirtualAddress).slice(0, TLBI + VPO))



      TLB_TABLE[Math.floor(Math.random() * TLB_TABLE.length)][Math.floor(Math.random() * TLB_TABLE[0].length)].tag = TLBT;
      TLB_TABLE[0][0].valid = 1;


      console.log("VPO", VPO)
      console.log("TLBI", TLBI)
      console.log("TLBT", TLBT)


    break;
  case Results[1]:
    console.log("Page hit")
    break;
  case Results[2]:
    console.log("Page fault")
    break;
  default:
    break;
}


function App() {

const testing = true;
  useEffect(() => {
    if (testing) {
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
          virtualAddress={generatedVirtualAddress}
          virtualAddressWidth={virtualAddressBitWidth}
          physcialAddressWidth={physicalAddressBitWidth}
          pageSize={pageSize}
          addressPrefix={ChosenAddressPrefix}
          baseConversion={ChosenBaseConversion}
        />
      </div >
    </>
  )
}

export default App
