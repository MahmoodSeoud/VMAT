import { SetStateAction, useState } from "react";
import { InputFieldsMap, Result } from "../../App";
import { SelectItemOptionsType } from "primereact/selectitem";
import { Dropdown } from "primereact/dropdown";




interface SettingsProps {
    setAssignmentType: React.Dispatch<SetStateAction<Result>>;
    assignmentType: Result;
}


function Settings({ setAssignmentType, assignmentType }: SettingsProps) {
    const [showSettings, setShowSettings] = useState<boolean>(false);

    const assignmentTypeOptions: SelectItemOptionsType = [
        {
            name: InputFieldsMap.TLBHIT,
            code: InputFieldsMap.TLBHIT
        },
        {
            name: InputFieldsMap.PageFault,
            code: InputFieldsMap.PageFault
        },
        {
            name: InputFieldsMap.PageHit,
            code: InputFieldsMap.PageHit
        }
    ]

    function handleDropdownChange(value: any) {
        setAssignmentType(value.name)
    }

    return (
        <>
            <i
                className="pi pi-cog"
                style={{ fontSize: '2em', cursor: 'pointer' }}
                onClick={() => setShowSettings(!showSettings)}
            />

            {showSettings && (
                <>
                    <div className='settings-wrapper'
                        onMouseLeave={() => setShowSettings(false)}>
                        <h3>Settings</h3>
                        <Dropdown
                            value={{name: assignmentType, code: assignmentType}}
                            onChange={(e) => handleDropdownChange(e.value)}
                            optionLabel="name"
                            options={assignmentTypeOptions}
                            showClear
                            placeholder="Select Assignment Type"
                            className="w-full md:w-14rem"
                        />
                        <p>TLB-Ways:</p>
                        <p>TLB Sets</p>
                        <p>Page size</p>
                        <p>Virtual Address bit length</p>
                    </div>
                </>
            )}
        </>
    );
}

export default Settings;