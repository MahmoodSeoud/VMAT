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
    return (
        <>
            <table className='table'>
                <thead>
                    <th>Set</th>
                    {Array(num_tlb_ways).fill(null).map((_, i) => (
                        <>
                            <th>Tag</th>
                            <th>PPN</th>
                            <th>Valid</th>
                        </>
                    ))}
                </thead>
                <tbody>

                    {Array(num_tlb_sets).fill(null).map((_, i) => {

                        return (
                            <tr>
                                <td>{i}</td>
                                {Array(num_tlb_ways).fill(null).map((_, j) => (
                                    <>
                                        <td>{tlb_entries[i][j].tag.toString(16).toUpperCase()}</td>
                                        <td>{tlb_entries[i][j].ppn.toString(16).toUpperCase()}</td>
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