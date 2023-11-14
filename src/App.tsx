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

    console.log('unique === fromNum')
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

const possiblePageSizes = [16, 32, 64] as const;

function App(): JSX.Element {
  console.log('App rendered')

 const [facit, setFacit] = useState<InputFields>(empty);

  const [assignmentType, setAssignmentType] = useState<Result>(randomAssignmentType);
  const [hasClearedInput, setHasClearedInput] = useState<boolean>(false);

  const [TLBSets, setTLBSets] = useState(generateTLBSets());
  const [TLBWays, setTLBWays] = useState(generateTLBWays());

  const [pageSize, setPageSize] = useState(possiblePageSizes[Math.floor(Math.random() * possiblePageSizes.length)]);
  const [PageTableSize, setPageTableSize] = useState(createRandomNumber(3, 5)); // PTS

  const [VPO, setVPO] = useState(Math.log2(pageSize));
  const [TLBI, setTLBI] = useState(Math.log2(TLBSets));
  const [TLB_PPN, setTLB_PPN] = useState(createRandomNumberWith(8));
  const [Page_PPN, setPage_PPN] = useState(createUniqe(TLB_PPN, 8));

  const [virtualAddressBitWidth, setVirtualAddressBitWidth] = useState(createRandomNumber(10, 14)); // VAS
  const [physicalAddressBitWidth, setPhysicalAddressBitWidth] = useState(TLB_PPN.toString(2).length + VPO);

  const [generatedVirtualAddress, setGeneratedVirtualAddress] = useState(createRandomNumberWith(virtualAddressBitWidth));
  const [addressInBits, setAddressInBits] = useState([...generatedVirtualAddress.toString(2)]);
  const deepCopy = JSON.parse(JSON.stringify(addressInBits));
  console.log('addressInBits before', addressInBits);


  const [VPO_bits, setVPO_bits] = useState(deepCopy.splice(-VPO).join(''));     // VPO_bits = the last VPO bits of the address / log2(pageSize)
  const [TLBI_bits, setTLBI_bits] = useState(deepCopy.splice(-TLBI).join(''));     // TLBI_bits = the next TLBI bits of the address / log2(sets)
  const [TLBT_bits, setTLBT_bits] = useState(deepCopy.join(''));
  const [VPN, setVPN] = useState<string>(Number("0b" + TLBT_bits + TLBI_bits).toString(ChosenBaseConversion));


  const tlbTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 }, TLBI_bits, VPN);
  const tlbTableEntries = createTableEntries<TLB_TABLE_ENTRY>(
    TLBSets,
    TLBWays,
    tlbTableEntry,
    TLBT_bits,
    VPN
  );

  const pageTableEntry = createTableEntry<PAGE_TABLE_ENTRY>({ vpn: 0, ppn: 0, valid: 0 }, TLBI_bits, VPN);
  const pageTableEntries: PAGE_TABLE_ENTRY[][] = createTableEntries<PAGE_TABLE_ENTRY>(
    3, // I choose 3 because of all the old exams all look like that. 
    // Make sure to see the PTE's in the old exams. Hint: they are all 12 entries.
    4, // I chose 4 because of all the old exams all look like that. 
    //Be sure to see the page size given in those exams
    pageTableEntry,
    TLBT_bits,
    VPN
  );


  const [TLBTableEntries, setTLBTableEntries] = useState<TLB_TABLE_ENTRY[][]>(tlbTableEntries);
  const [PageTableEntries, setPageTableEntries] = useState<PAGE_TABLE_ENTRY[][]>(pageTableEntries);






// Component did mount
useEffect(() => {
  setAssignmentType(randomAssignmentType);
}, [0])
  useEffect(() => {
    if (testing) {
      console.log('------------------------------------')
      console.log("virtualAddressBitWidth", virtualAddressBitWidth)
      console.log("physicalAddressBitWidth", physicalAddressBitWidth)
      console.log("TLB_PPN", TLB_PPN)
      console.log("TLB_PPN (hex)", TLB_PPN.toString(16))
      console.log("TLB_PPN (bin)", TLB_PPN.toString(2))
      console.log("pageSize", pageSize)
      console.log("TLBSets", TLBSets)
      console.log("TLBWays", TLBWays)
      console.log("PageTableSize", PageTableSize)
      console.log("VPO", VPO)
      console.log("TLBI", TLBI)
      console.log("Assignment type: ", assignmentType)
      console.log("facit", facit)

    }

  }, [0])

  /* // TLB  table information
  useEffect(() => {
    const tlbTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 }, TLBI_bits, VPN);
 
    const tlbTableEntries = createTableEntries<TLB_TABLE_ENTRY>(
      TLBSets,
      TLBWays,
      tlbTableEntry,
      TLBT_bits,
      VPN
    );
 
    setTLBTableEntries(tlbTableEntries);
 
  }, [TLBSets, TLBWays, TLBT_bits, VPN, TLBI_bits]);
 
 
 
  useEffect(() => {
 
    const pageTableEntry = createTableEntry<PAGE_TABLE_ENTRY>({ vpn: 0, ppn: 0, valid: 0 }, TLBI_bits, VPN);
    const PageTableEntries: PAGE_TABLE_ENTRY[][] = createTableEntries<PAGE_TABLE_ENTRY>(
      3, // I choose 3 because of all the old exams all look like that. 
      // Make sure to see the PTE's in the old exams. Hint: they are all 12 entries.
      4, // I chose 4 because of all the old exams all look like that. 
      //Be sure to see the page size given in those exams
      pageTableEntry,
      TLBT_bits,
      VPN
    );
 
    setPageTableEntries(PageTableEntries);
 
  }, [TLBT_bits, VPN]);
 */


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
    const newPhysicalAddressBitWidth = newTLB_PPN.toString(2).length + newVPO;

    const newGeneratedVirtualAddress = createRandomNumberWith(newVirtualAddressBitWidth);
    
    const newAddressInBitsOrignal = [...newGeneratedVirtualAddress.toString(2)];
    const newAddressInBits = JSON.parse(JSON.stringify(newAddressInBitsOrignal));
    
    const newVPO_bits = newAddressInBits.splice(-newVPO).join('');     // VPO_bits = the last VPO bits of the address / log2(pageSize)
    const newTLBI_bits = newAddressInBits.splice(-newTLBI).join('');     // TLBI_bits = the next TLBI bits of the address / log2(sets)
    const newTLBT_bits = newAddressInBits.join('');     // TLBT_bits = the remaining bits of the address

    const newVPN = Number("0b" + newTLBT_bits + newTLBI_bits).toString(ChosenBaseConversion);
    
    const tlbTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 }, newTLBI_bits, newVPN);
    
    const newTLBI_value: number = Number(addressPrefixMap.Binary + newTLBI_bits);
    const newTLBT_value: number = Number(addressPrefixMap.Binary + newTLBT_bits);
    const newTLBTableEntries = createTableEntries<TLB_TABLE_ENTRY>(
      newTLBSets,
      newTLBWays,
      tlbTableEntry,
      newTLBT_bits,
      newVPN
    );

    const pageTableEntry = createTableEntry<PAGE_TABLE_ENTRY>({ vpn: 0, ppn: 0, valid: 0 }, newTLBI_bits, newVPN);
    const newPageTableEntries: PAGE_TABLE_ENTRY[][] = createTableEntries<PAGE_TABLE_ENTRY>(
      3, // I choose 3 because of all the old exams all look like that. 
      // Make sure to see the PTE's in the old exams. Hint: they are all 12 entries.
      4, // I chose 4 because of all the old exams all look like that. 
      //Be sure to see the page size given in those exams
      pageTableEntry,
      newTLBT_bits,
      newVPN
    );


    setTLBSets(newTLBSets);
    setTLBWays(newTLBWays);
    setPageSize(newPageSize);
    setPageTableSize(newPageTableSize);
    setVPO(newVPO);
    setTLBI(newTLBI);
    setTLB_PPN(newTLB_PPN);
    setPage_PPN(newPage_PPN);
    setVirtualAddressBitWidth(newVirtualAddressBitWidth);
    setPhysicalAddressBitWidth(newPhysicalAddressBitWidth);
    setGeneratedVirtualAddress(newGeneratedVirtualAddress);
    setAddressInBits(newAddressInBitsOrignal);
    setVPO_bits(newVPO_bits);
    setTLBI_bits(newTLBI_bits);
    setTLBT_bits(newTLBT_bits);
    setVPN(newVPN);







    console.log('------------------------------------')
    console.log("virtualAddressBitWidth", virtualAddressBitWidth)
    console.log("physicalAddressBitWidth", physicalAddressBitWidth)
    console.log("TLB_PPN", newTLB_PPN)
    console.log("TLB_PPN (hex)", newTLB_PPN.toString(16))
    console.log("TLB_PPN (bin)", newTLB_PPN.toString(2))
    console.log("pageSize", pageSize)
    console.log("TLBSets", newTLBSets)
    console.log("TLBWays", newTLBWays)
    console.log("PageTableSize", newPageTableSize)
    console.log("VPO", newVPO)
    console.log("TLBI", newTLBI)
    console.log("Assignment type: ", assignmentType)
    console.log("facit", facit)
    console.log('TLBT_bits', newTLBT_bits)
    console.log('TLBI_bits', newTLBI_bits)
    console.log('VPO_bits', newVPO_bits)
    console.log('VPN', newVPN)
    console.log('newTLBI_value', newTLBI_value)
    console.log('newTLBT_value', newTLBT_value)


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
        debugger
        newTLBTableEntries[newTLBI_value][correctTagIndex] = {
          tag: newTLBT_value,
          valid: 1,
          ppn: newTLB_PPN
        };
        debugger
        newTLBTableEntries[newTLBI_value][dummyTagIndex] = {
          tag: newTLBT_value,
          valid: 0,
          ppn: createUniqe(newTLB_PPN, 4 * 2)
        };





        debugger
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


      default:
        console.log('default')
    }
    setFacit(facitObj);
    setPageTableEntries(newPageTableEntries);
    setTLBTableEntries(newTLBTableEntries);
  }, [assignmentType])

  // TODO : Add the page hit case
  // TODO: Make the facit required and complete this function
  // POSTCONDITION : sets facit object in the Facit state
  function createFacit(): void {
    // Reset the user input
    // Convert the bits to a number
    /* switch (assignmentType) {
     case InputFieldsMap.TLBHIT:
       // Step 1: Create a deep copy of the TLB table
       const tlbTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 }, TLBI_bits, VPN);
       const TLBTableEntries = createTableEntries<TLB_TABLE_ENTRY>(TLBSets, TLBWays, tlbTableEntry, TLBT_bits, VPN);
 
       // Step 2: Generate the correctIndex and dummyIndex
       const correctTagIndex = Math.floor(Math.random() * TLBTableEntries[0].length);
       const dummyTagIndex = createUniqe(correctTagIndex, Math.floor(Math.random() * TLBTableEntries[0].length));
 
       // Create a copy of the row
       const newRow = [...TLBTableEntries[newTLBI_value]];
 
       // Modify the copy
       newRow[correctTagIndex] = {
         tag: newTLBT_value,
         valid: 1,
         ppn: TLB_PPN
       };
 
       newRow[dummyTagIndex] = {
         tag: newTLBT_value,
         valid: 0,
         ppn: createUniqe(TLB_PPN, 4 * 2)
       };
 
       // Replace the row in the table
       TLBTableEntries[newTLBI_value] = newRow;
 
       // Update the state with the modified copy
       setTLB_TABLE(TLBTableEntries);
 
 
       facitObj = {
         VirtualAddress: generatedVirtualAddress.toString(2),
         VPN: VPN,
         TLBI: newTLBI_value.toString(ChosenBaseConversion),
         TLBT: newTLBT_value.toString(ChosenBaseConversion),
         TLBHIT: 'Y',
         PageFault: 'N',
         PPN: TLBTableEntries[newTLBI_value][correctTagIndex].ppn.toString(ChosenBaseConversion),
         PhysicalAddress: TLBTableEntries[newTLBI_value][correctTagIndex].ppn.toString(2) + VPO_bits,
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
         TLBI: newTLBI_value.toString(ChosenBaseConversion),
         TLBT: newTLBT_value.toString(ChosenBaseConversion),
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
         TLBI: newTLBI_value.toString(ChosenBaseConversion),
         TLBT: new_TLBT_value.toString(ChosenBaseConversion),
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
    //setFacit(facitObj);
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
        />
      </div >
    </>
  )
}

export default App
