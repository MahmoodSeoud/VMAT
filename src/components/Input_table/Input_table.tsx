import { useEffect, useRef, useState } from 'react';
import { AddressPrefix, BaseConversion, InputField, InputFieldsMap } from '../../App';
import './Input_table.css'

export type InputFields = {
    VirtualAddress: string;
    VPN: string;
    TLBI: string;
    TLBT: string;
    TLBHIT: string;
    PageFault: string;
    PPN: string;
    PhysicalAddress: string;
}


type Input_tableProps = {
    VirtualAddress: number;
    virtualAddressWidth: number;
    physcialAddressWidth: number;
    addressPrefix: AddressPrefix;
    baseConversion: BaseConversion;
    pageSize: number;
    facit: InputFields;
};



function createNullArr(addresWidth: number): Array<null> {
    return Array(addresWidth).fill(null);
}

// Brabs the input element based on the classname of the input fields.
// Appends the value together into one string
function getElementValuesFrom(className: string): string {
    let address = "";
    const container = document.getElementsByClassName(className);

    document.getElementById('vbit')
    for (let i = 0; i < container.length; i++) {
        address += (container[i] as HTMLInputElement).value;
    }

    return address;
}



// PPN = Physical Page Number
// It refers to the identification number assigned to a physical page in
// the main memory. The PPN is used to translate the virtual addresses 
// into physical addresses.

// vpm = Virtual Page Number
// It refers to the identification number assigned to a virtual page in 
// the virtual memory space. The VPN is used for addressing and managing pages 
// in the virtual memory, allowing the mapping of virtual addresses to physical addresses.

// Vi har addresse i hex
// 1. Convert addresse til bits -  virtualAdressField. Tjek om userinput == addresse converted
// 2. tag log2(pageSize) og marker VPO 
// 3 Tag log2(#sets) og marker TLB index. Dette skrives i feltet TLB index
// .. resten er TLB tag
// 4. Lookup TLB table. if TLB tag eksistere og valid == 1 -> TLB HIT -> You are done!
// 5. Lookup TLB table. if TLB tag IKKE eksistere eller valid == 0 -> TLB miss -> Continue
// 6. Lookup in Page table. if VPN exists and valid == 1 -> No page fault -> You are done!
// 7. if there is a pagefault -> Lookup in Page table. write down the PPN and write the physcial address of that


function Input_table({ VirtualAddress, addressPrefix, baseConversion, pageSize, virtualAddressWidth, physcialAddressWidth, facit }: Input_tableProps): JSX.Element {

    const [input, setInput] = useState<InputFields>({
        VirtualAddress: '',
        VPN: '',
        PhysicalAddress: '',
        TLBI: '',
        TLBT: '',
        TLBHIT: '',
        PageFault: '',
        PPN: ''
    })

    const [isDragging, setIsDragging] = useState(false);

    // Insert the facit incase the user does not know the answer
    function insertFacit(inputFieldName: InputField, e: React.BaseSyntheticEvent): void {

        const containerElement = (e.target.parentElement as HTMLBodyElement)
  
        switch (inputFieldName) {
            case InputFieldsMap.VirtualAddress:
            case InputFieldsMap.PhysicalAddress:

                const classForBits = "list-item-bit-input-wrapper" as const;
                const elements = containerElement.getElementsByClassName(classForBits);

                for (let i = 0; i < elements[0].children.length; i++) {
                    // there is a <p> before the input element hence the 1
                    const inputElement = elements[0].children[i].children[1] as HTMLInputElement
                    inputElement.value = facit[inputFieldName][i] || '';
                }
                break;
            default:
                const inputElement_2 = (containerElement.children[1].children[0] as HTMLInputElement);
                inputElement_2.value = facit[inputFieldName] || '';
                break;
        }

        setInput((prevState) => ({ ...prevState, [inputFieldName]: facit[inputFieldName] }));
    }

    /*     // To determine the physical address bits width when it is not explicitly given,
        // you need to consider the relationship between the virtual address space, 
        // the page size, and the physical memory size.
        const numOfPages = (2 ** virtualAddressWidth) / pageSize;
        const physicalPageMemory = numOfPages * pageSize;
        const physAddressWidth = Math.floor(Math.log2(physicalPageMemory)); */



    useEffect(() => {
        console.log('input', input)
    }, [input])

    function validateFieldInput(inputFieldName: InputField): boolean {
        // TODO: nice to have (in the settings menu)
        // incremental correct feedback
        return input[inputFieldName] == facit[inputFieldName]
    }

    // Handle changes in input fields
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: InputField) => {
        const regexBits = /^[01]*$/; // regular expression to match only 1's and 0's
        const regexYN = /^[YN]*$/; // regular expression to match only Y AND N
        const regexHexChars = /^[0-9a-fA-F]*$/; // regular expression to match only hex characters
        const input = event.target.value;

        switch (fieldName) {
            case InputFieldsMap.VirtualAddress:
                if (!regexBits.test(input)) {
                    event.target.value = '';
                    return;
                }
                setInput((prevState) => ({ ...prevState, [fieldName]: getElementValuesFrom("vbit-input") }));
                break;

            case InputFieldsMap.VPN:
            case InputFieldsMap.TLBT:
            case InputFieldsMap.TLBI:
            case InputFieldsMap.PPN:
                if (!regexHexChars.test(input)) {
                    event.target.value = '';
                    return;
                }
                setInput((prevState) => ({ ...prevState, [fieldName]: input }));
                break;

            case InputFieldsMap.PageFault:
            case InputFieldsMap.TLBHIT:
                if (!regexYN.test(input)) {
                    event.target.value = '';
                    return;
                }

                setInput((prevState) => ({ ...prevState, [fieldName]: input }));
                break;

            case InputFieldsMap.PhysicalAddress:
                if (!regexBits.test(input)) {
                    event.target.value = '';
                    return;
                }
                setInput((prevState) => ({ ...prevState, [fieldName]: getElementValuesFrom("pbit-input") }));
                break;

            default:
                console.log('idk even know what happened');
                break;
        }
    };

    // TODO if the user has incremental feedback have this in a if statement
    //validateFieldInput(input, facit)

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        setIsDragging(true);
        //inputElement.current.classList.add('colored');
        //e.target.classList.add('colored');
    };

    function handleMouseUp() {
        setIsDragging(false);
    };

    function handleMouseEnter(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (isDragging) {
            //e.target.classList.add('colored');
        }
    };


    return (
        <>
            <div className="input-table">
                <p><b>Virtual address:</b> {addressPrefix + VirtualAddress.toString(baseConversion).toUpperCase()}</p>
                <div className='virtual-wrapper'>
                    <ol>
                        <li>
                            <div className={`list-item-wrapper`}>
                                <p>Bits of virtual address</p>
                                <div className={`list-item-bit-input-wrapper ${validateFieldInput(InputFieldsMap.VirtualAddress) ? 'correct' : ''} `}>
                                    {createNullArr(virtualAddressWidth).map((_, index) => (
                                        <div
                                            className='input-wrapper'
                                            onMouseDown={(e) => handleMouseDown(e)}
                                            onMouseUp={handleMouseUp}
                                            onMouseEnter={handleMouseEnter}
                                        >
                                            <p className="input-text">{virtualAddressWidth - index - 1}</p>
                                            <input
                                                id='vbit'
                                                className="vbit-input"
                                                name='VirtualAddress'
                                                maxLength={1}
                                                onChange={(ev) => handleInputChange(ev, InputFieldsMap.VirtualAddress)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={(ev) => insertFacit(InputFieldsMap.VirtualAddress, ev)}
                                    
                                    >

                                    Insert facit
                                </button>
                            </div>
                        </li>

                        <li>
                            <div className='list-item-wrapper'>
                                <p>Address Translation</p>

                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>Parameter</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr className={`${validateFieldInput(InputFieldsMap.VPN) ? ' correct' : ''}`}>
                                            <td>VPN</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.VPN)}
                                                />
                                            </td>
                                            <button onClick={(ev) => insertFacit(InputFieldsMap.VPN, ev)}>Insert facit</button>
                                        </tr>
                                        <tr className={`${validateFieldInput(InputFieldsMap.TLBI) ? ' correct' : ''} `}>
                                            <td>TLB index</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.TLBI)}
                                                />
                                            </td>
                                            <button onClick={(ev) => insertFacit(InputFieldsMap.TLBI, ev)}>Insert facit</button>
                                        </tr>
                                        <tr className={`${validateFieldInput(InputFieldsMap.TLBT) ? ' correct' : ''}`}>
                                            <td>TLB tag</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.TLBT)}
                                                />
                                            </td>
                                            <button onClick={(ev) => insertFacit(InputFieldsMap.TLBT, ev)}>Insert facit</button>
                                        </tr>
                                        <tr className={`${validateFieldInput(InputFieldsMap.TLBHIT) ? ' correct' : ''}`}>
                                            <td>TLB hit? (Y/N)</td>
                                            <td>
                                                <input
                                                    maxLength={1}
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.TLBHIT)}
                                                />
                                            </td>
                                            <button onClick={(ev) => insertFacit(InputFieldsMap.TLBHIT, ev)}>Insert facit</button>
                                        </tr>
                                        <tr className={`${validateFieldInput(InputFieldsMap.PageFault) ? ' correct' : ''}`}>
                                            <td>Page fault? (Y/N)</td>
                                            <td>
                                                <input
                                                    maxLength={1}
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.PageFault)}
                                                />
                                            </td>
                                            <button onClick={(ev) => insertFacit(InputFieldsMap.PageFault, ev)}>Insert facit</button>
                                        </tr>
                                        <tr className={`${validateFieldInput(InputFieldsMap.PPN) ? ' correct' : ''}`}>
                                            <td>PPN</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.PPN)}
                                                />
                                            </td>
                                            <button onClick={(ev) => insertFacit(InputFieldsMap.PPN, ev)}>Insert facit</button>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                        <li>
                            <div className='list-item-wrapper'>
                                <p>Bits of phys. (if any)</p>
                                <div className={`list-item-bit-input-wrapper ${validateFieldInput(InputFieldsMap.PhysicalAddress) ? 'correct' : ''}`}>
                                    {createNullArr(physcialAddressWidth).map((_, index) => (
                                        <div className='input-wrapper'>
                                            <p className="input-text">{physcialAddressWidth - index - 1}</p>
                                            <input
                                                className="pbit-input"
                                                maxLength={1}
                                                onChange={(ev) => handleInputChange(ev, InputFieldsMap.PhysicalAddress)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button onClick={(ev) => insertFacit(InputFieldsMap.PhysicalAddress, ev)}>Insert Facit</button>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </>
    )
}

export default Input_table;
