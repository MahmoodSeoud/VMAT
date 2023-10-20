import '../table.css'

export type tlb_entry = {
    tag: number;
    ppn: number;
    valid: number;
};

type Tlb_tableProps = {
    tlb_entries: tlb_entry[][];
    num_tlb_ways: number;
    num_tlb_sets: number;
}

function Tlb_table({ tlb_entries, num_tlb_ways, num_tlb_sets }: Tlb_tableProps) {
	const address_prefix : string = "0x"
    return (
        <>
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
                                        <td>{address_prefix + tlb_entries[i][j].tag.toString(16).toUpperCase()}</td>
                                        <td>{address_prefix + tlb_entries[i][j].ppn.toString(16).toUpperCase()}</td>
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
