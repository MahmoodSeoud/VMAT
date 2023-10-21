import { AddressPrefix, BaseConversion } from "../../App";

export type page_table_entry = {
    vpn: number;
    ppn: number;
    valid: number;
}

type Page_tableProps = {
    page_table_entries: Array<page_table_entry>[];
    addressPrefix: AddressPrefix;
    baseConversion: BaseConversion;
}


function Page_table({ page_table_entries, addressPrefix, baseConversion }: Page_tableProps) {
    return (
        <>
            <h2>Page table</h2>
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
                                        <td>{addressPrefix + page_table_entries[i][j].vpn.toString(baseConversion).toUpperCase()}</td>
                                        <td>{addressPrefix + page_table_entries[i][j].ppn.toString(baseConversion).toUpperCase()}</td>
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
