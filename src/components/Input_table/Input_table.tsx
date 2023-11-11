import { useEffect, useRef, useState } from 'react';
import { AddressPrefix, BaseConversion, InputField, InputFieldsMap, createRandomNumberWith } from '../../App';
import './Input_table.css'
import { ColorResult, HuePicker } from 'react-color';
import { Toast } from 'primereact/toast';
import '../../theme.css';


export type InputFields = {
    VirtualAddress: string;
    VPN: string;
    TLBI: string;
    TLBT: string;
    TLBHIT: string;
    PageFault: string;
    PPN: string;
    PhysicalAddress: string;
    PageHit: string;
}


type Input_tableProps = {
    VirtualAddress: number;
    virtualAddressWidth: number;
    physcialAddressWidth: number;
    addressPrefix: AddressPrefix;
    baseConversion: BaseConversion;
    pageSize: number;
    facit: InputFields;
};



function createNullArr(addresWidth: number): Array<null> {
    return Array(addresWidth).fill(null);
}

// Brabs the input element based on the classname of the input fields.
// Appends the value together into one string
function getElementValuesFrom(className: string): string {
    let address = "";
    const container = document.getElementsByClassName(className);

    document.getElementById('vbit')
    for (let i = 0; i < container.length; i++) {
        address += (container[i] as HTMLInputElement).value;
    }

    return address;
}



// PPN = Physical Page Number
// It refers to the identification number assigned to a physical page in
// the main memory. The PPN is used to translate the virtual addresses 
// into physical addresses.

// vpn = Virtual Page Number
// It refers to the identification number assigned to a virtual page in 
// the virtual memory space. The VPN is used for addressing and managing pages 
// in the virtual memory, allowing the mapping of virtual addresses to physical addresses.

// Vi har addresse i hex
// 1. Convert addresse til bits -  virtualAdressField. Tjek om userinput == addresse converted
// 2. tag log2(pageSize) og marker VPO 
// 3 Tag log2(#sets) og marker TLB index. Dette skrives i feltet TLB index
// .. resten er TLB tag
// 4. Lookup TLB table. if TLB tag eksistere og valid == 1 -> TLB HIT -> You are done!
// 5. Lookup TLB table. if TLB tag IKKE eksistere eller valid == 0 -> TLB miss -> Continue
// 6. Lookup in Page table. if VPN exists and valid == 1 -> No page fault -> You are done!
// 7. if there is a pagefault -> Lookup in Page table. write down the PPN and write the physcial address of that


let emptyInput: InputFields = {
    VirtualAddress: '',
    VPN: '',
    PhysicalAddress: '',
    TLBI: '',
    TLBT: '',
    TLBHIT: '',
    PageFault: '',
    PPN: '',
    PageHit: ''
}
function Input_table({ VirtualAddress, addressPrefix, baseConversion, pageSize, virtualAddressWidth, physcialAddressWidth, facit }: Input_tableProps): JSX.Element {
    pageSize

    const [input, setInput] = useState<InputFields>({
        VirtualAddress: '',
        VPN: '',
        PhysicalAddress: '',
        TLBI: '',
        TLBT: '',
        TLBHIT: '',
        PageFault: '',
        PPN: '',
        PageHit: ''
    })

    const [isMouseDown, setIsMouseDown] = useState(false);
    // creating a random hex address per refresh 4 * 6 bits all converted to hex
    const [color, setColor] = useState<string>("#"+createRandomNumberWith(4*6).toString(16));
    const [isPPNFocused, setIsPPNFocused] = useState(false);
    const [isPhysAddFocused, setIsPhysAddFocused] = useState(false);

    const ppnRef = useRef<HTMLInputElement>(null);

    const toast = useRef<Toast>(null);

    function showSuccess() {
        toast.current?.show({
            severity: 'success',
            summary: 'Correct!',
            detail: 'You solved it alright!',
            life: 3000
        });
    }


    useEffect(() => {
        console.log('inputField changed', input);

        if (deepEqual(facit, input) && !deepEqual(input, emptyInput)) {
            // Show success mes
            showSuccess();
        }
    }, [input])



    // Check if the user has clicked on the input field
    useEffect(() => {
        console.log('isPPNFocused: ', isPPNFocused);
    }, [isPPNFocused]);


    function handleMouseDown(e: React.MouseEvent) {

        setIsMouseDown(true);
        // Apply highlight to the current div
        const pTagWithIndex = e.currentTarget.firstChild as HTMLElement;
        pTagWithIndex.classList.add('highlight');
        // Setting the color the the one selected in the color picker
        pTagWithIndex.style.backgroundColor = color;
    };

    function handleMouseUp(e: React.MouseEvent) {
        setIsMouseDown(false);
    };

    function handleMouseEnter(e: React.MouseEvent) {
        if (isMouseDown) {
            // Apply highlight to the current div
            const pTagWithIndex = e.currentTarget.firstChild as HTMLElement;
            pTagWithIndex.classList.add('highlight');

            // Setting the color the the one selected in the color picker
            pTagWithIndex.style.backgroundColor = color;
        }
    };

    function resetColors() {
        const bitElements = document.getElementsByClassName('input-text') as HTMLCollectionOf<HTMLElement>;
        const textElements = document.getElementsByClassName('exercise-label') as HTMLCollectionOf<HTMLElement>;

        for (let i = 0; i < bitElements.length; i++) {
            const isHighligted = bitElements[i].classList.contains('highlight');

            if (isHighligted) {
                bitElements[i].classList.remove('highlight');
                bitElements[i].style.backgroundColor = '';
            }
        }

        for (let i = 0; i < bitElements.length; i++) {
            const isHighligted = textElements[i].classList.contains('highlight');

            if (isHighligted) {
                textElements[i].classList.remove('highlight');
                textElements[i].style.backgroundColor = '';
            }
        }
    }

    // TODO: Please fix all the any's
    function deepEqual(object1: any, object2: any) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            const val1: any = object1[key];
            const val2: any = object2[key];
            const areObjects = isObject(val1) && isObject(val2);
            if (
                areObjects && !deepEqual(val1, val2) ||
                !areObjects && val1 !== val2
            ) {
                return false;
            }
        }

        return true;
    }

    function isObject(object: InputFields) {
        return object != null && typeof object === 'object';
    }

    // Insert the facit incase the user does not know the answer
    function insertFacit(inputFieldName: InputField, e: React.BaseSyntheticEvent): void {

        const containerElement = (e.target.parentElement as HTMLBodyElement)

        switch (inputFieldName) {
            case InputFieldsMap.VirtualAddress:
            case InputFieldsMap.PhysicalAddress:

                const classForBits = "list-item-bit-input-wrapper" as const;
                const bitElements = containerElement.getElementsByClassName(classForBits);

                for (let i = 0; i < bitElements[0].children.length; i++) {
                    // there is a <p> before the input element hence the 1
                    const inputElement = bitElements[0].children[i].children[1] as HTMLInputElement
                    inputElement.value = facit[inputFieldName][i] || '';
                }
                break;
            default:
                const textElement = (containerElement.children[1].children[0] as HTMLInputElement);
                textElement.value = facit[inputFieldName] || '';
                break;
        }

        setInput((prevState) => ({ ...prevState, [inputFieldName]: facit[inputFieldName] }));
    }

    /*     // To determine the physical address bits width when it is not explicitly given,
         // you need to consider the relationship between the virtual address space, 
         // the page size, and the physical memory size.
         const numOfPages = (2 ** virtualAddressWidth) / pageSize;
         const physicalPageMemory = numOfPages * pageSize;
         const physAddressWidth = Math.floor(Math.log2(physicalPageMemory)); */



    function validateFieldInput(inputFieldName: InputField): boolean {
        // TODO: nice to have (in the settings menu)
        // incremental correct feedback
        if (!isPPNFocused && inputFieldName === "PPN") {
            return false
        } 

        if (!isPhysAddFocused && inputFieldName === "PhysicalAddress") {
            return false
        }

        // If PPN eller phys og at ev ikke findes, så skal den return false;
        //ppnRef.current?.onfocus
        return input[inputFieldName] == facit[inputFieldName]
    }



    // Handle changes in input fields
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: InputField) => {
        const regexBits = /^[01]*$/; // regular expression to match only 1's and 0's
        const regexYN = /^[YN]*$/; // regular expression to match only Y AND N
        const regexHexChars = /^[0-9a-fA-F]*$/; // regular expression to match only hex characters
        const input = event.target.value;

        switch (fieldName) {
            case InputFieldsMap.VirtualAddress:
                if (!regexBits.test(input)) {
                    event.target.value = '';
                    return;
                }
                setInput((prevState) => ({ ...prevState, [fieldName]: getElementValuesFrom("vbit-input") }));
                break;

            case InputFieldsMap.VPN:
            case InputFieldsMap.TLBT:
            case InputFieldsMap.TLBI:
            case InputFieldsMap.PPN:
                if (!regexHexChars.test(input)) {
                    event.target.value = '';
                    return;
                }
                setInput((prevState) => ({ ...prevState, [fieldName]: input }));
                break;

            case InputFieldsMap.PageFault:
            case InputFieldsMap.TLBHIT:
                if (!regexYN.test(input)) {
                    event.target.value = '';
                    return;
                }

                setInput((prevState) => ({ ...prevState, [fieldName]: input }));
                break;

            case InputFieldsMap.PhysicalAddress:
                if (!regexBits.test(input)) {
                    event.target.value = '';
                    return;
                }
                setInput((prevState) => ({ ...prevState, [fieldName]: getElementValuesFrom("pbit-input") }));
                break;

            default:
                console.log('idk even know what happened');
                break;
        }
    };

    // Handle changes in color
    function handleColorChange(color: ColorResult): void {
        console.log("color: ", color.hex)
        console.log("color: ", color)
        setColor(color.hex)
    }


    return (
        <>

            <Toast
                ref={toast}
                position="bottom-left"
            />
            <div className="input-table">

                <div className='input-header'>
                    <button
                        className='reset-color-btn'
                        onClick={resetColors}
                    >
                        Reset the colors
                    </button>

                    <h2>Virtual address: {addressPrefix + VirtualAddress.toString(baseConversion).toUpperCase()}</h2>
                    <HuePicker
                        width={'200px'}
                        color={color}
                        onChange={handleColorChange}
                    />
                    <h4>Click and drag to highlight bits or labels <br /> </h4>

                </div>
                <div className='virtual-wrapper'>
                    <ol>
                        <li>
                            <div className={`list-item-wrapper`}>
                                <p>Bits of virtual address</p>
                                <div className={`list-item-bit-input-wrapper `}>
                                    {createNullArr(virtualAddressWidth).map((_, index) => (
                                        <div
                                            className='input-wrapper'
                                            onMouseDown={handleMouseDown}
                                            onMouseUp={handleMouseUp}
                                            onMouseEnter={handleMouseEnter}
                                        >
                                            <p className="input-text">{virtualAddressWidth - index - 1}</p>
                                            <input
                                                id='vbit'
                                                className={`vbit-input ${validateFieldInput(InputFieldsMap.VirtualAddress) ? 'correct' : ''}`}
                                                name='VirtualAddress'
                                                maxLength={1}
                                                onChange={(ev) => handleInputChange(ev, InputFieldsMap.VirtualAddress)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button className={'insert-facit-btn'}
                                    onClick={(ev) => insertFacit(InputFieldsMap.VirtualAddress, ev)}

                                >
                                    Insert facit
                                </button>
                            </div>
                        </li>

                        <li>
                            <div className='list-item-wrapper'>
                                <p>Address Translation</p>

                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>Parameter</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr >
                                            <td
                                                onMouseDown={handleMouseDown}
                                                onMouseUp={handleMouseUp}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                <p
                                                    className={'exercise-label'}
                                                >
                                                    VPN
                                                </p>
                                            </td>

                                            <td>
                                                <input
                                                    className={`${validateFieldInput(InputFieldsMap.VPN) ? ' correct' : ''}`}
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.VPN)}
                                                />
                                            </td>
                                            <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.VPN, ev)}>Insert facit</button>
                                        </tr>
                                        <tr>
                                            <td
                                                onMouseDown={handleMouseDown}
                                                onMouseUp={handleMouseUp}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                <p
                                                    className={'exercise-label'}
                                                >
                                                    TLB index
                                                </p>
                                            </td>
                                            <td>
                                                <input
                                                    className={`${validateFieldInput(InputFieldsMap.TLBI) ? ' correct' : ''} `}
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.TLBI)}
                                                />
                                            </td>
                                            <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.TLBI, ev)}>Insert facit</button>
                                        </tr>
                                        <tr >
                                            <td
                                                onMouseDown={handleMouseDown}
                                                onMouseUp={handleMouseUp}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                <p
                                                    className={'exercise-label'}
                                                >
                                                    TLB tag
                                                </p>
                                            </td>
                                            <td>
                                                <input
                                                    className={`${validateFieldInput(InputFieldsMap.TLBT) ? ' correct' : ''}`}
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.TLBT)}
                                                />
                                            </td>
                                            <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.TLBT, ev)}>Insert facit</button>
                                        </tr>
                                        <tr >
                                            <td
                                                onMouseDown={handleMouseDown}
                                                onMouseUp={handleMouseUp}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                <p
                                                    className={'exercise-label'}
                                                >
                                                    TLB hit? (Y/N)
                                                </p>
                                            </td>
                                            <td>
                                                <input
                                                    className={`${validateFieldInput(InputFieldsMap.TLBHIT) ? ' correct' : ''}`}
                                                    maxLength={1}
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.TLBHIT)}
                                                />
                                            </td>
                                            <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.TLBHIT, ev)}>Insert facit</button>
                                        </tr>
                                        <tr className={`${validateFieldInput(InputFieldsMap.PageFault) ? ' correct' : ''}`}>
                                            <td
                                                onMouseDown={handleMouseDown}
                                                onMouseUp={handleMouseUp}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                <p
                                                    className={'exercise-label'}
                                                >
                                                    Page fault? (Y/N)
                                                </p>
                                            </td>
                                            <td>
                                                <input
                                                    className={`${validateFieldInput(InputFieldsMap.PageFault) ? ' correct' : ''}`}
                                                    maxLength={1}
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.PageFault)}
                                                />
                                            </td>
                                            <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.PageFault, ev)}>Insert facit</button>
                                        </tr>
                                        <tr className={`${validateFieldInput(InputFieldsMap.PPN) ? ' correct' : ''}`}>
                                            <td
                                                onMouseDown={handleMouseDown}
                                                onMouseUp={handleMouseUp}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                <p
                                                    className={'exercise-label'}
                                                >
                                                    PPN
                                                </p>
                                            </td>
                                            <td>
                                                <input
                                                    className={`${validateFieldInput(InputFieldsMap.PPN) ? ' correct' : ''}`}
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.PPN)}
                                                    onFocus={() => setIsPPNFocused(true)}
                                                    // onBlur={() => setIsPPNFocused(false)}
                                                />
                                            </td>
                                            <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.PPN, ev)}>Insert facit</button>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                        <li>
                            <div className='list-item-wrapper'>
                                <p>Bits of phys. (if any)</p>
                                <div className={`list-item-bit-input-wrapper`}>
                                    {createNullArr(physcialAddressWidth).map((_, index) => (
                                        <div
                                            className='input-wrapper'
                                            onMouseDown={handleMouseDown}
                                            onMouseUp={handleMouseUp}
                                            onMouseEnter={handleMouseEnter}
                                        >
                                            <p className="input-text">{physcialAddressWidth - index - 1}</p>
                                            <input
                                                className={`pbit-input ${validateFieldInput(InputFieldsMap.PhysicalAddress) ? 'correct' : ''}`}
                                                maxLength={1}
                                                onChange={(ev) => handleInputChange(ev, InputFieldsMap.PhysicalAddress)}
                                                onFocus={() => setIsPhysAddFocused(true)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.PhysicalAddress, ev)}>Insert Facit</button>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </>
    )
}

export default Input_table;
