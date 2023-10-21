import { AddressPrefix, BaseConversion } from '../../App';
import './Input_table.css'

type Input_tableProps = {
    virtualAddress: number;
    addressPrefix: AddressPrefix;
    baseConversion: BaseConversion;
    pageSize: number;
};

function Input_table({ virtualAddress, addressPrefix, baseConversion, pageSize }: Input_tableProps): JSX.Element {
    // To determine the physical address bits width when it is not explicitly given,
    // you need to consider the relationship between the virtual address space, 
    // the page size, and the physical memory size.
    const virtualAddressWidth = virtualAddress.toString(2).length; // Convert address to bits and get width 
    const numOfPages = (2 ^ virtualAddress) / pageSize;
    const physicalPageMemory = numOfPages * pageSize;
    const physAddressWidth = Math.floor(Math.log2(physicalPageMemory));

    debugger
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^[01]*$/; // regular expression to match only 1's and 0's
        const input = event.target.value;
        if (regex.test(input)) {
            event.target.value = input;
        } else {
            event.target.value = '';
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
                                    {Array(virtualAddressWidth).fill(null).map((_, index) => (
                                        <div className='input-wrapper'>
                                            <p className="input-text">{virtualAddressWidth - index - 1}</p>
                                            <input
                                                className="bit-input"
                                                maxLength={1}
                                                onChange={handleInputChange}
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
                                                <input />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>TLB index</td>
                                            <td>
                                                <input />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>TLB tag</td>
                                            <td>
                                                <input />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>TLB hit? (Y/N)</td>
                                            <td>
                                                <input />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Page fault? (Y/N)</td>
                                            <td>
                                                <input />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>PPN</td>
                                            <td>
                                                <input />
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
                                    {Array(physAddressWidth).fill(null).map((_, index) => (
                                        <div className='input-wrapper'>
                                            <p className="input-text">{physAddressWidth - index}</p>
                                            <input
                                                className="bit-input"
                                                maxLength={1}
                                                onChange={handleInputChange}
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