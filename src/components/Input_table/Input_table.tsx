import { useEffect, useState } from 'react';
import { AddressPrefix, BaseConversion } from '../../App';

import './Input_table.css'

type Input_tableProps = {
    virtualAddress: number;
    addressPrefix: AddressPrefix;
    baseConversion: BaseConversion;
    pageSize: number;
};


type InputFields = {
    virtualAddress: string;
    vpn: number;
    tlbIndex: number;
    tlbTag: number;
    tlbHit: boolean;
    pageFault: boolean;
    ppn: number;
    physicalAddress: string;
}

function createNullArr(addresWidth: number): Array<null> {
    return Array(addresWidth).fill(null);
}

function Input_table({ virtualAddress, addressPrefix, baseConversion, pageSize }: Input_tableProps): JSX.Element {

    const [inputFields, setInputFields] = useState<InputFields>({
        virtualAddress: '',
        vpn: 0,
        physicalAddress: '',
        tlbIndex: 0,
        tlbTag: 0,
        tlbHit: false,
        pageFault: false,
        ppn: 0
    })

    // Converting the input strings to decimal numbers
    const virtualAddressInput = inputFields.virtualAddress && parseInt(inputFields.virtualAddress, 2); // Convert binary string to decimal number
    const physAddressInput = inputFields.physicalAddress && parseInt(inputFields.physicalAddress, 2); // Convert binary string to decimal number

    // To determine the physical address bits width when it is not explicitly given,
    // you need to consider the relationship between the virtual address space, 
    // the page size, and the physical memory size.
    const virtualAddressWidth = virtualAddress.toString(2).length; // Convert address to bits and get width 
    const numOfPages = (2 ** virtualAddressWidth) / pageSize;
    const physicalPageMemory = numOfPages * pageSize;
    const physAddressWidth = Math.floor(Math.log2(physicalPageMemory));


    useEffect(() => {
        console.log('inputFields', inputFields)
    }, [inputFields])

    // Handle changes in input fields
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const regexBits = /^[01]*$/; // regular expression to match only 1's and 0's
        const regexYN = /^[YN]*$/; // regular expression to match only Y AND N
        const regexNumbers = /^[0-9]*$/; // regular expression to match only digits
        const input = event.target.value;

        switch (fieldName) {

            case 'vpn':
            case 'ppn':
            case 'tlbIndex':
            case 'tlbTag':
                if (!regexNumbers.test(input)) {
                    event.target.value = '';
                    break;
                }
                setInputFields((prevState) => ({ ...prevState, [fieldName]: parseInt(input) }));
                break;
            case 'virtualAddress':
            case 'physicalAddress':
                if (!regexBits.test(input)) {
                    event.target.value = '';
                    break;
                }
                setInputFields((prevState) => ({ ...prevState, [fieldName]: input + prevState[fieldName] }));
                break;
            case 'tlbHit':
            case 'pageFault':
                if (!regexYN.test(input)) {
                    event.target.value = '';
                    break;
                }
                setInputFields((prevState) => ({ ...prevState, [fieldName]: input === 'Y' }));
                break;
            default:
                console.log('idk even know what happened');
                break;
        }
    };

    return (
        <>
            <div className="input-table">
                <p><b>Virtual address:</b> {addressPrefix + virtualAddress.toString(baseConversion).toUpperCase()}</p>
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
                                                className="bit-input"
                                                name='virtualAddress'
                                                maxLength={1}
                                                onChange={(ev) => handleInputChange(ev, 'virtualAddress')}
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
                                                    onChange={(ev) => handleInputChange(ev, 'vpn')}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>TLB index</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, 'tlbIndex')}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>TLB tag</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, 'tlbTag')}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>TLB hit? (Y/N)</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, 'tlbHit')}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Page fault? (Y/N)</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, 'pageFault')}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>PPN</td>
                                            <td>
                                                <input
                                                    onChange={(ev) => handleInputChange(ev, 'ppn')}
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
                                    {createNullArr(physAddressWidth).map((_, index) => (
                                        <div className='input-wrapper'>
                                            <p className="input-text">{physAddressWidth - index - 1}</p>
                                            <input
                                                className="bit-input"
                                                maxLength={1}
                                                onChange={(ev) => handleInputChange(ev, 'physicalAddress')}
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
