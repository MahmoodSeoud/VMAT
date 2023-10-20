export type page_table_entry = {
    vpn: number;
    ppn: number;
    valid: number;
}

type Page_tableProps = {
    page_table_entries: page_table_entry[][];
    page_table_size: number;
    num_ptes: number;
}


function Page_table({ page_table_entries, page_table_size, num_ptes }: Page_tableProps) {

    return (
        <>
            <table className='table-page'>
                <thead>
                    {page_table_entries[0].map(_ => (
                        <>
                            <th>VPN</th>
                            <th>PPN</th>
                            <th>Valid</th>
                        </>
                    ))}
                </thead>
                <tbody>

                    {page_table_entries.map((_, i) => {

                        return (
                            <tr>
                                {page_table_entries[0].map((_, j) => (
                                    <>
                                        <td>{page_table_entries[i][j].vpn.toString(16).toUpperCase()}</td>
                                        <td>{page_table_entries[i][j].ppn.toString(16).toUpperCase()}</td>
                                        <td>{page_table_entries[i][j].valid}</td>
                                    </>
                                ))}
                            </tr>
                        )
                    })}

                </tbody>
            </table>
        </>
    );
}

export default Page_table;