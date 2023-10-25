import { useEffect, useState } from 'react';
import { AddressPrefix, BaseConversion } from '../../App';

import './Input_table.css'

type Input_tableProps = {
    VirtualAddress: number;
    virtualAddressWidth: number;
    physcialAddressWidth: number;
    addressPrefix: AddressPrefix;
    baseConversion: BaseConversion;
    pageSize: number;
    facit: InputFields;
};

export type InputFields = {
    VirtualAddress: string;
    VPN: string;
    TLBI: string;
    TLBT: string;
    TLBHIT: boolean;
    PageFault: boolean;
    PPN: string;
    PhysicalAddress: string;
}

function createNullArr(addresWidth: number): Array<null> {
    return Array(addresWidth).fill(null);
}

// Brabs the input element based on the classname of the input fields.
// Appends the value together into one string
function getElementValuesFrom(className: string): string {
    let address = ""
    const container = document.getElementsByClassName(className)

    for (let i = 0; i < container.length; i++) {
        address += (container[i] as HTMLInputElement).value
    }

    return address
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

function createFacitObject(input: InputFields, pageSize: number, TLBSets: number) {
    const VPO = Math.log2(pageSize)
    const TLBI = Math.log2(TLBSets)

    const VPO_bits: string = [...input.VirtualAddress].slice(-VPO).join('');
    const TLBI_bits: string = [...input.VirtualAddress].slice(-VPO - TLBI, TLBI).join('');
    const TLBT_bits: string = [...input.VirtualAddress].slice(0, -VPO - TLBI).join('');
    return null
}

function validateFieldInput(input: InputFields, facit: InputFields): void {
    if (input === facit) {
        console.log("CORRECT")
    }
}

function Input_table({ VirtualAddress, addressPrefix, baseConversion, pageSize, virtualAddressWidth, physcialAddressWidth, facit }: Input_tableProps): JSX.Element {

    const [inputFields, setInputFields] = useState<InputFields>({
        VirtualAddress: '',
        VPN: '',
        PhysicalAddress: '',
        TLBI: '',
        TLBT: '',
        TLBHIT: false,
        PageFault: false,
        PPN: ''
    })

    // Converting the input strings to decimal numbers
    const virtualAddressInput = inputFields.VirtualAddress && parseInt(inputFields.VirtualAddress, 2); // Convert binary string to decimal number
    const physAddressInput = inputFields.PhysicalAddress && parseInt(inputFields.PhysicalAddress, 2); // Convert binary string to decimal number


    /*     // To determine the physical address bits width when it is not explicitly given,
        // you need to consider the relationship between the virtual address space, 
        // the page size, and the physical memory size.
        const numOfPages = (2 ** virtualAddressWidth) / pageSize;
        const physicalPageMemory = numOfPages * pageSize;
        const physAddressWidth = Math.floor(Math.log2(physicalPageMemory)); */



    useEffect(() => {
        console.log('inputFields', inputFields)
    }, [inputFields])

    // Handle changes in input fields
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const regexBits = /^[01]*$/; // regular expression to match only 1's and 0's
        const regexYN = /^[YN]*$/; // regular expression to match only Y AND N
        const regexNumbers = /^[0-9]*$/; // regular expression to match only digits
        const regexHexChars = /^[0-9a-fA-F]*$/; // regular expression to match only hex characters
        const input = event.target.value;

        switch (fieldName) {

            case 'VPN':
            case 'PPN':
            case 'TLBI':
            case 'TLBT':
                if (!regexHexChars.test(input)) {
                    event.target.value = '';
                    return;
                }
                setInputFields((prevState) => ({ ...prevState, [fieldName]: input }));
                break;
            case 'VirtualAddress':
                if (!regexBits.test(input)) {
                    event.target.value = '';
                    return;
                }
                setInputFields((prevState) => ({ ...prevState, [fieldName]: getElementValuesFrom("vbit-input") }));
                break;
            case 'physicalAddress':
                if (!regexBits.test(input)) {
                    event.target.value = '';
                    return;
                }
                setInputFields((prevState) => ({ ...prevState, [fieldName]: getElementValuesFrom("pbit-input") }));
                break;
            case 'TLBHIT':
            case 'PageFault':
                if (!regexYN.test(input)) {
                    event.target.value = '';
                    return;
                }
                
                setInputFields((prevState) => ({ ...prevState, [fieldName]: input === 'Y' }));
                break;
            default:
                console.log('idk even know what happened');
                break;
        }
    };

    validateFieldInput(inputFields, {
        // Take the givenVirtualAddress in bits
        VirtualAddress: Number(inputFields.VirtualAddress).toString(2),
        VPN: '',
        PhysicalAddress: '',
        TLBI: '',
        TLBT: '',
        TLBHIT: false,
        PageFault: false,
        PPN: ''
    })

    return (
        <>
            <div className="input-table">
                <p><b>Virtual address:</b> {addressPrefix + VirtualAddress.toString(baseConversion).toUpperCase()}</p>
                <div className='virtual-wrapper'>
                    <ol>
                        <li>
                            <div className='list-item-wrapper'>
                                <p>Bits of virtual address</p>
                                <div className='list-item-bit-input-wrapper'>
                                    {createNullArr(virtualAddressWidth).map((_, index) => (
                                        <div className='input-wrapper'>
                                            <p className="input-text">{virtualAddressWidth - index - 1}</p>
                                            <input
                                                id='vbit'
                                                className="vbit-input"
                                                name='VirtualAddress'
                                                maxLength={1}
                                                onChange={(ev) => handleInputChange(ev, 'VirtualAddress')}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className='list-item-wrapper'>
                                <p>Address Translation</p>

                                <table className='table'>
                                    <thead>
                                        <th>Parameter</th>
                                        <th>Value</th>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>VPN</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, 'VPN')}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>TLB index</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, 'TLBI')}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>TLB tag</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, 'TLBT')}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>TLB hit? (Y/N)</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, 'TLBHIT')}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Page fault? (Y/N)</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, 'PageFault')}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>PPN</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, 'PPN')}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                        <li>
                            <div className='list-item-wrapper'>
                                <p>Bits of phys. (if any)</p>
                                <div className='list-item-bit-input-wrapper'>
                                    {createNullArr(physcialAddressWidth).map((_, index) => (
                                        <div className='input-wrapper'>
                                            <p className="input-text">{physcialAddressWidth - index - 1}</p>
                                            <input
                                                className="pbit-input"
                                                maxLength={1}
                                                onChange={(ev) => handleInputChange(ev, 'PhysicalAddress')}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </li>
                    </ol>

                </div>
            </div>
        </>
    )
}

export default Input_table;
