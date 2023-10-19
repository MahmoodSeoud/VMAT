import './App.css'
import Tlb_table, { tlb_entry } from './components/Tlb_table/Tlb_table'
import Page_table, { page_table_entry } from './components/Page_table/Page_table';

// TODO: make this a function that generates random data
// TLB - Translation Lookaside Buffer
const tlb_entries: tlb_entry[][] = [
  [ { tag: 0x0F, ppn: 0x10, valid: 0 }, { tag: 0x11, ppn: 0x15, valid: 1 }, { tag: 0x1F, ppn: 0x2E, valid: 1 } ],
  [ { tag: 0x0A, ppn: 0x11, valid: 1 }, { tag: 0x11, ppn: 0x15, valid: 0 }, { tag: 0x07, ppn: 0x12, valid: 1 } ],
  [ { tag: 0x13, ppn: 0x33, valid: 1 }, { tag: 0x00, ppn: 0x00, valid: 0 }, { tag: 0x00, ppn: 0x00, valid: 1 } ],
  [ { tag: 0x14, ppn: 0x21, valid: 1 }, { tag: 0x00, ppn: 0x12, valid: 0 }, { tag: 0x10, ppn: 0x0A, valid: 1 } ]
];

const num_tlb_sets: number = tlb_entries.length;
const num_tlb_ways: number = Object.keys(tlb_entries[0]).length;
// TODO: make this a function that generates random data
// Page Table
const page_table_entries: page_table_entry[] = [
  { ppn: 0x00, valid: 1, vpn: 0 },
  { ppn: 0x21, valid: 0, vpn: 0 },
  { ppn: 0x3f, valid: 0, vpn: 0 },
  { ppn: 0x12, valid: 1, vpn: 0 },
  { ppn: 0x01, valid: 1, vpn: 0 },
  { ppn: 0x0C, valid: 0, vpn: 0 },
  { ppn: 0x08, valid: 1, vpn: 0 },
  { ppn: 0x13, valid: 1, vpn: 0 },
  { ppn: 0xA0, valid: 0, vpn: 0 },
  { ppn: 0xFA, valid: 1, vpn: 0 },
  { ppn: 0xA2, valid: 0, vpn: 0 },
  { ppn: 0x03, valid: 0, vpn: 0 }
];;

const page_table_size = page_table_entries.length;


function App() {

  return (
    <>
      <Tlb_table
        tlb_entries={tlb_entries}
        num_tlb_sets={num_tlb_sets}
        num_tlb_ways={num_tlb_ways}
      />

{/*       <Page_table
        page_table_entries={page_table_entries}
        page_table_size={page_table_size}
        num_ptes={0}
      /> */}
    </>
  )
}

export default App
