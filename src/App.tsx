import './App.css'
import Page_table, { PAGE_TABLE_ENTRY } from './components/Page_table/Page_table';
import Input_table, { InputFields } from './components/Input_table/Input_table';
import { useEffect, useState } from 'react';
import Tlb_table, { TLB_TABLE_ENTRY } from './components/Tlb_table/Tlb_table';
import { Dropdown } from 'primereact/dropdown';


import 'primeicons/primeicons.css';
import { SelectItemOptionsType } from 'primereact/selectitem';



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
// ----------- 

// ----- Given parameters for exercis
// PPN bit size + log2(pagesize) 

function generateTLBSets(): number {
  return 2 ** createRandomNumber(2, 4);
}

function generateTLBWays(): number {
  return createRandomNumber(3, 5);
}



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

function App(): JSX.Element {



  const [facit, setFacit] = useState<InputFields>(empty);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const randomAssignmentType = [InputFieldsMap.PageHit, InputFieldsMap.TLBHIT, InputFieldsMap.PageFault]
  // Sorting randomized https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  randomAssignmentType.sort(() => (Math.random() > .5) ? 1 : -1);
  const [assignmentType, setAssignmentType] = useState<Result>(randomAssignmentType[1]);




  // TLB  table information
  const tlbTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 });
  const [TLB_TABLE, setTLB_TABLE] = useState<TLB_TABLE_ENTRY[][]>(createTableEntries<TLB_TABLE_ENTRY>(
    TLBSets,
    TLBWays,
    tlbTableEntry
  ));

  const pageTableEntry = createTableEntry<PAGE_TABLE_ENTRY>({ vpn: 0, ppn: 0, valid: 0 });
  const PageTableEntries: PAGE_TABLE_ENTRY[][] = createTableEntries<PAGE_TABLE_ENTRY>(
    3, // I choose 3 because of all the old exams all look like that. 
    // Make sure to see the PTE's in the old exams. Hint: they are all 12 entries.
    4, // I chose 4 because of all the old exams all look like that. 
    //Be sure to see the page size given in those exams
    pageTableEntry
  );
  const [PAGE_TABLE, setPAGE_TABLE] = useState<PAGE_TABLE_ENTRY[][]>(PageTableEntries);



  // Setting the facit to the correct result
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

    setFacit(createFacit(assignmentType));
  }, [assignmentType])

  // Function to create a TLB entry
  function createTableEntry<TObj extends TLB_TABLE_ENTRY | PAGE_TABLE_ENTRY>(entry: TObj): TObj {

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
    tableEntry: TObj
  ): TObj[][] {
    const entries: TObj[][] = [];

    for (let i = 0; i < numOfRows; i++) {
      const array: TObj[] = [];
      for (let j = 0; j < numOfCols; j++) {
        let entry = createTableEntry<TObj>(tableEntry)
        array.push(entry);
      }
      entries.push(array);
    }
    return entries;
  }


  // TODO : Add the page hit case
  // TODO: Make the facit required and complete this function
  // POSTCONDITION : sets facit object in the Facit state
  function createFacit(assignmentType: Result): InputFields {
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

        // Step 1: Create a deep copy of the TLB table
        const tlbTableEntry = createTableEntry<TLB_TABLE_ENTRY>({ tag: 0, ppn: 0, valid: 0 });
        let tlbTableEntries = createTableEntries<TLB_TABLE_ENTRY>(TLBSets, TLBWays, tlbTableEntry);

        try {

          // Step 2: Generate the correctIndex and dummyIndex
          // The correctTagIndex is a random number between 0 and the length of the ways
          // This correctTagIndex is where we insert the CORRECT tag and PPN
          const correctTagIndex = Math.floor(Math.random() * tlbTableEntries[0].length);
          const dummyTagIndex = createUniqe(correctTagIndex, Math.floor(Math.random() * tlbTableEntries[0].length))

          console.log("VALUE OF OUT OF BOUNCE MAY BE", TLBI_value)
          console.log("Correct tag index OF OUT OF BOUNCE MAY BE", correctTagIndex)
          console.log("Dummy index out of bounce", dummyTagIndex)
          // Step 3: Update the correctIndex and dummyIndex in the deep copy of the TLB table
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
        } catch (error) {
          console.error("tlbTableEntries" + tlbTableEntries[0] + error)
        }



        break;
      case InputFieldsMap.PageFault:
        // Case 1: VPN DOES NOT exists in Page Tables 

        // Case 2: VPN EXISTS and VALID bit is 0

        // 50% 50% of having a VPN address, but with valid bit 0
        if (Math.random() > 0.5) {
          const dummy = PAGE_TABLE[Math.floor(Math.random() * PAGE_TABLE.length)][Math.floor(Math.random() * PAGE_TABLE[0].length)];
          dummy.vpn = Number("0x" + VPN)
          dummy.valid = 0
        }

        setPAGE_TABLE(PAGE_TABLE)

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



        // TODO: Uncomment this when you have the TLB_HIT working
        /*      const Page_entry = PAGE_TABLE[Math.floor(Math.random() * PAGE_TABLE.length)][Math.floor(Math.random() * PAGE_TABLE[0].length)];
             Page_entry.ppn = Page_PPN;
             Page_entry.vpn = Number("0x" + VPN);
             Page_entry.valid = 1;
     
             setPAGE_TABLE(PAGE_TABLE)
     
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
             } */
        console.log("Not implemented yet");
        break;
      default:
        console.log("No case found");
        break;

    }

    return facitObj;
  }

  // TODO: Add the third chosen result case
  const chosenResultsItemArr: SelectItemOptionsType = [
    {
      name: InputFieldsMap.TLBHIT,
      code: InputFieldsMap.TLBHIT
    },
    {
      name: InputFieldsMap.PageFault,
      code: InputFieldsMap.PageFault
    },
    {
      name: InputFieldsMap.PageHit,
      code: InputFieldsMap.PageHit
    }
  ]


  return (
    <>

      <i
        className="pi pi-cog"
        style={{ fontSize: '2em', cursor: 'pointer' }}
        onClick={() => setShowSettings(!showSettings)}
      />

      {showSettings && (
        <>
          <div className='settings-wrapper'>
            <h3>Settings</h3>
            <Dropdown
              value={assignmentType}
              onChange={(e) => setAssignmentType(e.value.name)}
              optionLabel="name"
              options={chosenResultsItemArr}
              showClear
              placeholder="Select Assignment Type"
              className="w-full md:w-14rem"
            />
          </div>
        </>
      )}


      <div
        className=''
      >

      </div>
      <div className='wrapper'>


        <div className='wrapper-tables'>

          <Tlb_table
            tlb_entries={TLB_TABLE}
            addressPrefix={ChosenAddressPrefix}
            baseConversion={ChosenBaseConversion}
            TLBSets={TLBSets}
            TLBWays={TLBWays}
          />

          <Page_table
            page_table_entries={PAGE_TABLE}
            addressPrefix={ChosenAddressPrefix}
            baseConversion={ChosenBaseConversion}
            pageSize={pageSize}
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
