import './App.css'
import Tlb_table, { tlb_entry } from './components/Tlb_table/Tlb_table'
import Page_table, { page_table_entry } from './components/Page_table/Page_table';
import Input_table from './components/Input_table/Input_table';


// ------ preliminary variables
const BaseConversions = [2, 10, 16] as const;
type BaseConversionsArray = typeof BaseConversions;
export type BaseConversion = BaseConversionsArray[number];

const AddressPrefixes = ['0x', '0b'] as const;
type AddressPrefixesArray = typeof AddressPrefixes;
export type AddressPrefix = AddressPrefixesArray[number];
// ------

// TODO: make this a function that generates random data
// TLB - Translation Lookaside Buffer
const tlb_entries: Array<tlb_entry[]> = [
  [{ tag: 0x0F, ppn: 0x10, valid: 0 }, { tag: 0x11, ppn: 0x15, valid: 1 }, { tag: 0x1F, ppn: 0x2E, valid: 1 }],
  [{ tag: 0x0A, ppn: 0x11, valid: 1 }, { tag: 0x11, ppn: 0x15, valid: 0 }, { tag: 0x07, ppn: 0x12, valid: 1 }],
  [{ tag: 0x13, ppn: 0x33, valid: 1 }, { tag: 0x00, ppn: 0x00, valid: 0 }, { tag: 0x00, ppn: 0x00, valid: 1 }],
  [{ tag: 0x14, ppn: 0x21, valid: 1 }, { tag: 0x00, ppn: 0x12, valid: 0 }, { tag: 0x10, ppn: 0x0A, valid: 1 }]
];

// TODO: make this a function that generates random data
// Page Table
const page_table_entries: Array<page_table_entry[]> = [
  [{ vpn: 0x00, ppn: 0x00, valid: 1 }, { vpn: 0x21, ppn: 0x10, valid: 0 }, { vpn: 0x3f, ppn: 0x23, valid: 0 }, { vpn: 0x12, ppn: 0x34, valid: 1 }],
  [{ vpn: 0x01, ppn: 0x33, valid: 1 }, { vpn: 0x0C, ppn: 0x0D, valid: 0 }, { vpn: 0x08, ppn: 0x17, valid: 1 }, { vpn: 0x13, ppn: 0x15, valid: 1 }],
  [{ vpn: 0xA0, ppn: 0x21, valid: 0 }, { vpn: 0xFA, ppn: 0x00, valid: 1 }, { vpn: 0xA2, ppn: 0x32, valid: 0 }, { vpn: 0x03, ppn: 0x43, valid: 0 }]
];

// TLB  table kinformation
const NumTlbSets: number = tlb_entries.length;
const NumTlbWays: number = Object.keys(tlb_entries[0]).length;
const NumTlbEntries: number = NumTlbSets * NumTlbWays;

// Page table information
const PageTableSize = page_table_entries.flatMap(x => x).length;
function App() {

  return (
    <>
      <div className='wrapper'>
        <div className='wrapper-tables'>
          <Tlb_table
            tlb_entries={tlb_entries}
            addressPrefix={AddressPrefixes[0]}
            baseConversion={BaseConversions[2]}
          />

          <Page_table
            page_table_entries={page_table_entries}
            addressPrefix={AddressPrefixes[0]}
            baseConversion={BaseConversions[2]}
          />
        </div>

        <Input_table
          virtualAddress={5349}
          addressPrefix={AddressPrefixes[0]}
          baseConversion={BaseConversions[2]}
          pageSize={PageTableSize}
        />
      </div >
    </>
  )
}

export default App
