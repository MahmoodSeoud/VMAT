import React from "react";
import { AddressPrefix, BaseConversion, Bit } from "../../App";

export type PAGE_TABLE_ENTRY = {
    vpn: number;
    ppn: number;
    valid: Bit;
}

type Page_tableProps = {
    page_table_entries: Array<PAGE_TABLE_ENTRY>[];
    addressPrefix: AddressPrefix;
    baseConversion: BaseConversion;
    pageSize: number;
}


function Page_table({ page_table_entries, addressPrefix, baseConversion, pageSize }: Page_tableProps) {
    console.log('Page table rendered')
    return (
        <div>
            <h2>Page Table</h2>
            <p>Page size is {pageSize} bytes and has a total of 12 entries</p>
            <table className='table-page'>
                <thead>
                    <tr>
                        { page_table_entries && page_table_entries.length > 0&& page_table_entries[0].map((_, s) => (
                            <React.Fragment key={s}>
                                <th>VPN</th>
                                <th>PPN</th>
                                <th>Valid</th>
                            </React.Fragment >
                        ))}
                    </tr>
                </thead>
                <tbody>

                    {page_table_entries && page_table_entries.length > 0 && page_table_entries.map((_, i) => {

                        return (
                            <tr key={i}>
                                { page_table_entries && page_table_entries.length > 0 && page_table_entries[0].map((_, j) => (
                                    <React.Fragment key={j}>
                                        <td>{addressPrefix + page_table_entries[i][j].vpn.toString(baseConversion).toUpperCase()}</td>
                                        <td>{addressPrefix + page_table_entries[i][j].ppn.toString(baseConversion).toUpperCase()}</td>
                                        <td>{page_table_entries[i][j].valid}</td>
                                    </React.Fragment>
                                ))}
                            </tr>
                        )
                    })}

                </tbody>
            </table>
        </div>
    );
}

export default Page_table;
