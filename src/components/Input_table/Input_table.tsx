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
    facit: InputFields;
    clearInput: boolean;
    setClearInput: React.Dispatch<React.SetStateAction<boolean>>;
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


function resetColors() {
    const bitElements = document.getElementsByClassName('input-text') as HTMLCollectionOf<HTMLElement>;
    const textElements = document.getElementsByClassName('exercise-label') as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < bitElements.length; i++) {
        const isHighligted = bitElements && bitElements[i] && bitElements[i].classList.contains('highlight');

        if (isHighligted) {
            bitElements[i].classList.remove('highlight');
            bitElements[i].style.backgroundColor = '';
        }
    }

    for (let i = 0; i < bitElements.length; i++) {
        const isHighligted = textElements && textElements[i] && textElements[i].classList.contains('highlight');

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




function Input_table({
    VirtualAddress,
    addressPrefix,
    baseConversion,
    virtualAddressWidth,
    physcialAddressWidth,
    facit,
    clearInput,
    setClearInput
}: Input_tableProps): JSX.Element {
    console.log('input_table rendered');





    function resetAllParameters() {
            const inputCollection = document.getElementsByTagName("input")
            for (let i = 0; i < inputCollection.length; i++) {
                (inputCollection[i] as HTMLInputElement).value = "";
                (inputCollection[i] as HTMLInputElement).classList.remove('correct');
                setInput(emptyInput);
            }
    }

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
    const [color, setColor] = useState<string>("#" + createRandomNumberWith(4 * 6).toString(16));
    const [isPPNFocused, setIsPPNFocused] = useState(false);
    const [isPhysAddFocused, setIsPhysAddFocused] = useState(false);

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

        if (deepEqual(facit, input) && !deepEqual(input, emptyInput)) {
            // Show success mes
            showSuccess();
        }
    }, [input])


    useEffect(() => {
        if (clearInput) {
            resetAllParameters();
            setClearInput(false);
        }
    }, [clearInput])


    function handleMouseDown(e: React.MouseEvent) {
        const pTagWithIndex = e.currentTarget as HTMLElement;
        const isHighligted = pTagWithIndex.classList.contains('highlight');

        if (isHighligted) {
            pTagWithIndex.classList.remove('highlight');
            // Setting the color the the one selected in the color picker
            pTagWithIndex.style.backgroundColor = "";
        } else {

            setIsMouseDown(true);
            // Apply highlight to the current div
            pTagWithIndex.classList.add('highlight');
            // Setting the color the the one selected in the color picker
            pTagWithIndex.style.backgroundColor = color;

        }
    };

    function handleMouseUp(e: React.MouseEvent) {
        setIsMouseDown(false);
    };

    function handleMouseEnter(e: React.MouseEvent) {
        if (isMouseDown) {
            // Apply highlight to the current div
            const pTagWithIndex = e.currentTarget as HTMLElement;
            pTagWithIndex.classList.add('highlight');

            // Setting the color the the one selected in the color picker
            pTagWithIndex.style.backgroundColor = color;
        }
    };



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
                const textElement = (containerElement.parentElement?.children[1].firstChild as HTMLInputElement);
                console.log(containerElement.parentElement)
                textElement.value = facit[inputFieldName] || '';
                break;
        }

        setInput((prevState: InputFields) => ({ ...prevState, [inputFieldName]: facit[inputFieldName] }));
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
                setInput((prevState: InputFields) => ({ ...prevState, [fieldName]: getElementValuesFrom("vbit-input") }));
                break;

            case InputFieldsMap.VPN:
            case InputFieldsMap.TLBT:
            case InputFieldsMap.TLBI:
            case InputFieldsMap.PPN:
                if (!regexHexChars.test(input)) {
                    event.target.value = '';
                    return;
                }
                setInput((prevState: InputFields) => ({ ...prevState, [fieldName]: input }));
                break;

            case InputFieldsMap.PageFault:
            case InputFieldsMap.TLBHIT:
                if (!regexYN.test(input)) {
                    event.target.value = '';
                    return;
                }

                setInput((prevState: InputFields) => ({ ...prevState, [fieldName]: input }));
                break;

            case InputFieldsMap.PhysicalAddress:
                if (!regexBits.test(input)) {
                    event.target.value = '';
                    return;
                }
                setInput((prevState: InputFields) => ({ ...prevState, [fieldName]: getElementValuesFrom("pbit-input") }));
                break;

            default:
                break;
        }
    };

    // Handle changes in color
    function handleColorChange(color: ColorResult): void {
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
                    <button
                        className='reset-color-btn'
                        onClick={resetAllParameters}
                    >
                        Reset Input
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
                                            key={index}
                                            className='input-wrapper'
                                        >
                                            <p
                                                className="input-text"
                                                onMouseDown={handleMouseDown}
                                                onMouseUp={handleMouseUp}
                                                onMouseEnter={handleMouseEnter}

                                            >
                                                {virtualAddressWidth - index - 1}
                                            </p>
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
                                            <td>
                                                <p
                                                    className={'exercise-label'}
                                                    onMouseDown={handleMouseDown}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseEnter={handleMouseEnter}
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

                                            <td>
                                                <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.VPN, ev)}>Insert facit</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                            >
                                                <p
                                                    className={'exercise-label'}
                                                    onMouseDown={handleMouseDown}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseEnter={handleMouseEnter}
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

                                            <td>
                                                <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.TLBI, ev)}>Insert facit</button>
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>
                                                <p
                                                    className={'exercise-label'}
                                                    onMouseDown={handleMouseDown}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseEnter={handleMouseEnter}
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
                                            <td>
                                                <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.TLBT, ev)}>Insert facit</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p
                                                    className={'exercise-label'}
                                                    onMouseDown={handleMouseDown}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseEnter={handleMouseEnter}
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
                                            <td>
                                                <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.TLBHIT, ev)}>Insert facit</button>
                                            </td>
                                        </tr>
                                        <tr className={`${validateFieldInput(InputFieldsMap.PageFault) ? ' correct' : ''}`}>
                                            <td>
                                                <p
                                                    className={'exercise-label'}
                                                    onMouseDown={handleMouseDown}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseEnter={handleMouseEnter}
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
                                            <td>
                                                <button className={'insert-facit-btn'} onClick={(ev) => insertFacit(InputFieldsMap.PageFault, ev)}>Insert facit</button>
                                            </td>
                                        </tr>
                                        <tr
                                            className={`${validateFieldInput(InputFieldsMap.PPN) ? ' correct' : ''}`}
                                        >
                                            <td>
                                                <p
                                                    className={'exercise-label'}
                                                    onMouseDown={handleMouseDown}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseEnter={handleMouseEnter}
                                                >
                                                    PPN
                                                </p>
                                            </td>
                                            <td>
                                                <input
                                                    className={`${validateFieldInput(InputFieldsMap.PPN) ? ' correct' : ''}`}
                                                    onChange={(ev) => handleInputChange(ev, InputFieldsMap.PPN)}
                                                    onFocus={() => setIsPPNFocused(true)}
                                                />
                                            </td>
                                            <td>

                                                <button className={'insert-facit-btn'} onClick={(ev) => {
                                                    insertFacit(InputFieldsMap.PPN, ev);
                                                    setIsPPNFocused(true);
                                                }}>
                                                    Insert facit
                                                </button>
                                            </td>
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
                                            key={index}
                                            className='input-wrapper'
                                        >
                                            <p
                                                className="input-text"
                                                onMouseDown={handleMouseDown}
                                                onMouseUp={handleMouseUp}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                {physcialAddressWidth - index - 1}
                                            </p>
                                            <input
                                                className={`pbit-input ${validateFieldInput(InputFieldsMap.PhysicalAddress) ? 'correct' : ''}`}
                                                maxLength={1}
                                                onChange={(ev) => handleInputChange(ev, InputFieldsMap.PhysicalAddress)}
                                                onFocus={() => setIsPhysAddFocused(true)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className={'insert-facit-btn'}
                                    onClick={(ev) => {
                                        insertFacit(InputFieldsMap.PhysicalAddress, ev)
                                        setIsPhysAddFocused(true);
                                    }}
                                >
                                    Insert Facit
                                </button>
                            </div>
                        </li>
                    </ol>
                </div>

            </div>
        </>
    )
}

export default Input_table;
