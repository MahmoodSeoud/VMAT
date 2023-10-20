import './Input_table.css'

type address = {
    address: number;
    bitLength: number;
    baseConversion: number;
    baseConversionPrefix: string;
};

type Input_tableProps = {
    given_virtual_address: address;
    virtual_address: Omit<address, 'address'>;
    phys_address: Omit<address, 'address'>;
};

function Input_table({ given_virtual_address, virtual_address, phys_address }: Input_tableProps): JSX.Element {

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
                <p><b>Virtual address:</b> {given_virtual_address.baseConversionPrefix + given_virtual_address.address.toString(given_virtual_address.baseConversion).toUpperCase()}</p>
                <div className='virtual-wrapper'>
                    <ol>
                        <li>
                            <div className='list-item-wrapper'>
                                <p>Bits of virtual address</p>
                                <div className='list-item-bit-input-wrapper'>
                                    {Array(virtual_address.bitLength).fill(null).map((_, index) => (
                                        <div className='input-wrapper'>
                                            <p className="input-text">{virtual_address.bitLength - index - 1}</p>
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
                                    {Array(phys_address.bitLength).fill(null).map((_, index) => (
                                        <div className='input-wrapper'>
                                            <p className="input-text">{virtual_address.bitLength - index}</p>
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