import { SetStateAction, useState } from "react";
import { InputFieldsMap, Result } from "../../App";
import { SelectItemOptionsType } from "primereact/selectitem";
import { Dropdown } from "primereact/dropdown";
import { Slider } from "primereact/slider";
import { InputNumber } from "primereact/inputnumber";
import { Card } from 'primereact/card';

import './Settings.css';
import '../../Laratheme.css'


interface SettingsProps {
    setAssignmentType: React.Dispatch<SetStateAction<Result>>;
    assignmentType: Result;
    TLBWays: number;
    setTLBWays: React.Dispatch<SetStateAction<number>>;
    TLBSets: number;
    setTLBSets: React.Dispatch<SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<SetStateAction<16 | 32 | 64>>;
    virtualAddressBitWidth: number;
    setVirtualAddressBitWidth: React.Dispatch<SetStateAction<number>>;
    physicalAddressBitWidth: number;
    setPhysicalAddressBitWidth: React.Dispatch<SetStateAction<number>>;
}


function Settings({
    setAssignmentType,
    setPageSize,
    setPhysicalAddressBitWidth,
    setTLBSets,
    setTLBWays,
    setVirtualAddressBitWidth,
    assignmentType,
    TLBSets,
    TLBWays,
    virtualAddressBitWidth,
    physicalAddressBitWidth,
    pageSize
}: SettingsProps) {
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





    function showDescription(parameter?: SettingsProps): void {
        throw new Error("Function not implemented.");
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
                    <Card className="p-m-2">
                        <h3 className="p-text-center">Settings</h3>

                        <div className="p-field p-mt-3">
                            <label htmlFor="assignmentType" className="p-d-block">Select an Assignment Type: </label>
                            <Dropdown
                                id="assignmentType"
                                value={{ name: assignmentType, code: assignmentType }}
                                onChange={(e) => setAssignmentType(e.value.name)}
                                optionLabel="name"
                                options={assignmentTypeOptions}
                                placeholder="Select Assignment Type"
                                className="w-full md:w-14rem"
                            />
                        </div>

                        <div className="p-field p-mt-1">

                            <div className="p-inputgroup">
                                <i
                                    className="pi pi-question-circle"
                                    style={{ fontSize: '1.2em', cursor: 'pointer' }}
                                    onFocus={() => showDescription()}
                                />
                                <label htmlFor="assignmentType" className="p-d-block"> TLB Ways: </label>
                                <InputNumber
                                    id="tlbWays"
                                    value={TLBSets}
                                    className="w-full md:w-14rem"
                                    disabled
                                />
                            </div>
                            <Slider
                                id="tlbWaysSlider"
                                value={TLBSets}
                                onChange={(e) => setTLBWays(e.value as number)}
                                min={4}
                                max={8}
                                className="w-full"
                                step={1}
                            />
                        </div>

                        <div className="p-field p-mt-1">
                            <div className="p-inputgroup">
                                <i
                                    className="pi pi-question-circle"
                                    style={{ fontSize: '1.2em', cursor: 'pointer' }}
                                    onFocus={() => showDescription()}
                                />
                                <label htmlFor="assignmentType" className="p-d-block"> TLB Sets: </label>
                                <InputNumber
                                    id="tlbSets"
                                    value={TLBSets}
                                    className="w-full md:w-14rem"
                                    disabled
                                />
                            </div>
                            <Slider
                                id="tlbSetsSlider"
                                value={TLBSets}
                                onChange={(e) => setTLBSets(e.value as number)}
                                min={4}
                                max={8}
                                className="w-full"
                                step={1}
                            />
                        </div>



                    </Card>


                </>
            )}
        </>
    );
}

export default Settings;