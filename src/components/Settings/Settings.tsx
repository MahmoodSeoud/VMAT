import { SetStateAction, useState } from "react";
import { InputFieldsMap, Result } from "../../App";
import { SelectItemOptionsType } from "primereact/selectitem";
import { Dropdown } from "primereact/dropdown";
import { styled, alpha, Box } from '@mui/system';
import { Slider as BaseSlider, sliderClasses } from '@mui/base/Slider';
import { InputNumber } from "primereact/inputnumber";
import { Card } from 'primereact/card';

import './Settings.css';
import '../../Laratheme.css'
import Tlb_table from "../Tlb_table/Tlb_table";
import { Mark } from "@mui/base";


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

const marks = [
    {
        value: 0,
        label: '4',
    },
    {
        value: 25,
        label: '8',
    },
    {
        value: 50,
        label: '16',
    },
    {
        value: 75,
        label: '32',
    },
    {
        value: 100,
        label: '64',
    },
];


export default function Settings({
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
    setPageSize
    setPhysicalAddressBitWidth
    setVirtualAddressBitWidth
    TLBWays
    virtualAddressBitWidth
    physicalAddressBitWidth
    pageSize
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





    function showDescription(): void {
        throw new Error("Function not implemented.");
    }


    function handleTLBSetTable(value: number): void {

        const index = marks.findIndex(mark => value === mark.value);
        setTLBSets(Number(marks[index].label))
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
                    </Card>


                </>
            )
            }
            <DiscreteSliderValues
                handleTLBSetTable={handleTLBSetTable}
            />
        </>
    );
}





function DiscreteSliderValues(props: any) {

    return (
        <Box sx={{ width: 300 }}>
            <Slider
                defaultValue={25}
                getAriaValueText={valuetext}
                step={null}
                onChange={(e, value): any => props.handleTLBSetTable(value)}
                marks={marks}
            />
        </Box>
    );
}



function valuetext(value: number) {
    return `${value}°C`;
}

const blue = {
    100: '#DAECFF',
    200: '#99CCF3',
    400: '#3399FF',
    300: '#66B2FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B3',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Slider = styled(BaseSlider)(
    ({ theme }) => `
  color: ${theme.palette.mode === 'light' ? blue[500] : blue[400]};
  height: 6px;
  width: 100%;
  padding: 16px 0;
  display: inline-block;
  position: relative;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;

  &.${sliderClasses.disabled} { 
    pointer-events: none;
    cursor: default;
    color: ${theme.palette.mode === 'light' ? grey[300] : grey[600]};
    opacity: 0.5;
  }

  & .${sliderClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background-color: currentColor;
    opacity: 0.4;
  }

  & .${sliderClasses.track} {
    display: block;
    position: absolute;
    height: 4px;
    border-radius: 2px;
    background-color: currentColor;
  }

  & .${sliderClasses.thumb} {
    position: absolute;
    width: 16px;
    height: 16px;
    margin-left: -6px;
    margin-top: -6px;
    box-sizing: border-box;
    border-radius: 50%;
    outline: 0;
    border: 3px solid currentColor;
    background-color: #fff;

    &:hover{
      box-shadow: 0 0 0 4px ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[300],
        0.3,
    )};
    }
    
    &.${sliderClasses.focusVisible} {
      box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
      outline: none;
    }

    &.${sliderClasses.active} {
      box-shadow: 0 0 0 5px ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[300],
        0.5,
    )};
      outline: none;
    }
  }

  & .${sliderClasses.mark} {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 99%;
    background-color: ${theme.palette.mode === 'light' ? blue[200] : blue[900]};
    top: 43%;
    transform: translateX(-50%);
  }

  & .${sliderClasses.markActive} {
    background-color: ${theme.palette.mode === 'light' ? blue[500] : blue[400]};
  }

  & .${sliderClasses.markLabel} {
    font-family: IBM Plex Sans;
    font-weight: 600;
    font-size: 12px;
    position: absolute;
    top: 20px;
    transform: translateX(-50%);
    margin-top: 8px;
  }
`,
);