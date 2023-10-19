export type page_table_entry = {
    vpn: number;
    ppn: number;
    valid: number;
}

type Page_tableProps = {
    page_table_entries: page_table_entry[];
    page_table_size: number;
    num_ptes: number;
}


function Page_table ({page_table_entries, page_table_size, num_ptes}: Page_tableProps) {

    return (
<>
{page_table_entries}
{page_table_size}
</>
    );
}

export default Page_table;