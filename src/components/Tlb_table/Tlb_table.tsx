import { AddressPrefix, BaseConversion } from '../../App';
import '../table.css'

export type tlb_entry = {
    tag: number;
    ppn: number;
    valid: number;
};

type Tlb_tableProps = {
    tlb_entries: Array<tlb_entry>[];
    addressPrefix: AddressPrefix;
    baseConversion: BaseConversion;
}



function Tlb_table({ tlb_entries, addressPrefix, baseConversion }: Tlb_tableProps) {
    return (
        <>
            <h2>Tlb</h2>
            <table className='table-tlb'>
                <thead>
                    <th>Set</th>
                    {tlb_entries[0].map(_ => (
                        <>
                            <th>Tag</th>
                            <th>PPN</th>
                            <th>Valid</th>
                        </>
                    ))}
                </thead>
                <tbody>

                    {tlb_entries.map((_, i) => {

                        return (
                            <tr>
                                <td>{i}</td>
                                {tlb_entries[0].map((_, j) => (
                                    <>
                                        <td>{addressPrefix + tlb_entries[i][j].tag.toString(baseConversion).toUpperCase()}</td>
                                        <td>{addressPrefix + tlb_entries[i][j].ppn.toString(baseConversion).toUpperCase()}</td>
                                        <td>{tlb_entries[i][j].valid}</td>
                                    </>
                                ))}
                            </tr>
                        )
                    })}

                </tbody>
            </table>
        </>);
}

export default Tlb_table;
