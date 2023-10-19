import React from 'react';

type tlb_entry = {
    tag: number;
    ppn: number;
    valid: number;
};


const tlb = [
    { tag: 0x00, ppn: 0x00, valid: 1 },
    { tag: 0x21, ppn: 0x10, valid: 0 },
    { tag: 0x3f, ppn: 0x23, valid: 0 },
    { tag: 0x12, ppn: 0x34, valid: 1 },
    { tag: 0x01, ppn: 0x33, valid: 1 },
    { tag: 0x0C, ppn: 0x0D, valid: 0 },
    { tag: 0x08, ppn: 0x17, valid: 1 },
    { tag: 0x13, ppn: 0x15, valid: 1 },
    { tag: 0xA0, ppn: 0x21, valid: 0 },
    { tag: 0xFA, ppn: 0x00, valid: 1 },
    { tag: 0xA2, ppn: 0x32, valid: 0 },
    { tag: 0x03, ppn: 0x43, valid: 0 }
];

const num_tlb_ways: number = Object.keys(tlb[0]).length;
const num_tlb_sets: number = tlb.length;



function Tlb_table() {
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Set</th>
                        {Array(num_tlb_ways).fill(null).map((_, i) => (
                            <>
                                <th>Tag</th>
                                <th>PPN</th>
                                <th>Valid</th>
                            </>
                        ))}
                    </tr>
                </thead>
                <tbody>

                    {Array(num_tlb_sets).fill(null).map((_, i) => {


                        return (
                            <tr>
                                <td>{i}</td>
                                {Array(num_tlb_ways).fill(null).map((_, j) => (
                                    <>
                                        <td>{tlb[j].tag}</td>
                                        <td>{tlb[j].ppn}</td>
                                        <td>{tlb[j].valid}</td>
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