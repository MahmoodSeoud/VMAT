import './App.css'
import Page_table, { page_table_entry } from './components/Page_table/Page_table';
import Input_table from './components/Input_table/Input_table';
import { useEffect } from 'react';
import Tlb_table, { tlb_entry } from './components/Tlb_table/Tlb_table';


// ------ preliminary variables
const BaseConversions = [2, 10, 16] as const;
type BaseConversionsArray = typeof BaseConversions;
export type BaseConversion = BaseConversionsArray[number];

const AddressPrefixes = ['0x', '0b'] as const;
type AddressPrefixesArray = typeof AddressPrefixes;
export type AddressPrefix = AddressPrefixesArray[number];

const Bits = [0, 1] as const;
type BitsArray = typeof Bits;
export type Bit = BitsArray[number];

const Results = ['TLB_hit', 'Page_hit', 'Page_miss'] as const;
type ResultsArray = typeof Results;
export type Result = ResultsArray[number];
// ------


// ----- Given parameters for exercis
const virtualAddressBitWidth = createRandomNumber(10, 14);
const physicalAddressBitWidth = createRandomNumber(10, 14);
const pageSize = createRandomNumber(2, Math.min(virtualAddressBitWidth, physicalAddressBitWidth));
const TLBSets = 2 ** createRandomNumber(1, 4);
const TLBWays = 2 ** createRandomNumber(2, 4);
const PageTableSize = 2 ** createRandomNumber(2, 4); // PTS
// -----------


// create a random number from bitlength by taking a random number between
// the previous number of bits and the current max of the bits we want 
function createRandomNumberWith(bitLength: number) : number {
  return createRandomNumber(2**(bitLength-1), 2**bitLength)
}


function createRandomNumber(a: number, b: number) {
  // Random number between a and b
  return Math.floor(Math.random() * (b - a)) + a;
}

function createTLBEntries(numOfWays: number, numOfSets: number) : tlb_entry[][] {
  const entries: tlb_entry[][] = [];  
 
  for (let i = 0; i < numOfSets; i++) {
    const array: tlb_entry[] = [];

    for (let j = 0; j < numOfWays; j++) {
      array.push({
        tag: createRandomNumber(0, 6666),
        ppn : createRandomNumber(0, 6666),
        valid: Math.floor(Math.random() * 2) as Bit
      });
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

// Tlb hit
const ExerciserResult: Result = Results[0];

// TLB  table information
const NumTlbEntries: number = TLBSets * TLBWays;
const TLB_TABLE : tlb_entry[][] = createTLBEntries(TLBWays, TLBSets);

// Page table information
const PAGE_TABLE : page_table_entry[][] = createPageTable(PageTableSize, pageSize)

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
            addressPrefix={AddressPrefixes[0]}
            baseConversion={BaseConversions[2]}
          />

          <Page_table
            page_table_entries={PAGE_TABLE}
            addressPrefix={AddressPrefixes[0]}
            baseConversion={BaseConversions[2]}
          />
        </div>

        <Input_table
          virtualAddress={createRandomNumberWith(virtualAddressBitWidth)}
          virtualAddressWidth={virtualAddressBitWidth}
          physcialAddressWidth={physicalAddressBitWidth}
          pageSize={pageSize}
          addressPrefix={AddressPrefixes[0]}
          baseConversion={BaseConversions[2]}
        />
      </div >
    </>
  )
}

export default App
